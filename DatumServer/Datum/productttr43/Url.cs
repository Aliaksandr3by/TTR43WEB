using System;
using System.Collections.Generic;

namespace DatumServer.Datum.productttr43
{
    public partial class Url
    {
        public Url()
        {
            Products = new HashSet<Products>();
        }

        public int Id { get; set; }
        public string UrlProduct { get; set; }

        public virtual ICollection<Products> Products { get; set; }
    }
}
