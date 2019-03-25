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
                optionsBuilder.UseSqlServer("name=ConnectionUser");
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

                entity.Property(e => e.Role)
                    .IsRequired()
                    .HasDefaultValueSql("(N'guest')");
            });
        }
    }
}
