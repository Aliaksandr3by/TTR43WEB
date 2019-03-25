using System;
using System.Collections.Generic;

namespace DatumServer.Datum.User
{
    public partial class Users
    {
        public Guid Guid { get; set; }
        public string Login { get; set; }
        public string Email { get; set; }
        public int TelephoneNumber { get; set; }
        public string Password { get; set; }
        public string PasswordConfirm { get; set; }
        public DateTime DateTimeRegistration { get; set; }
    }
}
