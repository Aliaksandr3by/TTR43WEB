using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using TTR43WEB.Filters;
using Newtonsoft.Json.Linq;
using System.Net;
using Microsoft.AspNetCore.Authorization;
using TTR43WEB.Models.Gipermall;
using DatumServer.Datum.Product;

namespace TTR43WEB.Controllers
{
    [Authorize]
    public class GipermallController : Controller
    {
        private readonly IProductsContextQueryable gipermollTableData;

        public GipermallController(IProductsContextQueryable gipermollTable)
        {
            gipermollTableData = gipermollTable;
        }

        [AllowAnonymous]
        public IActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// это не работает:(((
        /// </summary>
        /// <param name="ElementURI"></param>
        /// <returns></returns>
        [HttpOptions]
        [ContentTypeAddJson]
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
                    ElementURI.ElementURI,
                });

                return result;
            }
            catch (WebException ex)
            {
                var result = Json(new
                {
                    ElementURI.ElementURI,
                });

                return result;
            }
        }

        [HttpGet]
        [AllowAnonymous]
        [ContentTypeAddJson]
        public IActionResult ItemsProduct(int pageSize, int productPage)
        {
            var AllProducts = gipermollTableData.Products;

            Func<Products, DateTime?> sort = e => e.Date;

            var items = new PaginationOptions(AllProducts).
                GetItems(sort, pageSize, productPage);

            return Json(items);
        }

        [HttpPost]
        [AllowAnonymous]
        [ContentTypeAddJson]
        public async Task<IActionResult> ItemsProduct([FromBody] GetPageOptions getPageOptions)
        {
            var AllProducts = gipermollTableData.Products;
            var _getPageOptions = getPageOptions;

            Func<Products, DateTime?> sort = e => e.Date;
            var tmp = new PaginationOptions(AllProducts);
            var items = await tmp.GetItemsAsync(sort, _getPageOptions.pageSize, _getPageOptions.productPage, _getPageOptions.addItems, _getPageOptions.skippedItems);

            return Json(items);
        }

        [HttpPost]
        [ContentTypeAddJson]
        [AccessControlAllowAll]
        public async Task<IActionResult> GetCoastAsync([FromBody]JObject idGoods)
        {
            try
            {
                DataSend dataSendObj = idGoods.ToObject<DataSend>();

                GetDataFromGipermall getDataFromGipermall = new GetDataFromGipermall(dataSendObj.IdGoods);

                var e = await getDataFromGipermall.GetFullDescriptionResult();

                int resultBaseDataAdd = await gipermollTableData.SaveProduct(e);

                var result = new
                {
                    items = new
                    {
                        e.Id,
                        Url = e.Url,
                        Name = e.Name,
                        MarkingGoods = e.MarkingGoods,
                        e.Date,
                        e.Price,
                        e.PriceWithoutDiscount
                    },
                    resultBaseDataAdd,
                };

                return Json(result);
            }
            catch (Exception ex)
            {
                var result = new
                {
                    description = new { error = ex.Message },
                    resultBaseDataAdd = 0,
                };

                return Json(result);
            }
        }


        [HttpPost]
        [ContentTypeAddJson]
        public async Task<IActionResult> AllItemsUrls()
        {
            var dataContext = gipermollTableData.Products;

            //var description = (from b in data orderby b.Url descending select b.Url).Distinct();
            var description = dataContext.OrderBy(e => e.UrlNavigation.UrlProduct).Select(e => e.UrlNavigation.UrlProduct).Distinct();

            var result = Json(new
            {
                description,
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
