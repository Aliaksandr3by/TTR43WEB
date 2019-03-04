using AngleSharp;
using AngleSharp.Dom;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace TTR43WEB.Models.Gipermall
{
    public class GetDataFromGipermall
    {
        readonly private Product _product;
        public GetDataFromGipermall(Product product)
        {
            this._product = product;
        }

        private async Task<IHtmlCollection<IElement>> GetDataAngleSharp(string url, string selectors)
        {
            var config = Configuration.Default.WithDefaultLoader();
            var document = await BrowsingContext.New(config).OpenAsync(url);
            return document.QuerySelectorAll(selectors);
        }

        /// <summary>
        /// Метод определяет цену
        /// </summary>
        /// <param name="tmp"></param>
        /// <returns>возвращает цену / безу без скидки</returns>

        async Task<Dictionary<string, string>> GetDescription(string url, string selectors)
        {
            try
            {
                var cells = await Task.Run(() => GetDataAngleSharp(url, selectors));

                Dictionary<string, string> keyValuePairs = new Dictionary<string, string>();

                foreach (var item_ul in cells)
                {

                    foreach (var item_li in item_ul.QuerySelectorAll("li"))
                    {
                        var a1 = item_li.QuerySelector("strong").TextContent.ToString();
                        var a2 = item_li.QuerySelector("span").TextContent.ToString();
                        keyValuePairs.Add(a1, a2);
                    }
                }

                if (cells.Length <= 0)
                {
                    keyValuePairs.Add("error", url.ToString());
                }

                return keyValuePairs;
            }
            catch (Exception ex)
            {
                return new Dictionary<string, string>
                {
                    [ex.Source] = ex.Message
                };
            }
        }

        private decimal? ParseCost(string tmp = "", string rex = "")
        {
            try
            {
                Regex regex = new Regex(rex, RegexOptions.Compiled | RegexOptions.IgnoreCase | RegexOptions.CultureInvariant);
                MatchCollection matches = regex.Matches(tmp);
                decimal result = decimal.Parse(
                        s: matches.FirstOrDefault().Value.Replace("р", string.Empty).Replace("к.", string.Empty),
                        provider: CultureInfo.InvariantCulture);
                return result;
            }
            catch (Exception)
            {
                return default;
            }
        }
        async Task<decimal?> GetElement(string url, string selectors, Func<string, string, decimal?> func, string rex)
        {
            try
            {
                var result = (await Task.Run(() => GetDataAngleSharp(url, selectors))).FirstOrDefault()?.TextContent;

                return func(result, rex);
            }
            catch (Exception)
            {
                return default;
            }
        }
        async Task<string> GetElement(string url, string selectors)
        {
            try
            {
                var result = (await Task.Run(() => GetDataAngleSharp(url, selectors))).FirstOrDefault()?.TextContent;

                return result;
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public async Task<Product> GetFullDescriptionResult(string url)
        {
            Dictionary<string, string> keyValuePairs = await Task.Run(() => GetDescription(url, "ul.description"));

            try
            {
                using (ContextGipermall db = new ContextGipermall())
                {
                    ///"Название"
                    _product.Name = await Task.Run(() => GetElement(url, "div.breadcrumbs span"));
                    ///"Адрес"
                    _product.Url = url;
                    ///"Время"
                    _product.Date = DateTime.Now;
                    ///"Цена"
                    _product.Price = await Task.Run(() => GetElement(url, "div.products_card form.forms div.price_byn div.price", ParseCost, @"^\d*р.\d*к."));
                    ///"Цена без скидки"
                    _product.PriceWithoutDiscount = await Task.Run(() => GetElement(url, "div.products_card form.forms div.price_byn div.price", ParseCost, @"\d*р.\d*к.\s*$"));
                    ///"Размерность"
                    _product.Dimension = await Task.Run(() => GetElement(url, "div.products_card form.forms div.price_byn small.kg"));
                    ///
                    _product.MarkingGoods = keyValuePairs.FirstOrDefault(x => x.Key.Contains("Артикул")).Value;
                    _product.BarCode = keyValuePairs["Штрих-код:"];
                    _product.ManufacturingCountry = keyValuePairs["Страна производства:"];
                    _product.Trademark = keyValuePairs["Торговая марка:"];
                    _product.Mass = double.Parse(
                        s: keyValuePairs["Масса / Объем:"].Replace(" кг", string.Empty),
                        provider: CultureInfo.InvariantCulture);
                    _product.PriceForMass = decimal.Parse(
                        s: keyValuePairs["Цена за 1 кг:"],
                        provider: CultureInfo.InvariantCulture);



                    db.Products.Add(_product);
                    db.SaveChanges();

                    return _product;
                }
            }
            catch (Exception)
            {
                return _product;
            }
        }

    }
}
