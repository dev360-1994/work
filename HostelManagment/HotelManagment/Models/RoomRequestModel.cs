using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HotelManagment.Models
{
    public class RoomRequestModel
    {
        #region roomrequest
        public int RequestId { get; set; }
        public int UserId { get; set; }
        public int Budegt { get; set; }
        public bool IsRoomAssigned { get; set; }
        public string Message { get; set; }
        public string CheckIn { get; set; }
        #endregion

        #region User
        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Email { get; set; }

        public string Address { get; set; }

        public string Course { get; set; }

        public string Mobile { get; set; }
        #endregion

        #region rooms
        
        public List<Rooms> RoomModel { get; set; }
        public class Rooms
        {
            public int Roomid { get; set; }
            public int RoomNo { get; set; }
        }
        #endregion
    }
}