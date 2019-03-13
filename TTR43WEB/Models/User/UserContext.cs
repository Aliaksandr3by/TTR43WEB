using Microsoft.EntityFrameworkCore;

namespace TTR43WEB.Models.User
{
    public class UserContext : DbContext
    {
        public virtual DbSet<User> Users { get; set; }

        public UserContext()
        {
            Database.EnsureCreated();
        }

        public UserContext(DbContextOptions<UserContext> options) : base(options)
        {
        }
    }
}
