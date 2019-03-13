using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.DependencyInjection;

namespace TTR43WEB.Models.User
{
    public class UsersContextQueryable
    {
        private readonly UserContext context;

        public UserContext GetUserContext() => this.context;

        public UsersContextQueryable(UserContext ctx) => context = ctx;

        public IQueryable<User> Users => context.Users;

        public void Add(User user)
        {
            context.Users.Add(user);
        }

        public async void SaveChangesAsync()
        {
            await context.SaveChangesAsync();
        }

        public void SaveChanges()
        {
            context.SaveChanges();
        }
    }
}
