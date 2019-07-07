using System;
using System.Collections.Generic;

namespace DatumServer.Datum.userttr43
{
    public partial class UserAgent
    {
        public int IdUserAgent { get; set; }
        public string UserAgentData { get; set; }
        public Guid GuidUser { get; set; }
        public DateTime? DateAutorizate { get; set; }

        public virtual Users GuidUserNavigation { get; set; }
    }
}
