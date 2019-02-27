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
        static async Task<IHtmlCollection<IElement>> _getDataAngleSharp(string url)
        {
            var config = Configuration.Default.WithDefaultLoader();
            var address = url;
            var document = await BrowsingContext.New(config).OpenAsync(address);
            var cellSelector = "ul.description";
            var cells = document.QuerySelectorAll(cellSelector);
            return cells;
        }

        static async Task<Dictionary<string, string>> _getDescription(string url)
        {
            var cells = await Task.Run(() => _getDataAngleSharp(url));
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

            var description = cells.FirstOrDefault().OuterHtml;
            return keyValuePairs;
        }

        public static async Task<List<Dictionary<string, string>>> GetDescriptionResult(string[] urls)
        {
            List<Dictionary<string, string>> temp = new List<Dictionary<string, string>>();    
            foreach (var item in urls)
            {
                temp.Add(await Task.Run(() => _getDescription(item)));
            }
            return temp;
        }

    }
}
