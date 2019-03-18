﻿using System;
using System.Collections.Generic;

namespace TTR43WEB.Datum
{
    public partial class ManufacturingCountry
    {
        public ManufacturingCountry()
        {
            Products = new HashSet<Products>();
        }

        public int Id { get; set; }
        public string ManufacturingCountryProduct { get; set; }

        public virtual ICollection<Products> Products { get; set; }
    }
}
