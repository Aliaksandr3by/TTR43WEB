using System;
using System.Collections.Generic;

namespace TTR43WEB.Data
{
    public partial class Table51
    {
        public int Id { get; set; }
        public int? TypeBuild { get; set; }
        public int? KindOfActivity { get; set; }
        public string Enclosure { get; set; }
        public double? StandardResistanceHeatTransfer { get; set; }
        public string CalculationType { get; set; }

        public virtual Table512 KindOfActivityNavigation { get; set; }
        public virtual Table511 TypeBuildNavigation { get; set; }
    }
}
