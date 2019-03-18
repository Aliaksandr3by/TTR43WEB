﻿using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace TTR43WEB.Datum
{
    public partial class ProductContext : DbContext
    {
        public ProductContext()
        {
        }

        public ProductContext(DbContextOptions<ProductContext> options)
            : base(options)
        {
        }

        public virtual DbSet<BarCode> BarCode { get; set; }
        public virtual DbSet<Dimension> Dimension { get; set; }
        public virtual DbSet<Favorites> Favorites { get; set; }
        public virtual DbSet<ManufacturingCountry> ManufacturingCountry { get; set; }
        public virtual DbSet<MarkingGoods> MarkingGoods { get; set; }
        public virtual DbSet<Name> Name { get; set; }
        public virtual DbSet<Products> Products { get; set; }
        public virtual DbSet<Trademark> Trademark { get; set; }
        public virtual DbSet<Url> Url { get; set; }
        public virtual DbSet<Users> Users { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlServer("Data Source=DESKTOP-OBC9S1R\\MSSQLSERVER2017;Initial Catalog=Product;User ID=guest;Password=guest;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("ProductVersion", "2.2.2-servicing-10034");

            modelBuilder.Entity<BarCode>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.BarCodeProduct).IsRequired();
            });

            modelBuilder.Entity<Dimension>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.DimensionProduct).IsRequired();
            });

            modelBuilder.Entity<ManufacturingCountry>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.ManufacturingCountryProduct).IsRequired();
            });

            modelBuilder.Entity<MarkingGoods>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("id");
            });

            modelBuilder.Entity<Name>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.NameProduct).IsRequired();
            });

            modelBuilder.Entity<Products>(entity =>
            {
                entity.Property(e => e.Date).HasColumnType("datetime");

                entity.Property(e => e.Price).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.PriceOneKilogram).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.PriceOneLiter).HasColumnType("decimal(18, 2)");

                entity.Property(e => e.PriceWithoutDiscount).HasColumnType("decimal(18, 2)");

                entity.HasOne(d => d.BarCodeNavigation)
                    .WithMany(p => p.Products)
                    .HasForeignKey(d => d.BarCode)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_Products_BarCode");

                entity.HasOne(d => d.DimensionNavigation)
                    .WithMany(p => p.Products)
                    .HasForeignKey(d => d.Dimension)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_Products_Dimension");

                entity.HasOne(d => d.ManufacturingCountryNavigation)
                    .WithMany(p => p.Products)
                    .HasForeignKey(d => d.ManufacturingCountry)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_Products_ManufacturingCountry");

                entity.HasOne(d => d.MarkingGoodsNavigation)
                    .WithMany(p => p.Products)
                    .HasForeignKey(d => d.MarkingGoods)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_Products_MarkingGoods");

                entity.HasOne(d => d.NameNavigation)
                    .WithMany(p => p.Products)
                    .HasForeignKey(d => d.Name)
                    .HasConstraintName("FK_Products_Name");

                entity.HasOne(d => d.TrademarkNavigation)
                    .WithMany(p => p.Products)
                    .HasForeignKey(d => d.Trademark)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_Products_Trademark");

                entity.HasOne(d => d.UrlNavigation)
                    .WithMany(p => p.Products)
                    .HasForeignKey(d => d.Url)
                    .HasConstraintName("FK_Products_Url");
            });

            modelBuilder.Entity<Trademark>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.TrademarkProduct).IsRequired();
            });

            modelBuilder.Entity<Url>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.UrlProduct).IsRequired();
            });

            modelBuilder.Entity<Users>(entity =>
            {
                entity.Property(e => e.Login).IsRequired();

                entity.Property(e => e.Password).IsRequired();
            });
        }
    }
}