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
        EntityEntry<Users> AddUser(Users user); 

        EntityEntry<UserFavorite> AddUserFavorite(UserFavorite user);
        EntityEntry<UserFavorite> RemoveUserFavorite(UserFavorite user);
        EntityEntry<UserFavorite> UpdateUserFavorite(UserFavorite user);

        EntityEntry<UserAgent> AddUserAgent(UserAgent user);

        UserContext GetUserContext();

        int SaveChanges();

        Task<int> SaveChangesAsync();

        IQueryable<Users> Users { get; }

        IQueryable<UserAgent> UserAgent { get; }

        IQueryable<UserFavorite> UserFavorites { get; }
    }
}
