using DatumServer.Datum.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TTR43WEB.Models.User
{
    public class UserLite
    {
        public Guid Guid { get; set; }
        public string Login { get; set; }
        public string Email { get; set; }
        public string TelephoneNumber { get; set; }
        public DateTime DateTimeRegistration { get; set; }
        public string Role { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
    }
}
