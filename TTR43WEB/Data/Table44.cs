using System;
using System.Collections.Generic;

namespace TTR43WEB.Data
{
    public partial class Table44
    {
        public int Id { get; set; }
        public string Region { get; set; }
        public int AverageDailyOutsideTemperature { get; set; }
        public double AverageOutsideTemperature { get; set; }
        public int AverageRelativeHumidity { get; set; }
        public int AveragePartialPressure { get; set; }
        public int DurationHeatingSeason { get; set; }
    }
}
