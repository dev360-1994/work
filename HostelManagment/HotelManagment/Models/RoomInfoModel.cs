using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace HotelManagment.Models
{
    public class RoomInfoModel
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public int Floor { get; set; }
        public int NoOfBeds { get; set; }
        public int RoomNo { get; set; }
        public decimal RoomChangres { get; set; }

        public int VacantBeds { get; set; }
    }
}