using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatumServer.Datum.Product;
using DatumServer.Datum.User;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace TTR43WEB.Models.User
{
    public interface IUsersContextQueryable
    {
        IQueryable<Users> Users { get; }
        EntityEntry<Users> Add(Users user);
        UserContext GetUserContext();
        int SaveChanges();
        Task<int> SaveChangesAsync();
        IQueryable<UserAgent> UserAgent { get; }
    }
}
