using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using DatumServer.Datum.Product;
using DatumServer.Datum.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Newtonsoft.Json.Linq;
using TTR43WEB.Filters;
using TTR43WEB.Models.Gipermall;
using TTR43WEB.Models.User;

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
        public IActionResult OptionsURIinBase([FromBody] ElementURIData ElementURI)
        {
            try
            {
                HttpWebRequest request = (HttpWebRequest) WebRequest.Create(ElementURI.ElementURI);

                HttpWebResponse response = (HttpWebResponse) request.GetResponse();

                var statusCode = (int) response.StatusCode;

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

        /// <summary>
        /// 
        /// </summary>
        /// <param name="guidProducts"></param>
        /// <returns></returns>
        [HttpPost]
        [ContentTypeAddJson]
        public async Task<IActionResult> UpdateAllFavorites([FromBody] Guid[] guidProducts)
        {
            try
            {
                var collection = AllProductsFavorite(_usersContextQueryable);

                List<ProductEntity> productEntity = new List<ProductEntity>();

                foreach (UserFavorite item in collection)
                {
                    var tmp = await new GetProductFromSite().GetFullDescriptionResult(item.Url);
                    var product = _productsContextQueryable.AddProduct(tmp);
                    tmp.Guid = product.Entity.Guid;
                    await _productsContextQueryable.SaveProduct();
                    productEntity.Add(tmp);
                }

                return Json(new
                {
                    productEntity,
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

        IQueryable<UserFavorite> AllProductsFavorite(IUsersContextQueryable usersContextQueryable)
        {
            var userGuid = usersContextQueryable.Users.FirstOrDefault(e => e.Login == HttpContext.User.Identity.Name).Guid;

            return usersContextQueryable.UserFavorites
                .Select(e => new UserFavorite
                {
                    Guid = e.Guid,
                        UserGuid = e.UserGuid,
                        ProductGuid = e.ProductGuid,
                        DateTimeAdd = e.DateTimeAdd,
                        Url = e.Url,
                })
                .Where(e => e.UserGuid == userGuid);
        }

        [HttpPost]
        [ContentTypeAddJson]
        [AccessControlAllowAll]
        public async Task<IActionResult> GetAllProductsFavorite()
        {
            try
            {
                var favorite = AllProductsFavorite(_usersContextQueryable);
                return Json(favorite);
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    errorFavorites = ex.Message,
                });
            }
        }

        async Task<String> ProductToFavoriteAdd(IUsersContextQueryable _usersContextQueryable, ProductEntityLite productEntityLite, bool onlyAdd = false)
        {
            try
            {
                ProductEntityLite _productEntityLite = productEntityLite;

                var userGuid = _usersContextQueryable.Users.FirstOrDefault(e => e.Login == HttpContext.User.Identity.Name).Guid;

                UserFavorite userFavorite = _usersContextQueryable
                    .UserFavorites
                    .FirstOrDefault(e => e.UserGuid == userGuid && e.ProductGuid == _productEntityLite.Guid);

                if (userFavorite != null)
                {
                    if (!onlyAdd)
                    {
                        var favoriteRemove = _usersContextQueryable.RemoveUserFavorite(userFavorite);

                        var count = await _usersContextQueryable.SaveChangesAsync();

                        return "remove";
                    }
                    return "has already";
                }
                else
                {
                    userFavorite = new UserFavorite
                    {
                        UserGuid = userGuid,
                        ProductGuid = _productEntityLite.Guid,
                        DateTimeAdd = DateTime.Now,
                        Url = _productEntityLite.Url,
                    };

                    var favoriteAdd = _usersContextQueryable.AddUserFavorite(userFavorite);

                    var count = await _usersContextQueryable.SaveChangesAsync();

                    return "add";
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <summary>
        /// Метод добавляет продукт в избранное
        /// </summary>
        /// <param name="productEntityLite"></param>
        /// <returns></returns>
        [HttpPost]
        [ContentTypeAddJson]
        [AccessControlAllowAll]
        public async Task<IActionResult> AddProductToFavorite([FromBody] ProductEntityLite productEntityLite)
        {
            try
            {
                var State = await ProductToFavoriteAdd(_usersContextQueryable, productEntityLite);

                return Json(new
                {
                    State,
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

        /// <summary>
        /// Модод получает данные с сайта по URL и добавляет их в базу данных
        /// </summary>
        /// <param name="idGoods"></param>
        /// <returns></returns>
        [HttpPost]
        [AllowAnonymous]
        [ContentTypeAddJson]
        [AccessControlAllowAll]
        public async Task<IActionResult> GetCoastAsync([FromBody] DataSend dataSend)
        {
            try
            {
                // Получает данные
                GetProductFromSite getDataFromGipermall = new GetProductFromSite(dataSend.IdGoods);
                ProductEntity productEntity = await getDataFromGipermall.GetFullDescriptionResult();

                // если отсутствует Marking Goods, что-то не так
                if (productEntity.MarkingGoods == null)
                {
                    return Json(new
                    {
                        description = new { error = $"MarkingGoods: {productEntity.MarkingGoods}" },
                    });
                }

                // преобразовать в упрощенную версию
                ProductEntityLite productEntityLite = new ProductEntityLite().ToProductEntityLite(productEntity);

                // ищет данные в базе
                var findAddingProduct = _productsContextQueryable.Products.FirstOrDefault<Products>(
                    p => p.MarkingGoodsNavigation.MarkingGoodsProduct == productEntity.MarkingGoods &&
                    p.Price == productEntity.Price &&
                    p.PriceWithoutDiscount == productEntity.PriceWithoutDiscount);

                //если данные отсутствуют то сохраняет
                if (findAddingProduct == null)
                {
                    var product = _productsContextQueryable.AddProduct(productEntity);
                    await _productsContextQueryable.SaveProduct();
                    productEntityLite.Guid = product.Entity.Guid; // добавляем гуид
                }
                else
                {
                    productEntityLite.Guid = findAddingProduct.Guid; // добавляем гуид, нужен для избранного если товар уже есть
                }

                // если стоит галочка в избранное то добавляем
                if (dataSend.FavoriteSelect)
                {
                    var State = await ProductToFavoriteAdd(_usersContextQueryable, productEntityLite, true);
                }

                return Json(new
                {
                    items = productEntityLite,
                    isPresent = (findAddingProduct != null),
                });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    description = new { error = ex.Message },
                });
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