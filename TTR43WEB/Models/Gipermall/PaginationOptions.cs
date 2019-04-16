using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatumServer.Datum.Product;
using DatumServer.Datum.User;

namespace TTR43WEB.Models.Gipermall
{
    class PaginationOptions
    {
        readonly IQueryable<Products> productItems = default;
        readonly IQueryable<UserFavorite> userFavorite = default;

        int _pageSize;
        int _productPage;
        int _totalItems;
        int _totalPages;

        public PaginationOptions(IQueryable<Products> productItems, IQueryable<UserFavorite> userFavorite)
        {
            this.productItems = productItems;
            this.userFavorite = userFavorite;
        }

        public async Task<dynamic> GetItemsAsync(
            Func<Products, DateTime?> sort,
            int pageSize,
            int productPage,
            int addItems = 0,
            int skippedItems = 0,
            bool favoriteSelect = false)
        {
            return await Task<dynamic>.Run<dynamic>(
                () => GetItems(
                    sort,
                    pageSize,
                    productPage,
                    addItems,
                    skippedItems,
                    favoriteSelect
                ));
        }

        public async Task<dynamic> GetItemsAsync(Func<Products, DateTime?> sort, GetPageOptions getPageOptions)
        {
            return await Task<dynamic>.Run<dynamic>(
                () => this.GetItems(
                    sort,
                    getPageOptions.pageSize,
                    getPageOptions.productPage,
                    getPageOptions.addItems,
                    getPageOptions.skippedItems,
                    getPageOptions.favoriteSelect
                ));
        }

        public dynamic GetItems(Func<Products, DateTime?> sort, int pageSize, int productPage, int addItems = 0, int skippedItems = 0, bool favoriteSelect = false)
        {
            try
            {
                this._totalItems = productItems.Count();
                this._pageSize = pageSize;
                this._totalPages = (int) Math.Ceiling((decimal) _totalItems / _pageSize);
                this._productPage = (productPage > _totalPages || productPage < 0) ? 0 : productPage;

                int skip = (_productPage * _pageSize) + (skippedItems > 0 ? skippedItems : 0);
                int take = (new int[]
                {
                    (addItems > 0 ? addItems : _pageSize), _totalItems
                }).Min();

                var items = productItems
                    .OrderByDescending(sort)
                    .Skip(skip)
                    .Take(take)
                    .Select(e => new ProductEntityLite().ToProductEntityLite(e));

                if (favoriteSelect) items = items.Where((number, index) => userFavorite.Any(e => e.ProductGuid == number.Guid));

                if (addItems <= 0)
                {
                    return new
                    {
                    items,
                    productPage = _productPage,
                    pageSize = _pageSize,
                    totalPages = _totalPages,
                    totalItems = _totalItems
                    };
                }
                else
                {
                    return new
                    {
                        items,
                    };
                }
            }
            catch (System.Exception ex)
            {
                return new
                {
                    error = ex.Message,
                };

            }
        }
    }
}