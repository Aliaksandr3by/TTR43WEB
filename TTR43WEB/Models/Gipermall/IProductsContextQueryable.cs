using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatumServer.Datum.Product;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace TTR43WEB.Models.Gipermall
{
    public interface IProductsContextQueryable
    {
        IQueryable<Products> Products { get; }
        EntityEntry<Products> AddProduct(ProductEntity product, bool alwaysAdd = true);
        Task<int> SaveProduct();
    }
}
