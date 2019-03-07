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
    public class GipermollTable : IGipermollTableData
    {
        private readonly ContextGipermall context;

        public GipermollTable(ContextGipermall ctx) => context = ctx;

        public IQueryable<Product> Products => context.Products;

    }
}
