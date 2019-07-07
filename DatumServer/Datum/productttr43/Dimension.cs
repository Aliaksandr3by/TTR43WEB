using System;
using System.Collections.Generic;

namespace DatumServer.Datum.productttr43
{
    public partial class Dimension
    {
        public Dimension()
        {
            Products = new HashSet<Products>();
        }

        public int Id { get; set; }
        public string DimensionProduct { get; set; }

        public virtual ICollection<Products> Products { get; set; }
    }
}
