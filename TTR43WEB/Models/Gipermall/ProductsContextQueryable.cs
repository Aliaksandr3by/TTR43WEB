using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.DependencyInjection;

namespace TTR43WEB.Models.Gipermall
{
    /// <summary>
    /// Контекст таблицы продуктов
    /// </summary>
    public class ProductsContextQueryable : IProductsContextQueryable
    {
        private readonly ProductsContext context;

        public ProductsContextQueryable(ProductsContext ctx) => context = ctx;

        public IQueryable<Product> Products => context.Products;

        public void SaveProduct(Product product)
        {
            if (!context.Products.Any<Product>(p => p.MarkingGoods == product.MarkingGoods && p.Price == product.Price && p.PriceWithoutDiscount == product.PriceWithoutDiscount))
            {
                context.Products.Add(product);
                context.SaveChanges();
            }
        }

    }
}
