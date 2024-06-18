using System.ComponentModel.DataAnnotations;

namespace LaserTraderApi.Models
{
    public class Warranty
    {
        [Key]
        public int WarrantyId { get; set; }
        public int ContactId { get; set; }
        [StringLength(255)]
        public string Manufacturer { get; set; } = string.Empty;
        [StringLength(255)]
        public string Model { get; set; } = string.Empty;
        [StringLength(4)]
        public string Year { get; set; } = string.Empty;
        [StringLength(255)]
        public string Issues { get; set; } = string.Empty;
        [StringLength(1024)]
        public string Description { get; set; } = string.Empty;

        [StringLength(255)]
        public string? ProductImage { get; set; }
        public DateTime LastServiceDate { get; set; }
        [StringLength(255)]
        public string LastServiceAction { get; set; } = string.Empty;
        [StringLength(255)]
        public string RecentServiceUserName { get; set; } = string.Empty;

        public bool IsUnderWarranty { get; set; } = true;
        [StringLength(255)]
        public string UnderWarrantyUserName { get; set; } = string.Empty;
        [StringLength(255)]
        public string WarrantyPlanPeriod { get; set; } = string.Empty;
        [StringLength(255)]
        public string WarrantyPlanCost { get; set; } = string.Empty;

        [StringLength(255)]
        public string PreferredContactMode { get; set; } = "Email";

        public DateTime PreferredContactTime { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool Active { get; set; }

    }
}
