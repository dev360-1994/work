using System.Web.Security;
using Telerik.SvgIcons;

namespace mvno_admin.Models
{
    public class Roles
    {
        public Roles(string role, long usersAssigned, string description, string isActive)
        {
            this.role = role;
            this.usersAssigned = usersAssigned;
            this.description = description;
            this.isActive = isActive;
        }
        public string role { get; set; }
        public long usersAssigned { get; set; }
        public string description { get; set; }
        public string isActive { get; set; }
    }
}