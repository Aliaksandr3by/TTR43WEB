using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.DependencyInjection;
using TTR43WEB.Datum;

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
            .Include(e => e.UrlNavigation)
            .Include(e => e.NameNavigation)
            .Include(e => e.MarkingGoodsNavigation);

        public IQueryable<Name> Names => context.Name;

        public Task<int> SaveProduct(Product product)
        {
            if (!context.Products.Any<Products>(
                p => p.MarkingGoodsNavigation.MarkingGoodsProduct == product.MarkingGoods && 
                p.Price == product.Price && 
                p.PriceWithoutDiscount == product.PriceWithoutDiscount))
            {

                //context.Products.Add(product);
            }
            return context.SaveChangesAsync();
        }
    }
}
