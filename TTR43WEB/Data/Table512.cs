using System;
using System.Collections.Generic;

namespace TTR43WEB.Data
{
    public partial class Table512
    {
        public Table512()
        {
            Table51 = new HashSet<Table51>();
        }

        public int Id { get; set; }
        public string KindOfActivity { get; set; }

        public virtual ICollection<Table51> Table51 { get; set; }
    }
}
