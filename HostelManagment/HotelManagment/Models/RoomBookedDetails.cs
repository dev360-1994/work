using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HotelManagment.Models
{
    public class RoomBookedDetails
    {
        #region User

        public int UserId { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Course { get; set; }

        public string Mobile { get; set; }
        
        public string Dob { get; set; }

        public string Gender { get; set; }
        #endregion

        public List<Address> AddressList { get; set; }

        #region Room Info
        public string Description { get; set; }
        public int Floor { get; set; }
        public int RoomNo { get; set; }
        public decimal RoomChangres { get; set; }

        public string CheckIn { get; set; }
        #endregion

        public class Address
        {
            #region Address
            public int AddressId { get; set; }
            public string Address1 { get; set; }
            public string Address2 { get; set; }
            public string City { get; set; }
            public string State { get; set; }
            public string PostCode { get; set; }
            public string Country { get; set; }
            public bool IsPrimary { get; set; }
            public string GuradianMobile { get; set; }
            #endregion
        }
    }
}