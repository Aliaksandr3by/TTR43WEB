using System;
using System.Collections.Generic;

namespace TTR43WEB.Models.Product
{
    public partial class ProductEntityLite
    {
        public int Id { get; set; }
        public Guid Guid { get; set; }
        public DateTime? Date { get; set; }
        public string Url { get; set; }
        public string Name { get; set; }
        public int? MarkingGoods { get; set; }
        public decimal? Price { get; set; }
        public decimal? PriceWithoutDiscount { get; set; }
        public decimal? PriceOneMass { get; set; }
        public decimal? FullEstimatedValue { get; set; }
        public double? Mass { get; set; }
        public string DimensionProduct { get; set; }
    }
}
