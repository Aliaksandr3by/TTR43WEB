﻿using System;
using System.Collections.Generic;

namespace DatumServer.Datum.productttr43
{
    public partial class Trademark
    {
        public Trademark()
        {
            Products = new HashSet<Products>();
        }

        public int Id { get; set; }
        public string TrademarkProduct { get; set; }

        public virtual ICollection<Products> Products { get; set; }
    }
}
