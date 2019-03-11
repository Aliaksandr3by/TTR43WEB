using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Primitives;
using TTR43WEB.Filters;
using Microsoft.EntityFrameworkCore;
using System.Text;
using Newtonsoft.Json.Linq;
using AngleSharp;
using Newtonsoft;
using TTR43WEB.Models.Gipermall;
using System.Net;

namespace TTR43WEB.Controllers
{

    public class ElementURIData
    {
        private string elementURI;
        public string ElementURI { get => elementURI; set => elementURI = value; }
    }
    public class PageSize
    {
        public int pageSize { get; set; }
    }
    public class GetDataTable
    {
        public int pageSize { get; set; }
        public int productPage { get; set; }
    }
    public class GipermallController : Controller
    {
        private readonly IGipermollTableData gipermollTableData;
        private readonly Product _product;
        public GipermallController(IGipermollTableData gipermollTable, Product product)
        {
            gipermollTableData = gipermollTable;
            _product = product;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpOptions]
        [ContentTypeJson]
        [AccessControlAllow]
        [Allow]
        public IActionResult OptionsURIinBase([FromBody]ElementURIData ElementURI)
        {
            try
            {
                HttpWebRequest request = (HttpWebRequest)WebRequest.Create(ElementURI.ElementURI);
                HttpWebResponse response = (HttpWebResponse)request.GetResponse();
                var statusCode = (int)response.StatusCode;

                var result = Json(new
                {
                    statusCode = statusCode,
                    isLoaded = true,
                });

                return result;
            }
            catch (WebException ex)
            {
                var result = Json(new
                {
                    isLoaded = false,
                });

                return result;
            }
        }

        [HttpPost]
        [ContentTypeJson]
        [AccessControlAllow]
        public IActionResult Table([FromBody]GetDataTable getDataTable)
        {
            var data = gipermollTableData.Products;

            GetDataTable _getDataTable = getDataTable;

            int pageSize = _getDataTable.pageSize;

            int totalItems = data.Count<Product>();

            int totalPages = (int)Math.Ceiling((decimal)totalItems / pageSize);

            int productPage = _getDataTable.productPage > totalPages || _getDataTable.productPage < 0 ? 0 : _getDataTable.productPage;

            Func<Product, DateTime?> fn2 = e => e.Date;

            int countProducts = data.Count<Product>();

            var valueDefault = from n in new int[] { totalItems, (new int[] { 200, totalItems }).Min(), 10, 15, 25, 30, 50, 75, 100, 150 }
                               where n <= totalItems && n < 250
                               orderby n
                               select n;

            var result = data
                .OrderByDescending(fn2)
                .Skip(productPage * pageSize)
                .Take((new int[] { pageSize, countProducts }).Min())
                .Select(e => new
                {
                    e.Id,
                    e.Url,
                    e.Name,
                    e.MarkingGoods,
                    e.Date,
                    e.Price,
                    e.PriceWithoutDiscount
                });
            //.AsQueryable<Product>();

            var ProductInfo = Json(new
            {
                items = result,
                isLoaded = true,
                productPage,
                totalPages,
                pageSize,
                valueDefault,
                totalItems
            });

            return ProductInfo;
        }

        [HttpPost]
        [ContentTypeJson]
        [AccessControlAllow]
        public async Task<IActionResult> AllItemsUrls()
        {
            var data = gipermollTableData.Products;

            //var description = (from b in data orderby b.Url descending select b.Url).Distinct();
            var description = data.OrderBy(e => e.Url).Select(e => e.Url).Distinct();

            var result = Json(new
            {
                description,
                isLoaded = true
            });

            return result;
        }

        [HttpPost]
        [ContentTypeJson]
        [AccessControlAllow]
        public async Task<IActionResult> GetCoastAsync([FromBody]JObject idGoods)
        {
            DataSend dataSendObj = idGoods.ToObject<DataSend>();

            GetDataFromGipermall getDataFromGipermall = new GetDataFromGipermall(_product);

            var _description = await getDataFromGipermall.GetFullDescriptionResult(dataSendObj.IdGoods, gipermollTableData.Products);
            var description = new
            {
                _description.Id,
                _description.MarkingGoods,
                _description.Url,
                _description.Name,
                _description.Price,
                _description.PriceWithoutDiscount,
                _description.Date
            };
            var result = Json(new
            {
                description,
                isLoaded = true
            });

            return result;
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new Models.ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

    }
}
