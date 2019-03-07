using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Protocols;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TTR43WEB.Models.Gipermall
{
    public class ContextGipermall : DbContext
    {
        public virtual DbSet<Product> Products { get; set; }

        public ContextGipermall() 
        {
            Database.EnsureCreated();
        }

        public ContextGipermall(DbContextOptions<ContextGipermall> options) : base(options)
        {
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer(@"Data Source=DESKTOP-OBC9S1R\MSSQLSERVER2017;Initial Catalog=Product;User ID=guest;Password=guest;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False");
            }
        }
    }
}
