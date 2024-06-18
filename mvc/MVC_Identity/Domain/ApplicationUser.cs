using Microsoft.AspNetCore.Identity;

namespace MVC_Identity.Domain
{
    public class ApplicationUser: IdentityUser
    {
        public string Name { get; set; }
    }
}
