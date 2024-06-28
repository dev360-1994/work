using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(HotelManagment.Startup))]
namespace HotelManagment
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
