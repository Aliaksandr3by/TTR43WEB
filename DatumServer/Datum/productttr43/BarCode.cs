﻿using System;
using System.Collections.Generic;

namespace DatumServer.Datum.productttr43
{
    public partial class BarCode
    {
        public BarCode()
        {
            Products = new HashSet<Products>();
        }

        public int Id { get; set; }
        public string BarCodeProduct { get; set; }

        public virtual ICollection<Products> Products { get; set; }
    }
}
