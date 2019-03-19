using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TTR43WEB.Datum;

namespace TTR43WEB.Models.Gipermall
{
    public interface IProductsContextQueryable
    {
        IQueryable<Products> Products { get; }
        Task<int> SaveProduct(ProductEntity product);
    }
}
