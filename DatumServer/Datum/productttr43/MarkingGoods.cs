using System;
using System.Collections.Generic;

namespace DatumServer.Datum.productttr43
{
    public partial class MarkingGoods
    {
        public MarkingGoods()
        {
            Products = new HashSet<Products>();
        }

        public int Id { get; set; }
        public int MarkingGoodsProduct { get; set; }

        public virtual ICollection<Products> Products { get; set; }
    }
}
