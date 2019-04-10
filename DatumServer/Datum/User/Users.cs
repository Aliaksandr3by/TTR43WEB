using System;
using System.Collections.Generic;

namespace DatumServer.Datum.User
{
    public partial class Users
    {
        public Users()
        {
            UserAgent = new HashSet<UserAgent>();
            UserFavorite = new HashSet<UserFavorite>();
        }

        public Guid Guid { get; set; }
        public string Login { get; set; }
        public string Email { get; set; }
        public string TelephoneNumber { get; set; }
        public string Password { get; set; }
        public string PasswordConfirm { get; set; }
        public DateTime DateTimeRegistration { get; set; }
        public string Role { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }

        public virtual ICollection<UserAgent> UserAgent { get; set; }
        public virtual ICollection<UserFavorite> UserFavorite { get; set; }
    }
}
