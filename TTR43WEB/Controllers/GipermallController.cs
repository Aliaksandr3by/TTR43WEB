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
using TTR43WEB.Datum;

namespace TTR43WEB.Controllers
{
    public class GipermallController : Controller
    {
        private readonly IProductsContextQueryable gipermollTableData;
        private readonly ProductEntity _product;
        private int cont = 0;

        public GipermallController(IProductsContextQueryable gipermollTable, ProductEntity product)
        {
            gipermollTableData = gipermollTable;
            _product = product;
            cont++;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult htmlpage()
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
                    isLoaded = true,
                });

                return result;
            }
            catch (WebException ex)
            {
                var result = Json(new
                {
                    ElementURI.ElementURI,
                    isLoaded = false,
                });

                return result;
            }
        }

        [HttpGet]
        [Authorize]
        [ContentTypeAddJson]
        public IActionResult GetItemProduct(int pageSize, int productPage)
        {
            var AllProducts = gipermollTableData.Products;

            int totalItems = AllProducts.Count<Products>();

            int _pageSize = pageSize;

            int totalPages = (int)Math.Ceiling((decimal)totalItems / _pageSize);

            int _productPage = (productPage > totalPages || productPage < 0) ? 0 : productPage;

            Func<Products, DateTime?> fn2 = e => e.Date;

            int countProducts = AllProducts.Count<Products>();

            var valueDefault = from n in new int[] { totalItems, 3, 5, 10, 15, 25, 30, 50, 75, 100, 150, 200, 250 }
                               where n <= totalItems
                               orderby n
                               select n;
            var result = AllProducts
                .OrderByDescending(fn2)
                .Skip(_productPage * _pageSize)
                .Take((new int[] { _pageSize, countProducts }).Min())
                .Select(e => new
                {
                    e.Id,
                    Url = e.UrlNavigation?.UrlProduct,
                    Name = e.NameNavigation?.NameProduct,
                    MarkingGoods = e.MarkingGoodsNavigation?.MarkingGoodsProduct,
                    e.Date,
                    e.Price,
                    e.PriceWithoutDiscount
                });
            //.AsQueryable<ProductEntity>();

            var ProductInfo = Json(new
            {
                items = result,
                isLoaded = true,
                productPage = _productPage,
                totalPages,
                pageSize = _pageSize,
                valueDefault,
                totalItems
            });

            return ProductInfo;
        }

        [HttpPost]
        [Authorize]
        [ContentTypeAddJson]
        [AccessControlAllowAll]
        public async Task<IActionResult> GetCoastAsync([FromBody]JObject idGoods)
        {
            try
            {
                DataSend dataSendObj = idGoods.ToObject<DataSend>();

                GetDataFromGipermall getDataFromGipermall = new GetDataFromGipermall(dataSendObj.IdGoods, _product);

                var description = await getDataFromGipermall.GetFullDescriptionResult();

                int resultBaseDataAdd = await gipermollTableData.SaveProduct(description);

                var result = new
                {
                    description,
                    resultBaseDataAdd,
                    isLoaded = true
                };

                return Json(result);
            }
            catch (Exception ex)
            {
                var result = new
                {
                    description = new { error = ex.Message},
                    resultBaseDataAdd = 0,
                    isLoaded = false
                };

                return Json(result);
            }
        }


        [HttpPost]
        [Authorize]
        [ContentTypeAddJson]
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

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new Models.ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

    }
}
