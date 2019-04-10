using System;
using System.Collections.Generic;

namespace DatumServer.Datum.User
{
    public partial class UserFavorite
    {
        public Guid Guid { get; set; }
        public Guid UserGuid { get; set; }
        public Guid ProductGuid { get; set; }
        public DateTime DateTimeAdd { get; set; }

        public virtual Users UserGu { get; set; }
    }
}
