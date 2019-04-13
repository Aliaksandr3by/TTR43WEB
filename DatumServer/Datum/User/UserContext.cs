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

        public virtual DbSet<UserAgent> UserAgent { get; set; }
        public virtual DbSet<UserFavorite> UserFavorite { get; set; }
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
            modelBuilder.HasAnnotation("ProductVersion", "2.2.4-servicing-10062");

            modelBuilder.Entity<UserAgent>(entity =>
            {
                entity.HasKey(e => e.IdUserAgent)
                    .HasName("PK__UserAgen__FC710A6CC4C40273");

                entity.Property(e => e.DateAutorizate).HasColumnType("datetime");

                entity.HasOne(d => d.GuidUserNavigation)
                    .WithMany(p => p.UserAgent)
                    .HasForeignKey(d => d.GuidUser)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_UserAgent_Users1");
            });

            modelBuilder.Entity<UserFavorite>(entity =>
            {
                entity.HasKey(e => e.Guid)
                    .HasName("PK__UserFavo__A2B5777C439EC73F");

                entity.Property(e => e.Guid).HasDefaultValueSql("(newid())");

                entity.Property(e => e.DateTimeAdd).HasColumnType("datetime");

                entity.Property(e => e.Url).IsRequired();

                entity.HasOne(d => d.UserGu)
                    .WithMany(p => p.UserFavorite)
                    .HasForeignKey(d => d.UserGuid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_UserGuid_Users");
            });

            modelBuilder.Entity<Users>(entity =>
            {
                entity.HasKey(e => e.Guid)
                    .HasName("PK__Users__A2B5777C8CDED7BA");

                entity.Property(e => e.Guid).HasDefaultValueSql("(newid())");

                entity.Property(e => e.DateTimeRegistration).HasColumnType("datetime");

                entity.Property(e => e.Email).IsRequired();

                entity.Property(e => e.Login).IsRequired();

                entity.Property(e => e.Password).IsRequired();

                entity.Property(e => e.PasswordConfirm).IsRequired();

                entity.Property(e => e.Role)
                    .IsRequired()
                    .HasDefaultValueSql("(N'guest')");

                entity.Property(e => e.TelephoneNumber).IsRequired();
            });
        }
    }
}
