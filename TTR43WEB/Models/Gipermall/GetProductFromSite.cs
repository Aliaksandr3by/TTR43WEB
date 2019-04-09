using AngleSharp;
using AngleSharp.Dom;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using TTR43WEB.Models.Gipermall;
using DatumServer.Datum.Product;

namespace TTR43WEB.Models.Gipermall
{
    public class GetProductFromSite
    {
        readonly private ProductEntity _productNew;
        private readonly string _url;

        public GetProductFromSite(string url)
        {
            this._productNew = new ProductEntity();
            _url = url;
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
        async Task<Dictionary<string, string>> GetProductDescription(string url, string selectors)
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
            catch (Exception)
            {
                throw;
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

        async Task<int?> GetElementAttr(string url, string selectors)
        {
            try
            {
                var result = Convert.ToInt32((await Task.Run(() => GetDataAngleSharp(url, selectors))).FirstOrDefault()?.GetAttribute("data-product-id"));

                return result;
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
            catch (Exception)
            {
                return default;
            }
        }

        public async Task<ProductEntity> GetFullDescriptionResult()
        {
            try
            {
                Dictionary<string, string> keyValuePairs = await Task.Run(() => GetProductDescription(_url, "ul.description"));

                _productNew.Name = await Task.Run(() => GetElement(_url, "div.breadcrumbs span"));

                _productNew.Url = _url;

                _productNew.Date = DateTime.Now;

                _productNew.Price = await Task.Run(() => GetElement(_url, "div.products_card form.forms div.price_byn div.price", ParseCost, @"^\d*р.\d*к."));

                _productNew.PriceWithoutDiscount = await Task.Run(() => GetElement(_url, "div.products_card form.forms div.price_byn div.price", ParseCost, @"\d*р.\d*к.\s*$"));

                _productNew.Dimension = await Task.Run(() => GetElement(_url, "div.products_card form.forms div.price_byn small.kg"));

                _productNew.MarkingGoods = ReplaceHelperInt(keyValuePairs, "Артикул:");

                _productNew.BarCode = ReplaceHelper(keyValuePairs, "Штрих-код:");

                _productNew.ManufacturingCountry = ReplaceHelper(keyValuePairs, "Страна производства:");

                _productNew.Trademark = ReplaceHelper(keyValuePairs, "Торговая марка:");

                _productNew.Mass = ReplaceHelper(keyValuePairs, "Масса / Объем:", @"[^0-9,.]");

                _productNew.PriceOneKilogram = ReplaceHelper(keyValuePairs, "Цена за 1 кг:", (e) => decimal.Parse(e, CultureInfo.InvariantCulture));

                _productNew.PriceOneLiter = ReplaceHelper(keyValuePairs, "Цена за 1 л:", (e) => decimal.Parse(e, CultureInfo.InvariantCulture));

                return _productNew;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public decimal? ReplaceHelper(Dictionary<string, string> keyValuePairs, string key, Func<string, decimal?> fn)
        {
            try
            {
                if (keyValuePairs.ContainsKey(key))
                {
                    return keyValuePairs.ContainsKey(key)
                        ? fn(keyValuePairs[key])
                        : default;
                }
                else
                {
                    return default;
                }
            }
            catch (Exception)
            {
                return default;
            }
        }

        public double? ReplaceHelper(Dictionary<string, string> keyValuePairs, string key, string pattern)
        {
            try
            {
                if (keyValuePairs.ContainsKey(key))
                {
                    Regex regexMass = new Regex(pattern, RegexOptions.Compiled | RegexOptions.IgnoreCase | RegexOptions.CultureInvariant);
                    var tp = regexMass.Replace(keyValuePairs["Масса / Объем:"], string.Empty);
                    return double.Parse(s: tp, provider: CultureInfo.InvariantCulture);
                }
                else
                {
                    return default;
                }
            }
            catch (Exception)
            {
                return default;
            }
        }

        public string ReplaceHelper(Dictionary<string, string> keyValuePairs, string key)
        {
            try
            {
                if (keyValuePairs.ContainsKey(key))
                {
                    return keyValuePairs.ContainsKey(key) ? keyValuePairs[key] : string.Empty;
                }
                else
                {
                    return default;
                }
            }
            catch (Exception)
            {
                return default;
            }
        }

        public int? ReplaceHelperInt(Dictionary<string, string> keyValuePairs, string key)
        {
            try
            {
                if (keyValuePairs.ContainsKey(key))
                {
                    return int.Parse(keyValuePairs.GetValueOrDefault(key));
                }
                else
                {
                    return default;
                }
            }
            catch (Exception)
            {
                return default;
            }
        }
    }
}
