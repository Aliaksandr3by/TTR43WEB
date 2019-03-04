using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TTR43WEB.Data;

namespace TTR43WEB.Models.Gipermall
{
    public interface IGipermollTableData
    {
        IQueryable<Product> Products { get; }
    }
}
