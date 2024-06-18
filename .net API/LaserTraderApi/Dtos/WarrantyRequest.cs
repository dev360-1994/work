using LaserTraderApi.Models;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace LaserTraderApi.Dtos
{
    public class WarrantyRequest
    {
        [Required]
        [StringLength(255)]
        public string Manufacturer { get; set; } = string.Empty;
        [Required]
        [StringLength(255)]
        public string Model { get; set; } = string.Empty;
        [Required]
        [StringLength(4)]
        public string Year { get; set; } = string.Empty;
        [Required]
        [StringLength(255)]
        public string Issues { get; set; } = string.Empty;
        [Required]
        [StringLength(1024)]
        public string Description { get; set; } = string.Empty;

        public IFormFile? ProductIamgeFile { get; set; }
        [Required]
        public DateTime LastServiceDate { get; set; }
        [Required]
        [StringLength(255)]
        public string LastServiceAction { get; set; } = string.Empty;
        [Required]
        [StringLength(255)]
        public string RecentServiceUserName { get; set; } = string.Empty;
        [Required]
        public bool IsUnderWarranty { get; set; } = true;
        [Required]
        [StringLength(255)]
        public string UnderWarrantyUserName { get; set; } = string.Empty;
        [Required]
        [StringLength(255)]
        public string WarrantyPlanPeriod { get; set; } = string.Empty;
        [Required]
        [StringLength(255)]
        public string WarrantyPlanCost { get; set; } = string.Empty;
        [Required]
        [StringLength(255)]
        public string PreferredContactMode { get; set; } = "Email";

        [Required]
        public DateTime PreferredContactTime { get; set; }

        public bool Active { get; set; } = true;
    }

    public class WarrantyResponse
    {
        public Warranty Warranty { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; }
    }
}
