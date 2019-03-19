using System;
using System.Collections.Generic;

namespace TTR43WEB.Datum
{
    public partial class Products
    {
        public int Id { get; set; }
        public Guid Guid { get; set; }
        public DateTime? Date { get; set; }
        public int Url { get; set; }
        public int? Name { get; set; }
        public int? MarkingGoods { get; set; }
        public decimal? Price { get; set; }
        public decimal? PriceWithoutDiscount { get; set; }
        public decimal? PriceOneKilogram { get; set; }
        public decimal? PriceOneLiter { get; set; }
        public double? Mass { get; set; }
        public int? Dimension { get; set; }
        public int? BarCode { get; set; }
        public int? ManufacturingCountry { get; set; }
        public int? Trademark { get; set; }

        public virtual BarCode BarCodeNavigation { get; set; }
        public virtual Dimension DimensionNavigation { get; set; }
        public virtual ManufacturingCountry ManufacturingCountryNavigation { get; set; }
        public virtual MarkingGoods MarkingGoodsNavigation { get; set; }
        public virtual Name NameNavigation { get; set; }
        public virtual Trademark TrademarkNavigation { get; set; }
        public virtual Url UrlNavigation { get; set; }
    }
}
