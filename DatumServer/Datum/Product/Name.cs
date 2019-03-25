using System;
using System.Collections.Generic;

namespace DatumServer.Datum.Product
{
    public partial class Name
    {
        public Name()
        {
            Products = new HashSet<Products>();
        }

        public int Id { get; set; }
        public string NameProduct { get; set; }

        public virtual ICollection<Products> Products { get; set; }
    }
}
