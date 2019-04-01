using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.DependencyInjection;
using DatumServer.Datum.User;
using Microsoft.EntityFrameworkCore.ChangeTracking;

namespace TTR43WEB.Models.User
{
    public class UsersContextQueryable : IUsersContextQueryable
    {
        private readonly UserContext context;

        public UserContext GetUserContext() => this.context;

        public UsersContextQueryable(UserContext ctx) => context = ctx;

        public IQueryable<Users> Users => context.Users;

        public IQueryable<UserAgent> UserAgent => context.UserAgent;

        public EntityEntry<Users> Add(Users user)
        {
            return context.Users.Add(user);
        }

        public int SaveChanges()
        {
            return context.SaveChanges();
        }

        public Task<int> SaveChangesAsync()
        {
            return context.SaveChangesAsync();
        }


    }
}
