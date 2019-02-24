using System;
using System.Collections.Generic;

namespace TTR43WEB.Data
{
    public partial class AttachmentB
    {
        public int Id { get; set; }
        public string DirectionHeatFlow { get; set; }
        public double? AirLayerThickness { get; set; }
        public double? ThermalResistancePositive { get; set; }
        public double? ThermalResistanceNegative { get; set; }
    }
}
