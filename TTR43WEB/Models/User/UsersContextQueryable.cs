﻿using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.DependencyInjection;
using DatumServer.Datum.User;

namespace TTR43WEB.Models.User
{
    public class UsersContextQueryable
    {
        private readonly UserContext context;

        public UserContext GetUserContext() => this.context;

        public UsersContextQueryable(UserContext ctx) => context = ctx;

        public IQueryable<Users> Users => context.Users;

        public void Add(Users user)
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
