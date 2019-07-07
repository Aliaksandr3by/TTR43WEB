using System;
using System.Collections.Generic;

namespace DatumServer.Datum.userttr43
{
    public partial class UserFavorite
    {
        public Guid Guid { get; set; }
        public Guid UserGuid { get; set; }
        public Guid ProductGuid { get; set; }
        public DateTime DateTimeAdd { get; set; }
        public string Url { get; set; }

        public virtual Users UserGu { get; set; }
    }
}
