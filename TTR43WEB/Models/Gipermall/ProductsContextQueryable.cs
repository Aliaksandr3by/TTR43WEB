using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.DependencyInjection;
using DatumServer.Datum.Product;

namespace TTR43WEB.Models.Gipermall
{
    /// <summary>
    /// Контекст таблицы продуктов
    /// </summary>
    public class ProductsContextQueryable : IProductsContextQueryable
    {
        private readonly ProductContext context;

        public ProductsContextQueryable(ProductContext ctx) => context = ctx;

        public IQueryable<Products> Products => context.Products
            .Include(e => e.BarCodeNavigation)
            .Include(e => e.DimensionNavigation)
            .Include(e => e.ManufacturingCountryNavigation)
            .Include(e => e.NameNavigation)
            .Include(e => e.MarkingGoodsNavigation)
            .Include(e => e.TrademarkNavigation)
            .Include(e => e.UrlNavigation)
            ;

        public IQueryable<BarCode> BarCode => context.BarCode;
        public IQueryable<Dimension> Dimension => context.Dimension;
        public IQueryable<ManufacturingCountry> ManufacturingCountry => context.ManufacturingCountry;
        public IQueryable<Name> Name => context.Name;
        public IQueryable<MarkingGoods> MarkingGoods => context.MarkingGoods;
        public IQueryable<Trademark> Trademark => context.Trademark;
        public IQueryable<Url> Url => context.Url;

        public async Task<Guid> SaveProduct(ProductEntity product)
        {
            try
            {
                

                if (product.MarkingGoods != null && !context.Products.Any<Products>(
                    p => p.MarkingGoodsNavigation.MarkingGoodsProduct == product.MarkingGoods &&
                    p.Price == product.Price &&
                    p.PriceWithoutDiscount == product.PriceWithoutDiscount))
                {
                    Products tmp = (new Products()).ToProducts(product, context);
                    var result = await context.Products.AddAsync(tmp);
                    var count = await context.SaveChangesAsync();
                    return result.Entity.Guid;
                }
                else
                {
                    return default;
                }
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}