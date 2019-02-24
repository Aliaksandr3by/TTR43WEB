using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace TTR43WEB.Data
{
    public partial class DataContext : DbContext
    {
        public DataContext()
        {
        }

        public DataContext(DbContextOptions<DataContext> options)
            : base(options)
        {
        }

        public virtual DbSet<AttachmentA> AttachmentA { get; set; }
        public virtual DbSet<AttachmentB> AttachmentB { get; set; }
        public virtual DbSet<AttachmentG> AttachmentG { get; set; }
        public virtual DbSet<AttachmentJ> AttachmentJ { get; set; }
        public virtual DbSet<Table41> Table41 { get; set; }
        public virtual DbSet<Table43> Table43 { get; set; }
        public virtual DbSet<Table44> Table44 { get; set; }
        public virtual DbSet<Table51> Table51 { get; set; }
        public virtual DbSet<Table511> Table511 { get; set; }
        public virtual DbSet<Table512> Table512 { get; set; }
        public virtual DbSet<Table53> Table53 { get; set; }
        public virtual DbSet<Table54> Table54 { get; set; }
        public virtual DbSet<Table55> Table55 { get; set; }
        public virtual DbSet<Table551> Table551 { get; set; }
        public virtual DbSet<Table57> Table57 { get; set; }
        public virtual DbSet<TableDataSave> TableDataSave { get; set; }
        public virtual DbSet<Tables> Tables { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                optionsBuilder.UseSqlServer("Data Source=DESKTOP-OBC9S1R\\MSSQLSERVER2017;Initial Catalog=ATTACHMENT.MDF;User ID=guest;Password=guest;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("ProductVersion", "2.2.2-servicing-10034");

            modelBuilder.Entity<AttachmentA>(entity =>
            {
                entity.ToTable("attachment_A");

                entity.Property(e => e.Id)
                    .HasColumnName("ID")
                    .ValueGeneratedNever();

                entity.Property(e => e.Lja).HasColumnName("LJA");

                entity.Property(e => e.Material)
                    .IsRequired()
                    .HasColumnName("MATERIAL");

                entity.Property(e => e.Number)
                    .IsRequired()
                    .HasColumnName("NUMBER");

                entity.Property(e => e.RealLjaA).HasColumnName("REAL_LJA_A");

                entity.Property(e => e.RealLjaB).HasColumnName("REAL_LJA_B");

                entity.Property(e => e.RealMuijAb).HasColumnName("REAL_MUIJ_AB");

                entity.Property(e => e.RealSA).HasColumnName("REAL_S_A");

                entity.Property(e => e.RealSB).HasColumnName("REAL_S_B");

                entity.Property(e => e.WA).HasColumnName("W_A");

                entity.Property(e => e.WB).HasColumnName("W_B");
            });

            modelBuilder.Entity<AttachmentB>(entity =>
            {
                entity.ToTable("attachment_B");

                entity.Property(e => e.Id)
                    .HasColumnName("ID")
                    .ValueGeneratedNever();

                entity.Property(e => e.AirLayerThickness).HasColumnName("AIR_LAYER_THICKNESS");

                entity.Property(e => e.DirectionHeatFlow).HasColumnName("DIRECTION_HEAT_FLOW");

                entity.Property(e => e.ThermalResistanceNegative).HasColumnName("THERMAL_RESISTANCE_NEGATIVE");

                entity.Property(e => e.ThermalResistancePositive).HasColumnName("THERMAL_RESISTANCE_POSITIVE");
            });

            modelBuilder.Entity<AttachmentG>(entity =>
            {
                entity.ToTable("attachment_G");

                entity.Property(e => e.Id)
                    .HasColumnName("ID")
                    .ValueGeneratedNever();

                entity.Property(e => e.FillingLightOpening).HasColumnName("FILLING_LIGHT_OPENING");

                entity.Property(e => e.ThermalResistance).HasColumnName("THERMAL_RESISTANCE");
            });

            modelBuilder.Entity<AttachmentJ>(entity =>
            {
                entity.ToTable("attachment_J");

                entity.Property(e => e.Id)
                    .HasColumnName("ID")
                    .ValueGeneratedNever();

                entity.Property(e => e.LayerThickness).HasColumnName("LAYER_THICKNESS");

                entity.Property(e => e.Material).HasColumnName("MATERIAL");

                entity.Property(e => e.ResistanceVaporPermeability).HasColumnName("RESISTANCE_VAPOR_PERMEABILITY");
            });

            modelBuilder.Entity<Table41>(entity =>
            {
                entity.ToTable("Table_4_1");

                entity.Property(e => e.Id)
                    .HasColumnName("ID")
                    .ValueGeneratedNever();

                entity.Property(e => e.Build)
                    .IsRequired()
                    .HasColumnName("BUILD");

                entity.Property(e => e.DesignTemperature).HasColumnName("DESIGN_TEMPERATURE");

                entity.Property(e => e.RelativeAirHumidity).HasColumnName("RELATIVE_AIR_HUMIDITY");
            });

            modelBuilder.Entity<Table43>(entity =>
            {
                entity.ToTable("Table_4_3");

                entity.Property(e => e.Id)
                    .HasColumnName("ID")
                    .ValueGeneratedNever();

                entity.Property(e => e.City)
                    .IsRequired()
                    .HasColumnName("CITY");

                entity.Property(e => e.ColdestDaySecurity092).HasColumnName("COLDEST_DAY_SECURITY092");

                entity.Property(e => e.ColdestDaySecurity098).HasColumnName("COLDEST_DAY_SECURITY098");

                entity.Property(e => e.ColdestFiveDaySecurity092).HasColumnName("COLDEST_FIVE_DAY_SECURITY092");

                entity.Property(e => e.ColdestThreeDays).HasColumnName("COLDEST_THREE_DAYS");
            });

            modelBuilder.Entity<Table44>(entity =>
            {
                entity.ToTable("Table_4_4");

                entity.Property(e => e.Id)
                    .HasColumnName("ID")
                    .ValueGeneratedNever();

                entity.Property(e => e.AverageDailyOutsideTemperature).HasColumnName("AVERAGE_DAILY_OUTSIDE_TEMPERATURE");

                entity.Property(e => e.AverageOutsideTemperature).HasColumnName("AVERAGE_OUTSIDE_TEMPERATURE");

                entity.Property(e => e.AveragePartialPressure).HasColumnName("AVERAGE_PARTIAL_PRESSURE");

                entity.Property(e => e.AverageRelativeHumidity).HasColumnName("AVERAGE_RELATIVE_HUMIDITY");

                entity.Property(e => e.DurationHeatingSeason).HasColumnName("DURATION_HEATING_SEASON");

                entity.Property(e => e.Region)
                    .IsRequired()
                    .HasColumnName("REGION");
            });

            modelBuilder.Entity<Table51>(entity =>
            {
                entity.ToTable("Table_5_1");

                entity.Property(e => e.Id)
                    .HasColumnName("ID")
                    .ValueGeneratedNever();

                entity.Property(e => e.CalculationType).HasColumnName("CALCULATION_TYPE");

                entity.Property(e => e.Enclosure).HasColumnName("ENCLOSURE");

                entity.Property(e => e.KindOfActivity).HasColumnName("KIND_OF_ACTIVITY");

                entity.Property(e => e.StandardResistanceHeatTransfer).HasColumnName("STANDARD_RESISTANCE_HEAT_TRANSFER");

                entity.Property(e => e.TypeBuild).HasColumnName("TYPE_BUILD");

                entity.HasOne(d => d.KindOfActivityNavigation)
                    .WithMany(p => p.Table51)
                    .HasForeignKey(d => d.KindOfActivity)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_Table_5_1_3_Table_5_1_2");

                entity.HasOne(d => d.TypeBuildNavigation)
                    .WithMany(p => p.Table51)
                    .HasForeignKey(d => d.TypeBuild)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_Table_5_1_3_Table_5_1_1");
            });

            modelBuilder.Entity<Table511>(entity =>
            {
                entity.ToTable("Table_5_1_1");

                entity.Property(e => e.Id)
                    .HasColumnName("ID")
                    .ValueGeneratedNever();

                entity.Property(e => e.TypeBuild)
                    .IsRequired()
                    .HasColumnName("TYPE_BUILD");
            });

            modelBuilder.Entity<Table512>(entity =>
            {
                entity.ToTable("Table_5_1_2");

                entity.Property(e => e.Id)
                    .HasColumnName("ID")
                    .ValueGeneratedNever();

                entity.Property(e => e.KindOfActivity)
                    .IsRequired()
                    .HasColumnName("KIND_OF_ACTIVITY");
            });

            modelBuilder.Entity<Table53>(entity =>
            {
                entity.ToTable("Table_5_3");

                entity.Property(e => e.Id)
                    .HasColumnName("ID")
                    .ValueGeneratedNever();

                entity.Property(e => e.CoefficientN).HasColumnName("COEFFICIENT_N");

                entity.Property(e => e.Walling)
                    .IsRequired()
                    .HasColumnName("WALLING");
            });

            modelBuilder.Entity<Table54>(entity =>
            {
                entity.ToTable("Table_5_4");

                entity.Property(e => e.Id)
                    .HasColumnName("ID")
                    .ValueGeneratedNever();

                entity.Property(e => e.HeatTransferInternal).HasColumnName("HEAT_TRANSFER_INTERNAL");

                entity.Property(e => e.Walling)
                    .IsRequired()
                    .HasColumnName("WALLING");
            });

            modelBuilder.Entity<Table55>(entity =>
            {
                entity.ToTable("Table_5_5");

                entity.Property(e => e.Id)
                    .HasColumnName("ID")
                    .ValueGeneratedNever();

                entity.Property(e => e.BuildingsAndPremises).HasColumnName("BUILDINGS_AND_PREMISES");

                entity.Property(e => e.CoatingsAttics).HasColumnName("COATINGS_ATTICS");

                entity.Property(e => e.ExteriorWalls).HasColumnName("EXTERIOR_WALLS");

                entity.Property(e => e.Overlapping).HasColumnName("OVERLAPPING");
            });

            modelBuilder.Entity<Table551>(entity =>
            {
                entity.ToTable("Table_5_5_1");

                entity.Property(e => e.Id)
                    .HasColumnName("ID")
                    .ValueGeneratedNever();

                entity.Property(e => e.Structure)
                    .IsRequired()
                    .HasColumnName("STRUCTURE");
            });

            modelBuilder.Entity<Table57>(entity =>
            {
                entity.ToTable("Table_5_7");

                entity.Property(e => e.Id)
                    .HasColumnName("ID")
                    .ValueGeneratedNever();

                entity.Property(e => e.BuildingEnvelope).HasColumnName("BUILDING_ENVELOPE");

                entity.Property(e => e.HeatTransferCoefficientOuter).HasColumnName("HEAT_TRANSFER_COEFFICIENT_OUTER");
            });

            modelBuilder.Entity<TableDataSave>(entity =>
            {
                entity.ToTable("Table_Data_Save");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Material).HasColumnName("MATERIAL");
            });

            modelBuilder.Entity<Tables>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Description).HasColumnName("description");

                entity.Property(e => e.IdTables).HasColumnName("idTables");

                entity.Property(e => e.Name).HasColumnName("name");
            });
        }
    }
}
