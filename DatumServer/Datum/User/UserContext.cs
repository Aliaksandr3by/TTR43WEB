using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace DatumServer.Datum.User
{
    public partial class UserContext : DbContext
    {
        public UserContext()
        {
        }

        public UserContext(DbContextOptions<UserContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Users> Users { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlServer("Data Source=DESKTOP-OBC9S1R\\MSSQLSERVER2017;Initial Catalog=User;User ID=guest;Password=guest;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("ProductVersion", "2.2.3-servicing-35854");

            modelBuilder.Entity<Users>(entity =>
            {
                entity.HasKey(e => e.Guid)
                    .HasName("PK__Users__A2B5777C8CDED7BA");

                entity.HasIndex(e => e.TelephoneNumber)
                    .HasName("UNQ_TelephoneNumber")
                    .IsUnique();

                entity.Property(e => e.Guid).HasDefaultValueSql("(newid())");

                entity.Property(e => e.DateTimeRegistration).HasColumnType("datetime");

                entity.Property(e => e.Email).IsRequired();

                entity.Property(e => e.Login).IsRequired();

                entity.Property(e => e.Password).IsRequired();

                entity.Property(e => e.PasswordConfirm).IsRequired();
            });
        }
    }
}
