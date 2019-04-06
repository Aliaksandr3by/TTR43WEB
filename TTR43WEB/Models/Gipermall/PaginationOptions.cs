using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatumServer.Datum.Product;

namespace TTR43WEB.Models.Gipermall
{
    class PaginationOptions
    {
        readonly IQueryable<Products> AllProducts = default;

        int _pageSize;
        int _productPage;
        int _totalItems;
        int _totalPages;

        public PaginationOptions(IQueryable<Products> AllProducts)
        {
            this.AllProducts = AllProducts;
        }

        public async Task<dynamic> GetItemsAsync(Func<Products, DateTime?> sort, int pageSize, int productPage, int addItems = 0, int skippedItems = 0)
        {
            return await Task<dynamic>.Run<dynamic>(() => GetItems(sort, pageSize, productPage, addItems, skippedItems));
        }

        public async Task<dynamic> GetItemsAsync(Func<Products, DateTime?> sort, GetPageOptions getPageOptions)
        {
            return await Task<dynamic>.Run<dynamic>(
                () => this.GetItems(sort, getPageOptions.pageSize, getPageOptions.productPage, getPageOptions.addItems, getPageOptions.skippedItems));
        }

        public dynamic GetItems(Func<Products, DateTime?> sort, int pageSize, int productPage, int addItems = 0, int skippedItems = 0)
        {
            try
            {
                this._totalItems = AllProducts.Count();
                this._pageSize = pageSize;
                this._totalPages = (int)Math.Ceiling((decimal)_totalItems / _pageSize);
                this._productPage = (productPage > _totalPages || productPage < 0) ? 0 : productPage;

                int skip = (_productPage * _pageSize) + (skippedItems > 0 ? skippedItems : 0);
                int take = (new int[] {
                    (addItems > 0 ? addItems : _pageSize), _totalItems
                }).Min();

                var items = AllProducts
                    .OrderByDescending(sort)
                    .Skip(skip)
                    .Take(take)
                    .Select(e => new ProductEntityLite
                    {
                        Id = e.Id,
                        Date = e.Date,
                        Url = e.UrlNavigation?.UrlProduct,
                        Name = e.NameNavigation?.NameProduct,
                        MarkingGoods = e.MarkingGoodsNavigation?.MarkingGoodsProduct,
                        Price = e.Price,
                        PriceWithoutDiscount = e.PriceWithoutDiscount
                    });

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