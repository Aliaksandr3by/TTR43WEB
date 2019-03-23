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
    [Authorize]
    public class GipermallController : Controller
    {
        private readonly IProductsContextQueryable gipermollTableData;
        private readonly ProductEntity _product;

        public GipermallController(IProductsContextQueryable gipermollTable, ProductEntity product)
        {
            gipermollTableData = gipermollTable;
            _product = product;
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
            
            if (!HttpContext.User.Identity.IsAuthenticated)
            {
                return Json(new
                {
                    authorize = HttpContext.User.Identity.IsAuthenticated,
                   // error = Content("не аутентифицирован"),
                });
            }

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
                productPage = _productPage,
                totalPages,
                pageSize = _pageSize,
                valueDefault,
                totalItems
            });

            return ProductInfo;
        }

        [HttpPost]
        [ContentTypeAddJson]
        [AccessControlAllowAll]
        public async Task<IActionResult> GetCoastAsync([FromBody]JObject idGoods)
        {
            try
            {
                DataSend dataSendObj = idGoods.ToObject<DataSend>();

                GetDataFromGipermall getDataFromGipermall = new GetDataFromGipermall(dataSendObj.IdGoods, _product);

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
