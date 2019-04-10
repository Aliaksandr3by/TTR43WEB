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
using TTR43WEB.Models.User;
using DatumServer.Datum.User;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace TTR43WEB.Controllers
{
    [Authorize]
    public class GipermallController : Controller
    {
        private readonly IProductsContextQueryable _productsContextQueryable;
        private readonly IUsersContextQueryable _usersContextQueryable;

        public GipermallController(IProductsContextQueryable productsContextQueryable, IUsersContextQueryable usersContextQueryable)
        {
            _productsContextQueryable = productsContextQueryable;
            _usersContextQueryable = usersContextQueryable;
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
            var AllProducts = _productsContextQueryable.Products;
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
            var AllProducts = _productsContextQueryable.Products;
            Func<Products, DateTime?> sort = e => e.Date;
            var tmp = new PaginationOptions(AllProducts);
            var items = await tmp.GetItemsAsync(sort, getPageOptions);
            return Json(items);
        }

        [HttpPost]
        [ContentTypeAddJson]
        [AccessControlAllowAll]
        public async Task<IActionResult> GetAllProductsFavorite()
        {
            try
            {
                if (HttpContext.User.Identity.IsAuthenticated)
                {
                    var userGuid = _usersContextQueryable.Users.FirstOrDefault(e => e.Login == HttpContext.User.Identity.Name).Guid;

                    var favorite = _usersContextQueryable.UserFavorites.Select(e => new UserFavorite
                    {
                        Guid = e.Guid,
                        UserGuid = e.UserGuid,
                        ProductGuid = e.ProductGuid,
                        DateTimeAdd = e.DateTimeAdd,
                        DateTimeRemove = e.DateTimeRemove,
                        Status = e.Status,
                    }).Where(e=> e.UserGuid == userGuid);

                    return Json(favorite);
                }

                return Json(new
                {
                    errorFavorites = "Пользователь не аутентифицирован",
                });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    errorFavorites = ex.Message,
                });
            }
        }

        [HttpPost]
        [ContentTypeAddJson]
        [AccessControlAllowAll]
        public async Task<IActionResult> AddProductToFavorite([FromBody]ProductEntityLite productEntityLite)
        {
            try
            {
                if (HttpContext.User.Identity.IsAuthenticated)
                {
                    var userGuid = _usersContextQueryable.Users.FirstOrDefault(e => e.Login == HttpContext.User.Identity.Name).Guid;

                    UserFavorite userFavorite = default;
                    UserFavorite result = default;

                    if (productEntityLite.Status)
                    {
                        userFavorite = _usersContextQueryable.UserFavorites.FirstOrDefault(e => e.ProductGuid == productEntityLite.Guid);
                        userFavorite.DateTimeRemove = DateTime.Now;
                        userFavorite.Status = productEntityLite.Status;

                        result = _usersContextQueryable.UpdateUserFavorite(userFavorite).Entity;
                    }
                    else
                    {
                        userFavorite = new UserFavorite
                        {
                            UserGuid = userGuid,
                            ProductGuid = productEntityLite.Guid,
                            DateTimeAdd = DateTime.Now,
                            Status = productEntityLite.Status,
                        };
                        result = _usersContextQueryable.AddUserFavorite(userFavorite).Entity;
                    }

                    var count = await _usersContextQueryable.SaveChangesAsync();

                    return Json(new
                    {
                        favorite = new
                        {
                            Guid = result.Guid,
                            UserGuid = result.UserGuid,
                            ProductGuid = result.ProductGuid,
                            DateTimeAdd = result.DateTimeAdd,
                            DateTimeRemove = result.DateTimeRemove,
                            Status = result.Status,
                        },
                    });
                }

                return Json(new
                {
                    errorFavorites = "Пользователь не аутентифицирован",
                });

            }
            catch (Exception ex)
            {
                return Json(new
                {
                    errorFavorites = ex.Message,
                });
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
                Guid Guid = await _productsContextQueryable.SaveProduct(productEntity);
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
            var dataContext = _productsContextQueryable.Products;

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
