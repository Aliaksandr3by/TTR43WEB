using System;
using System.Collections.Generic;

namespace DatumServer.Datum.User
{
    public partial class UserAgent
    {
        public int IdUserAgent { get; set; }
        public string UserAgentData { get; set; }
        public Guid? GuidUser { get; set; }
    }
}
