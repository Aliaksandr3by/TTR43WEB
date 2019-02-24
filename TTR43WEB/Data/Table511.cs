using System;
using System.Collections.Generic;

namespace TTR43WEB.Data
{
    public partial class Table511
    {
        public Table511()
        {
            Table51 = new HashSet<Table51>();
        }

        public int Id { get; set; }
        public string TypeBuild { get; set; }

        public virtual ICollection<Table51> Table51 { get; set; }
    }
}
