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
        public async Task<IActionResult> ItemsProduct(int pageSize, int productPage)
        {
            var AllProducts = gipermollTableData.Products;
            Func<Products, DateTime?> sort = e => e.Date;
            var tmp = new PaginationOptions(AllProducts);
            var items = await tmp.GetItemsAsync(sort, pageSize, productPage);
            return Json(items);
        }

        [HttpPost]
        [AllowAnonymous]
        [ContentTypeAddJson]
        public async Task<IActionResult> ItemsProduct([FromBody] GetPageOptions getPageOptions)
        {
            var AllProducts = gipermollTableData.Products;
            Func<Products, DateTime?> sort = e => e.Date;
            var tmp = new PaginationOptions(AllProducts);
            var items = await tmp.GetItemsAsync(sort, getPageOptions);
            return Json(items);
        }

        [HttpPost]
        [ContentTypeAddJson]
        [AccessControlAllowAll]
        public async Task<IActionResult> AddProductToFavorite([FromBody]DataSend idGoods)
        {
            try //!не реализован
            {
                GetProductFromSite getDataFromGipermall = new GetProductFromSite(idGoods.IdGoods);

                var item = await getDataFromGipermall.GetFullDescriptionResult();

                var resultBaseDataAdd = await gipermollTableData.SaveProduct(item);

                var result = new
                {
                    items = new
                    {
                        item.Id,
                        item.Url,
                        item.Name,
                        item.MarkingGoods,
                        item.Date,
                        item.Price,
                        item.PriceWithoutDiscount,
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
        [AllowAnonymous]
        [ContentTypeAddJson]
        [AccessControlAllowAll]
        public async Task<IActionResult> GetCoastAsync([FromBody]DataSend idGoods)
        {
            try
            {
                GetProductFromSite getDataFromGipermall = new GetProductFromSite(idGoods.IdGoods);

                ProductEntity productEntity = await getDataFromGipermall.GetFullDescriptionResult();
                Guid Guid = await gipermollTableData.SaveProduct(productEntity);
                bool flag = Guid.Empty == Guid; 

                var result = new
                {
                    items = new
                    {
                        productEntity.Id,
                        productEntity.Guid,
                        productEntity.Url,
                        productEntity.Name,
                        productEntity.MarkingGoods,
                        productEntity.Date,
                        productEntity.Price,
                        productEntity.PriceWithoutDiscount,
                    },
                    guidIsEmpty = flag,
                };

                return Json(result);
            }
            catch (Exception ex)
            {
                var result = new
                {
                    description = new { error = ex.Message },
                };

                return Json(result);
            }
        }


        [HttpPost]
        [ContentTypeAddJson]
        public IActionResult AllItemsUrls()
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
