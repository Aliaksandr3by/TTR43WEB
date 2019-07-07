using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using DatumServer.Datum.userttr43;
using DatumServer.Datum;

namespace TTR43WEB.Models.User
{
    public class UsersContextQueryable : IUsersContextQueryable
    {
        private readonly userttr43Context context;

        public userttr43Context GetUserContext() => this.context;

        public UsersContextQueryable(userttr43Context ctx) => context = ctx;

        public IQueryable<Users> Users => context.Users;

        public IQueryable<UserAgent> UserAgent => context.UserAgent;

        public IQueryable<UserFavorite> UserFavorites => context.UserFavorite;

        public int SaveChanges()
        {
            return context.SaveChanges();
        }

        public Task<int> SaveChangesAsync()
        {
            return context.SaveChangesAsync();
        }

        public EntityEntry<Users> AddUser(Users user)
        {
            return context.Users.Add(user);
        }

        public EntityEntry<UserFavorite> AddUserFavorite(UserFavorite favorite)
        {
            return context.UserFavorite.Add(favorite);
        }

        public EntityEntry<UserFavorite> RemoveUserFavorite(UserFavorite favorite)
        {
            return context.UserFavorite.Remove(favorite);
        }
        public EntityEntry<UserFavorite> UpdateUserFavorite(UserFavorite favorite)
        {
            return context.UserFavorite.Update(favorite);
        }

        public EntityEntry<UserAgent> AddUserAgent(UserAgent agent)
        {
            return context.UserAgent.Add(agent);
        }
    }
}
