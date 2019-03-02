using AngleSharp;
using AngleSharp.Dom;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace TTR43WEB.Models
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

        private decimal?[] ParseCost(string tmp = "")
        {
            try
            {
                Regex regex = new Regex(@"\d*р.\d*к.", RegexOptions.Compiled | RegexOptions.IgnoreCase | RegexOptions.CultureInvariant);

                MatchCollection matches = regex.Matches(tmp);

                var result = new decimal?[matches.Count];

                int index = 0;
                foreach (Match item in matches)
                {
                    result[index++] = decimal.Parse(
                        s: item.Value.Replace("р", string.Empty).Replace("к.", string.Empty),
                        provider: CultureInfo.InvariantCulture);
                }

                return result;
            }
            catch (Exception)
            {
                return default;
            }
        }
        async Task<Dictionary<string, string>> GetElement(string url, string selectors, Func<string, decimal?[]> func = null)
        {
            try
            {
                var data = (await Task.Run(() => GetDataAngleSharp(url, selectors))).FirstOrDefault()?.TextContent;
                var result = new Dictionary<string, string>();
                var tmp = func(data);

                string _getDec(int i){
                    return tmp?[i]?.ToString("C2") ?? String.Empty;
                }

                switch (tmp.Length)
                {
                    case 0:
                        result.Add("Цена:", "");
                        result.Add("Цена без скидки:", "");
                        break;
                    case 1:
                        result.Add("Цена:", _getDec(0));
                        result.Add("Цена без скидки:", "");

                        break;
                    case 2:
                        result.Add("Цена:", _getDec(0));
                        result.Add("Цена без скидки:", _getDec(1));
                        break;
                }



                return result;
            }
            catch (Exception ex)
            {
                return new Dictionary<string, string>
                {
                    [ex.Source] = ex.Message
                };
            }
        }
        async Task<Dictionary<string, string>> GetElement(string url, string selectors, string name = "Неизвестно")
        {
            try
            {
                var data = (await Task.Run(() => GetDataAngleSharp(url, selectors))).FirstOrDefault()?.TextContent;
                var result = new Dictionary<string, string>
                {
                    [name] = data
                };
                return result;
            }
            catch (Exception ex)
            {
                return new Dictionary<string, string>
                {
                    [ex.Source] = ex.Message
                };
            }
        }

        public async Task<List<Dictionary<string, string>>> GetDescriptionResult(string[] urls)
        {
            List<Dictionary<string, string>> temp = new List<Dictionary<string, string>>();
            Dictionary<string, string> keyValuePairs = null;

            try
            {
                foreach (var item in urls)
                {
                    keyValuePairs = (await Task.Run(() => GetElement(item, "div.breadcrumbs span", "Название")))
                        .Concat(await Task.Run(() => GetElement(item, "div.products_card form.forms div.price_byn div.price", ParseCost)))
                        .Concat(await Task.Run(() => GetElement(item, "div.products_card form.forms div.price_byn small.kg", "Размерность:")))
                        .Concat(await Task.Run(() => GetDescription(item, "ul.description")))
                        .ToDictionary(x => x.Key, x => x.Value);
                    temp.Add(keyValuePairs);
                }
            }
            catch (Exception ex)
            {
                temp.Add(new Dictionary<string, string>
                {
                    [ex.StackTrace] = ex.Message
                });
            }
            return temp;
        }

    }
}
