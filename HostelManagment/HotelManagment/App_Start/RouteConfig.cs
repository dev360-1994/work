using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace HotelManagment
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
name: "MyProfile",
url: "MyProfile",
defaults: new { controller = "User", action = "Profile" }
);
            routes.MapRoute(
name: "Logout",
url: "Logout",
defaults: new { controller = "Login", action = "Logout" }
);
            routes.MapRoute(
        name: "UserDashBoard",
        url: "UserDashBoard",
        defaults: new { controller = "User", action = "Dashboard" }
    );

            routes.MapRoute(
          name: "AdminDashBoard",
          url: "AdminDashBoard",
          defaults: new { controller = "Admin", action = "Index" }
      );
            routes.MapRoute(
       name: "Security",
       url: "Security",
       defaults: new { controller = "User", action = "ChangePassword" }
   );
            routes.MapRoute(
   name: "AddEditRoom",
   url: "AddEditRoom",
   defaults: new { controller = "Hostel", action = "AddRoom" }
);
            routes.MapRoute(
name: "RoomsInfo",
url: "RoomsInfo",
defaults: new { controller = "Hostel", action = "Index" }
);
            routes.MapRoute(
name: "RoomRequests",
url: "RoomRequests",
defaults: new { controller = "Hostel", action = "RoomsRequest" }
);

            routes.MapRoute(
name: "AllUsers",
url: "AllUsers",
defaults: new { controller = "User", action = "Index" }
);

            routes.MapRoute(
name: "AddEditUser",
url: "AddEditUser",
defaults: new { controller = "User", action = "AddUser" }
);

            routes.MapRoute(
name: "EditUser",
url: "EditUser",
defaults: new { controller = "User", action = "EditUser" }
);
            routes.MapRoute(
name: "AllCourses",
url: "AllCourses",
defaults: new { controller = "Course", action = "AllCourses" }
);
            routes.MapRoute(
name: "GetRoom",
url: "GetRoom",
defaults: new { controller = "User", action = "HostelBooking" }
);
            routes.MapRoute(
name: "AddEditCourse",
url: "AddEditCourse",
defaults: new { controller = "Course", action = "AddCourse" }
);
            routes.MapRoute(
name: "AssignRoom",
url: "AssignRoom",
defaults: new { controller = "Hostel", action = "AssignRoom" }
);
            routes.MapRoute(
name: "RoomDetails",
url: "RoomDetails",
defaults: new { controller = "User", action = "GetRoomDetails" }
);
            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Login", action = "Index", id = UrlParameter.Optional }
            );


        }
    }
}
