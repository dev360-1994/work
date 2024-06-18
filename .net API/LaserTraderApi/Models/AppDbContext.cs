using Microsoft.EntityFrameworkCore;

namespace LaserTraderApi.Models
{
    public class AppDbContext: DbContext
    {
        public AppDbContext(DbContextOptions dbContextOptions) : base(dbContextOptions)
        {

        }

        public DbSet<User> Users { get; set; }
        public DbSet<Contact> Contacts { get; set; }
        public DbSet<LookupCountry> LookupCountries { get; set; }
        public DbSet<LookupState> LookupStates { get; set; }
        public DbSet<LaserType> LaserTypes { get; set; }
        public DbSet<ProductOption> ProductOptions { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<Inventory> Inventories { get; set; }
        public DbSet<Offer> Offers { get; set; }
        public DbSet<WatchList> WatchLists { get; set; }
        public DbSet<WatchListProduct> WatchListProducts { get; set; }
        public DbSet<WatchListProductOption> WatchListProductOptions { get; set; }
        public DbSet<Warranty> Warranties { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder
              .Entity<User>(entity =>
              {
                  entity.Property(e => e.CreatedAt)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");
                  entity.Property(e => e.UpdatedAt)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");
                  entity.Property(e => e.Active)
                    .HasDefaultValue(true);
              });
            
            modelBuilder
              .Entity<Contact>(entity =>
              {
                  entity.Property(e => e.CreatedAt)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");
                  entity.Property(e => e.UpdatedAt)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");
                  entity.Property(e => e.Active)
                    .HasDefaultValue(true);
              });
            modelBuilder
              .Entity<LookupCountry>(entity =>
              {
                  entity.Property(e => e.CreatedAt)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");
                  entity.Property(e => e.UpdatedAt)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");
                  entity.Property(e => e.Active)
                    .HasDefaultValue(true);
              });
            modelBuilder
              .Entity<LookupState>(entity =>
              {
                  entity.Property(e => e.CreatedAt)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");
                  entity.Property(e => e.UpdatedAt)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");
                  entity.Property(e => e.Active)
                    .HasDefaultValue(true);
              });

            modelBuilder
              .Entity<LaserType>(entity =>
              {
                  entity.Property(e => e.CreatedAt)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");
                  entity.Property(e => e.UpdatedAt)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");
                  entity.Property(e => e.Active)
                    .HasDefaultValue(true);
              });
            modelBuilder
              .Entity<ProductOption>(entity =>
              {
                  entity.Property(e => e.CreatedAt)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");
                  entity.Property(e => e.UpdatedAt)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");
                  entity.Property(e => e.Active)
                    .HasDefaultValue(true);
              });
            
            modelBuilder
              .Entity<Product>(entity =>
              {
                  entity.Property(e => e.CreatedAt)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");
                  entity.Property(e => e.UpdatedAt)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");
                  entity.Property(e => e.Active)
                    .HasDefaultValue(true);
                  entity.Property(e => e.Approved)
                    .HasDefaultValue(false);
              });
            modelBuilder
              .Entity<Inventory>(entity =>
              {
                  entity.Property(e => e.CreatedAt)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");
                  entity.Property(e => e.UpdatedAt)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");
                  entity.Property(e => e.Active)
                    .HasDefaultValue(true);
                  entity.Property(e => e.BestOffer)
                    .HasDefaultValue(false);
                  entity.Property(e => e.Approved)
                    .HasDefaultValue(false);
                  entity.Property(e => e.Sold)
                    .HasDefaultValue(false);
                  entity.Property(e => e.Views)
                    .HasDefaultValue(0);
                  entity.Property(e => e.HotDeal)
                    .HasDefaultValue(false);
                  entity.Property(e => e.VideoApproved)
                    .HasDefaultValue(false);
                  entity.Property(e => e.UserImageApproved)
                    .HasDefaultValue(false);
                  entity.Property(e => e.Include30DayWarranty)
                    .HasDefaultValue(false);
                  entity.Property(e => e.BlueDot)
                    .HasDefaultValue(false);
              });
            modelBuilder
              .Entity<Offer>(entity =>
              {
                  entity.Property(e => e.CreatedAt)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");
                  entity.Property(e => e.UpdatedAt)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");
                  entity.Property(e => e.Active)
                    .HasDefaultValue(true);
              });

            modelBuilder
              .Entity<WatchList>(entity =>
              {
                  entity.Property(e => e.CreatedAt)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");
                  entity.Property(e => e.UpdatedAt)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");
                  entity.Property(e => e.Active)
                    .HasDefaultValue(true);
              });

            modelBuilder
              .Entity<Warranty>(entity =>
              {
                  entity.Property(e => e.CreatedAt)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");
                  entity.Property(e => e.UpdatedAt)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");
                  entity.Property(e => e.Active)
                    .HasDefaultValue(true);
              });
        }
    }
}
