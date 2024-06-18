using System.Web.Security;
using Telerik.SvgIcons;

namespace mvno_admin.Models
{
    public class Users
    {
        public Users(long userId, string username, string firstName, string lastName, string company, string email, string roles)
        {
            this.userId = userId;
            this.username = username;
            this.firstName = firstName;
            this.lastName = lastName;
            this.company = company;
            this.email = email;
            this.roles = roles;
        }
        public long userId { get; set; }
        public string username { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string company { get; set; }
        public string email { get; set; }
        public string roles { get; set; }
    }
}