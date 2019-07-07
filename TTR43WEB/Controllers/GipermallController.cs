using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using DatumServer.Datum.productttr43;
using DatumServer.Datum.userttr43;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Newtonsoft.Json.Linq;
using TTR43WEB.Filters;
using TTR43WEB.Models.Gipermall;
using TTR43WEB.Models.User;
using TTR43WEB.Models.Product;

namespace TTR43WEB.Controllers
{
    [Authorize]
    public class GipermallController : Controller
    {
        private readonly IProductsContextQueryable _productsContextQueryable;
        private readonly IUsersContextQueryable _usersContextQueryable;

        /// <summary>
        /// Конструктор
        /// </summary>
        /// <param name="productsContextQueryable">Контекст элементов</param>
        /// <param name="usersContextQueryable">Контекст пользователя</param>
        public GipermallController(IProductsContextQueryable productsContextQueryable, IUsersContextQueryable usersContextQueryable)
        {
            _productsContextQueryable = productsContextQueryable;
            _usersContextQueryable = usersContextQueryable;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        [AllowAnonymous]
        public IActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="pageSize"></param>
        /// <param name="productPage"></param>
        /// <param name="favoriteSelect"></param>
        /// <returns></returns>
        [HttpGet]
        [AllowAnonymous]
        [ContentTypeAddJson]
        public async Task<IActionResult> ItemsProduct(int pageSize, int productPage, bool favoriteSelect)
        {
            try
            {
                Func<Products, DateTime?> sort = e => e.Date;
                var tmp = new PaginationOptions(_productsContextQueryable.Products, _usersContextQueryable.UserFavorites);
                var items = await tmp.GetItemsAsync(sort: sort, pageSize: pageSize, productPage: productPage, favoriteSelect: (favoriteSelect));
                return Json(items);
            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <summary>
        /// Метод ищет в базе все продукты по MarkingGoods
        /// </summary>
        /// <param name="productEntityLit"></param>
        /// <returns></returns>
        [HttpPost]
        [ContentTypeAddJson]
        public async Task<IActionResult> AllItemsProductOnId([FromBody] ProductEntityLite productEntityLit)
        {
            try
            {
                Func<ProductEntityLite, bool> func = null;

                if (productEntityLit.MarkingGoods != null)
                {
                    func = e => e.MarkingGoods == productEntityLit.MarkingGoods;
                }
                else if (productEntityLit.Name != null)
                {
                    func = e =>
                    {
                        String[] collection = productEntityLit.Name.ToLower().Split(' ');
                        bool flag = true;
                        foreach (var item in collection)
                        {
                            flag = e.Name.ToLower().Contains(item);
                            if (flag == false)
                            {
                                return false;
                            }
                        }
                        return flag;
                    };
                }
                else
                {
                    throw new Exception("не предусмотрен");
                }

                var items = _productsContextQueryable.Products
                    .Select(e => new ProductEntityLite
                    {
                        Id = e.Id,
                            MarkingGoods = e.MarkingGoods,
                            Guid = e.Guid,
                            Url = e.UrlNavigation.UrlProduct,
                            Name = e.NameNavigation.NameProduct,
                            Mass = e.Mass,
                            Price = e.Price,
                            PriceWithoutDiscount = e.PriceWithoutDiscount,
                            PriceOneMass = e.PriceOneKilogram ?? e.PriceOneLiter,
                            Date = e.Date,
                            FullEstimatedValue = ProductsExtension.getFullPrice(e),
                            DimensionProduct = e.DimensionNavigation.DimensionProduct,
                    })
                    .Where(func)
                    .OrderByDescending(e => e.Date);

                return Json(await Task.Run(() => items));
            }
            catch (Exception)
            {
                throw;
            }
        }

        /// <summary>
        /// Метод ищет в базе все продукты по Названию
        /// </summary>
        /// <param name="productEntityLit"></param>
        /// <returns></returns>
        [HttpPost]
        [ContentTypeAddJson]
        public async Task<IActionResult> GetAllGoodsByName([FromBody] ProductEntityLite productEntityLit)
        {
            var items = _productsContextQueryable.Products
                .Select(e => new
                {
                    e.MarkingGoods,
                        e.UrlNavigation.UrlProduct,
                        e.NameNavigation.NameProduct,
                        e.Date,
                        e.Mass,
                        e.Price,
                        e.PriceWithoutDiscount,
                        PriceOne = e.PriceOneKilogram ?? e.PriceOneLiter,
                        FullEstimatedValue = ProductsExtension.getFullPrice(e),
                        e.DimensionNavigation.DimensionProduct,
                })
                .Where(e => e.NameProduct == productEntityLit.Name)
                .OrderByDescending(e => e.Date);

            return Json(await Task.Run(() => items));
        }

        /// <summary>
        /// Метод получает набор элементов исходя из параметров отображения на экране
        /// </summary>
        /// <param name="getPageOptions"></param>
        /// <returns></returns>
        [HttpPost]
        [AllowAnonymous]
        [ContentTypeAddJson]
        public async Task<IActionResult> ItemsProduct([FromBody] GetPageOptions getPageOptions)
        {
            Func<Products, DateTime?> sort = e => e.Date;
            var tmp = new PaginationOptions(_productsContextQueryable.Products, _usersContextQueryable.UserFavorites);
            var items = await tmp.GetItemsAsync(sort, getPageOptions);
            return Json(items);
        }

        /// <summary>
        /// Метод обновляет все элементы в избранном
        /// </summary>
        /// <param name="guidProducts"></param>
        /// <returns></returns>
        [HttpPost]
        [ContentTypeAddJson]
        public async Task<IActionResult> UpdateFavoritesItems([FromBody] Guid[] guidProducts)
        {
            try
            {
                var collection = await GetItemsFavorite(_usersContextQueryable);

                List<ProductEntity> productEntityList = new List<ProductEntity>();

                foreach (UserFavorite item in collection)
                {
                    var productEntity = await new GetProductFromSite().GetFullDescriptionResult(item.Url);

                    var findAddingProduct = _productsContextQueryable.Products.FirstOrDefault<Products>(
                        p => p.MarkingGoodsNavigation.MarkingGoodsProduct == productEntity.MarkingGoods &&
                        p.Price == productEntity.Price &&
                        p.PriceWithoutDiscount == productEntity.PriceWithoutDiscount);

                    var product = _productsContextQueryable.AddProduct(productEntity, findAddingProduct != null);

                    if (product != null && product.Entity != null)
                    {
                        productEntity.Guid = product.Entity.Guid;
                        productEntityList.Add(productEntity);
                    }
                }

                await _productsContextQueryable.SaveProduct();

                return Json(new
                {
                    productEntityList,
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
        /// Вспомогательный метод служит для получения всех продуктов, избранных конкретным пользователем
        /// </summary>
        /// <param name="usersContextQueryable">Контекст IUsersContextQueryable</param>
        /// <returns type="IQueryable">UserFavorite</returns>
        public async Task<IQueryable<UserFavorite>> GetItemsFavorite(IUsersContextQueryable usersContextQueryable)
        {
            var userGuid = usersContextQueryable.Users.FirstOrDefault(e => e.Login == HttpContext.User.Identity.Name).Guid;

            var items = usersContextQueryable.UserFavorites
                .Select(e => new UserFavorite
                {
                    Guid = e.Guid,
                        UserGuid = e.UserGuid,
                        ProductGuid = e.ProductGuid,
                        DateTimeAdd = e.DateTimeAdd,
                        Url = e.Url,
                })
                .Where(e => e.UserGuid == userGuid);

            return await Task.Run(() => items);
        }

        /// <summary>
        /// Метод получает все элементы из избранного из базы данных
        /// </summary>
        /// <returns></returns>
        [HttpPost]
        [ContentTypeAddJson]
        [AccessControlAllowAll]
        public async Task<IActionResult> GetAllProductsFavorite()
        {
            try
            {
                var favorite = await GetItemsFavorite(_usersContextQueryable);
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

        /// <summary>
        /// Вспомогательный метод для добавления элемента в избранное
        /// </summary>
        /// <param name="_usersContextQueryable"></param>
        /// <param name="productEntityLite"></param>
        /// <param name="onlyAdd"></param>
        /// <returns></returns>
        async Task<String> ProductToFavoriteAdd(IUsersContextQueryable _usersContextQueryable, ProductEntityLite productEntityLite, bool onlyAdd = false)
        {
            try
            {
                ProductEntityLite _productEntityLite = productEntityLite;

                var userGuid = _usersContextQueryable.Users.FirstOrDefault(e => e.Login == HttpContext.User.Identity.Name).Guid;

                UserFavorite userFavorite = _usersContextQueryable.UserFavorites
                    .FirstOrDefault(e => e.UserGuid == userGuid && e.ProductGuid == _productEntityLite.Guid);

                if (userFavorite != null)
                {
                    if (!onlyAdd)
                    {
                        var favoriteRemove = _usersContextQueryable.RemoveUserFavorite(userFavorite);

                        var count = await _usersContextQueryable.SaveChangesAsync();

                        return "remove";
                    }
                    else
                    {
                        var favoriteRemove = _usersContextQueryable.UpdateUserFavorite(userFavorite);

                        var count = await _usersContextQueryable.SaveChangesAsync();

                        return "update";
                    }
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
                // Формирует сущность товара по данным
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

                // ищет данные в базе соответствие с MarkingGoods, выбирает самый новый, потом проверяет цену
                var findAddingProduct = _productsContextQueryable.Products
                    .OrderByDescending(p => p.Date)
                    .Where(p => p.MarkingGoodsNavigation.MarkingGoodsProduct == productEntity.MarkingGoods)
                    .Select<Products, Products>(p => p)
                    .FirstOrDefault();

                bool flag = findAddingProduct != null &&
                    findAddingProduct.Price == productEntity.Price &&
                    findAddingProduct.PriceWithoutDiscount == productEntity.PriceWithoutDiscount;

                var product = _productsContextQueryable.AddProduct(productEntity, !flag);

                if (product != null)
                {
                    await _productsContextQueryable.SaveProduct();
                }

                //если данные отсутствуют то сохраняет
                productEntityLite.Guid = findAddingProduct == null ? product.Entity.Guid : findAddingProduct.Guid;

                // если стоит галочка в избранное то добавляем
                if (dataSend.FavoriteSelect)
                {
                    var State = await ProductToFavoriteAdd(_usersContextQueryable, productEntityLite, true);
                }

                return Json(new
                {
                    items = productEntityLite,
                        isPresent = flag,
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

        /// <summary>
        /// Мотод получает список всех URL из базы
        /// </summary>
        /// <returns></returns>
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