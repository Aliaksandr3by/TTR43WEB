using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TTR43WEB.Models.Gipermall
{
    public interface IProductsContextQueryable
    {
        IQueryable<Product> Products { get; }
        Task<int> SaveProduct(Product product);
    }
}
