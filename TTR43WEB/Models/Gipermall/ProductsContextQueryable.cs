﻿using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatumServer.Datum.Product;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.DependencyInjection;

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
            .Include(e => e.UrlNavigation);

        public IQueryable<BarCode> BarCode => context.BarCode;
        public IQueryable<Dimension> Dimension => context.Dimension;
        public IQueryable<ManufacturingCountry> ManufacturingCountry => context.ManufacturingCountry;
        public IQueryable<Name> Name => context.Name;
        public IQueryable<MarkingGoods> MarkingGoods => context.MarkingGoods;
        public IQueryable<Trademark> Trademark => context.Trademark;
        public IQueryable<Url> Url => context.Url;

        public EntityEntry<Products> AddProduct(ProductEntity product)
        {
            try
            {
                Products tmp = (new Products()).ToProducts(product, context);
                return context.Products.Add(tmp);
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<int> SaveProduct()
        {
            try
            {
                return await context.SaveChangesAsync();
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}