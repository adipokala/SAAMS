using Microsoft.EntityFrameworkCore;
using Saams.EF.AccessManagement;
using Saams.EF.UserManagement;
using Saams.EF.LeaveManagement;

namespace Saams.EF
{
    public class SaamsContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Company> Companies { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<Privilege> Privileges { get; set; }
        public DbSet<RolePrivilege> RolePrivileges { get; set; }
        public DbSet<Designation> Designations { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Shift> Shifts { get; set; }
        public DbSet<Reader> Readers { get; set; }
        public DbSet<Area> Areas { get; set; }
        public DbSet<Channel> Channels { get; set; }
        public DbSet<Leave> Leaves { get; set; }
        public DbSet<LeaveCounter> LeaveCounters { get; set; }
        public DbSet<UserLeave> UsersLeaves { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql("Host=localhost; Database=saamsdb; Username=saams_user; Password=saams12345");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // User
            modelBuilder.Entity<User>()
                .HasIndex(u => new { u.UserNumber, u.UserName, u.Email })
                .IsUnique();

            modelBuilder.Entity<User>()
                .Property(u => u.Sex)
                .HasConversion<string>();

            modelBuilder.Entity<User>()
                .HasMany(u => u.UserLeaves)
                .WithOne(u => u.User)
                .HasForeignKey(u => u.UserId);

            modelBuilder.Entity<User>()
                .HasMany(u => u.LeaveCounters)
                .WithOne(u => u.User)
                .HasForeignKey(u => u.UserId);

            modelBuilder.Entity<User>()
                .Property(u => u.CreatedAt)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<User>()
                .Property(u => u.CreatedAt)
                .ValueGeneratedOnUpdate();

            // Role
            modelBuilder.Entity<Role>()
                .HasIndex(r => r.Code)
                .IsUnique();

            modelBuilder.Entity<Role>()
                .HasMany(r => r.Users)
                .WithOne(r => r.Role)
                .HasForeignKey(r => r.RoleId)
                .IsRequired();

            modelBuilder.Entity<Role>()
                .HasMany(r => r.RolePrivileges)
                .WithOne(r => r.Role)
                .HasForeignKey(r => r.RoleId)
                .IsRequired();

            modelBuilder.Entity<Role>()
                .Property(u => u.CreatedAt)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<Role>()
                .Property(u => u.CreatedAt)
                .ValueGeneratedOnUpdate();

            // Privilege
            modelBuilder.Entity<Privilege>()
                .HasIndex(p => p.Code)
                .IsUnique();

            modelBuilder.Entity<Privilege>()
                .HasMany(p => p.RolePrivileges)
                .WithOne(p => p.Privilege)
                .HasForeignKey(p => p.PrivilegeId)
                .IsRequired();

            modelBuilder.Entity<Privilege>()
                .Property(u => u.CreatedAt)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<Privilege>()
                .Property(u => u.CreatedAt)
                .ValueGeneratedOnUpdate();

            // RolePrivilege
            modelBuilder.Entity<RolePrivilege>()
                .Property(u => u.CreatedAt)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<RolePrivilege>()
                .Property(u => u.CreatedAt)
                .ValueGeneratedOnUpdate();

            // Company
            modelBuilder.Entity<Company>()
                .HasIndex(c => new { c.Code, c.Email })
                .IsUnique();

            modelBuilder.Entity<Company>()
                .HasMany(c => c.Users)
                .WithOne(c => c.Company)
                .HasForeignKey(c => c.CompanyId)
                .IsRequired();

            modelBuilder.Entity<Company>()
                .Property(u => u.CreatedAt)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<Company>()
                .Property(u => u.CreatedAt)
                .ValueGeneratedOnUpdate();

            // Designation
            modelBuilder.Entity<Designation>()
                .HasIndex(d => d.Code)
                .IsUnique();

            modelBuilder.Entity<Designation>()
                .HasMany(d => d.Users)
                .WithOne(d => d.Designation)
                .HasForeignKey(d => d.DesignationId)
                .IsRequired();

            modelBuilder.Entity<Designation>()
                .Property(u => u.CreatedAt)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<Designation>()
                .Property(u => u.CreatedAt)
                .ValueGeneratedOnUpdate();

            // Department
            modelBuilder.Entity<Department>()
                .HasIndex(d => d.Code)
                .IsUnique();

            modelBuilder.Entity<Department>()
                .HasMany(d => d.Users)
                .WithOne(d => d.Department)
                .HasForeignKey(d => d.DepartmentId)
                .IsRequired();

            modelBuilder.Entity<Department>()
                .Property(u => u.CreatedAt)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<Department>()
                .Property(u => u.UpdatedAt)
                .ValueGeneratedOnUpdate();

            // Shift
            modelBuilder.Entity<Shift>()
                .HasIndex(s => s.Code)
                .IsUnique();

            modelBuilder.Entity<Shift>()
                .Property(s => s.Type)
                .HasConversion<string>();

            modelBuilder.Entity<Shift>()
                .HasMany(s => s.Users)
                .WithOne(s => s.Shift)
                .HasForeignKey(s => s.ShiftId)
                .IsRequired();

            modelBuilder.Entity<Shift>()
                .Property(u => u.CreatedAt)
                .ValueGeneratedOnAdd();

            modelBuilder.Entity<Shift>()
                .Property(u => u.CreatedAt)
                .ValueGeneratedOnUpdate();

            // Reader
            modelBuilder.Entity<Reader>()
                .HasIndex(r => new { r.Code, r.SerialNumber })
                .IsUnique();

            modelBuilder.Entity<Reader>()
                .Property(r => r.DoorMode)
                .HasConversion<string>();

            modelBuilder.Entity<Reader>()
                .Property(r => r.Type)
                .HasConversion<string>();

            modelBuilder.Entity<Reader>()
                .Property(r => r.AccessControl)
                .HasConversion<string>();

            modelBuilder.Entity<Reader>()
                .Property(r => r.Switch)
                .HasConversion<string>();

            modelBuilder.Entity<Reader>()
                .Property(r => r.Display)
                .HasConversion<string>();

            modelBuilder.Entity<Reader>()
                .Property(r => r.TransactionLog)
                .HasConversion<string>();

            // Channel
            modelBuilder.Entity<Channel>()
                .HasIndex(c => c.Code)
                .IsUnique();

            modelBuilder.Entity<Channel>()
                .Property(c => c.Type)
                .HasConversion<string>();

            modelBuilder.Entity<Channel>()
                .HasMany(c => c.Readers)
                .WithOne(c => c.Channel)
                .HasForeignKey(c => c.ChannelId)
                .IsRequired();

            // Area
            modelBuilder.Entity<Area>()
                .HasIndex(a => a.Code)
                .IsUnique();

            modelBuilder.Entity<Area>()
                .HasMany(a => a.Readers)
                .WithOne(a => a.Area)
                .HasForeignKey(a => a.AreaId);

            // Leave
            modelBuilder.Entity<Leave>()
                .HasIndex(l => l.Code)
                .IsUnique();

            modelBuilder.Entity<Leave>()
                .HasMany(l => l.UserLeaves)
                .WithOne(l => l.Leave)
                .HasForeignKey(l => l.LeaveId);

            modelBuilder.Entity<Leave>()
                .HasMany(l => l.LeaveCounters)
                .WithOne(l => l.Leave)
                .HasForeignKey(l => l.LeaveId);

            base.OnModelCreating(modelBuilder);
        }

        public override int SaveChanges()
        {
            AddTimestamps();
            return base.SaveChanges();
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            AddTimestamps();
            return await base.SaveChangesAsync();
        }

        private void AddTimestamps()
        {
            var entities = ChangeTracker.Entries()
                .Where(x => x.Entity is IEntity && (x.State == EntityState.Added || x.State == EntityState.Modified));

            foreach (var entity in entities)
            {
                var now = DateTime.UtcNow; // current datetime

                if (entity.State == EntityState.Added)
                {
                    ((IEntity)entity.Entity).CreatedAt = now;
                }
                ((IEntity)entity.Entity).UpdatedAt = now;
            }
        }
    }
}
