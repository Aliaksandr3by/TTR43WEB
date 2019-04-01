using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatumServer.Datum.Product;
using DatumServer.Datum.User;

namespace TTR43WEB.Models.User
{
    public interface IUsersContextQueryable
    {
        IQueryable<Users> Users { get; }
        void Add(Users user);
        UserContext GetUserContext();
        int SaveChanges();
        Task<int> SaveChangesAsync();
    }
}
