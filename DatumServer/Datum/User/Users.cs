using System;
using System.Collections.Generic;

namespace DatumServer.Datum.User
{
    public partial class Users
    {
        public Guid Guid { get; set; }
        public string Login { get; set; }
        public string Email { get; set; }
        public long TelephoneNumber { get; set; }
        public string Password { get; set; }
        public string PasswordConfirm { get; set; }
        public DateTime DateTimeRegistration { get; set; }
        public string Role { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}
