using System;
using System.Collections.Generic;

namespace DatumServer.Datum.Product
{
    public partial class ProductEntityLite
    {
        public int Id { get; set; }
        public DateTime? Date { get; set; }
        public string Url { get; set; }
        public string Name { get; set; }
        public int? MarkingGoods { get; set; }
        public decimal? Price { get; set; } = 0;
        public decimal? PriceWithoutDiscount { get; set; } = 0;
    }
}
