using AngleSharp;
using AngleSharp.Dom;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TTR43WEB.Models
{
    public class DataSend
    {
        public string[] value { get; set; }
    }
    public static class GetDataFromGipermall
    {
        static async Task<IHtmlCollection<IElement>> _getDataAngleSharp(string url, string selectors)
        {
            var config = Configuration.Default.WithDefaultLoader();
            var address = url;
            var document = await BrowsingContext.New(config).OpenAsync(address);
            var cells = document.QuerySelectorAll(selectors);
            return cells;
        }

        static async Task<Dictionary<string, string>> _getDescription(string url)
        {
            var cells = await Task.Run(() => _getDataAngleSharp(url, "ul.description"));

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
        static async Task<string> _getName(string url, string selectors = "div.breadcrumbs span")
        {
            var cellsPrice = (await Task.Run(() => _getDataAngleSharp(url, selectors))).FirstOrDefault()?.TextContent; //TextContent = "29р.99к.
            return cellsPrice ?? "отсутствует";
        }
        static async Task<string> _getPrice(string url, string selectors = "form.forms div.price")
        {
            var cellsPrice = (await Task.Run(() => _getDataAngleSharp(url, selectors))).FirstOrDefault()?.TextContent; //TextContent = "29р.99к.
            return cellsPrice ?? "отсутствует";
        }
        public static async Task<List<Dictionary<string, string>>> GetDescriptionResult(string[] urls)
        {
            List<Dictionary<string, string>> temp = new List<Dictionary<string, string>>();
            Dictionary<string, string> keyValuePairs = null;

            try
            {
                foreach (var item in urls)
                {
                    var tmp0 = new Dictionary<string, string>
                    {
                        ["Название: "] = await Task.Run(() => _getName(item))
                    };
                    var tmp1 = await Task.Run(() => _getDescription(item));
                    var tmp2 = new Dictionary<string, string>
                    {
                        ["Цена: "] = await Task.Run(() => _getPrice(item))
                    };
                    keyValuePairs = tmp0.Concat(tmp1).Concat(tmp2).ToDictionary(x => x.Key, x => x.Value);
                    temp.Add(keyValuePairs);
                }
            }
            catch (Exception ex)
            {
                temp.Add(new Dictionary<string, string>
                {
                    [ex.Source] = ex.Message
                });
            }
            return temp;
        }

    }
}
