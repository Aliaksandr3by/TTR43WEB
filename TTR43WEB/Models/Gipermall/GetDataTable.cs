using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TTR43WEB.Models.Gipermall
{
    public class GetPageOptions
    {
        public int pageSize { get; set; }
        public int productPage { get; set; }
        public int addItems { get; set; }
        public int skippedItems { get; set; }
    }
}
