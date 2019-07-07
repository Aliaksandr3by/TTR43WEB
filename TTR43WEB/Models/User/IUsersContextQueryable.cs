using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DatumServer.Datum.productttr43;
using DatumServer.Datum.userttr43;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using TTR43WEB.Models.User;
using TTR43WEB.Models.Product;


namespace TTR43WEB.Models.User
{
    public interface IUsersContextQueryable
    {
        EntityEntry<Users> AddUser(Users user); 

        EntityEntry<UserFavorite> AddUserFavorite(UserFavorite user);
        EntityEntry<UserFavorite> RemoveUserFavorite(UserFavorite user);
        EntityEntry<UserFavorite> UpdateUserFavorite(UserFavorite user);

        EntityEntry<UserAgent> AddUserAgent(UserAgent user);

        userttr43Context GetUserContext();

        int SaveChanges();

        Task<int> SaveChangesAsync();

        IQueryable<Users> Users { get; }

        IQueryable<UserAgent> UserAgent { get; }

        IQueryable<UserFavorite> UserFavorites { get; }
    }
}
