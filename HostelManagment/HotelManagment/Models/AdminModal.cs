using HotelManagment.Database_Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HotelManagment.Models
{
    public class AdminModal
    {
        public List<AccessLog> Logs { get; set; }

        public string Sales { get; set; }
        public int Rooms { get; set; }
        public int Bookings { get; set; }
        public int TotalBeds { get; set; }
    }
}