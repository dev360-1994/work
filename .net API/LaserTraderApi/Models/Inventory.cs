using System.ComponentModel.DataAnnotations;

namespace LaserTraderApi.Models
{
    public class Inventory
    {
        [Key]
        public int InventoryId { get; set; }
        
        public int ProductId { get; set; }
        public int ProductYear { get; set; }
        public float AskingPrice { get; set; }
        public bool BestOffer { get; set; }
        [StringLength(255)]
        public string? InventoryImage { get; set; }
        
        [StringLength(50)]
        public string? SKU { get; set; }
        [StringLength(50)]
        public string? SerialNumber { get; set; }
        [StringLength(255)]
        public string? ReasonForSelling { get; set; }
        [StringLength(4096)]
        public string? Description { get; set; }
        
        public bool Approved { get; set; }
        public int? ApprovedBy { get; set; }
        public int InsertedBy { get; set; }
        public bool Sold { get; set; }
        public int Views { get; set; }

        
        public bool HotDeal { get; set; }
        [StringLength(500)]
        public string? VideoLink { get; set; }
        public bool VideoApproved { get; set; }

        [StringLength(500)]
        public string? UserImage { get; set; }
        public bool UserImageApproved { get; set; }
        
        public bool Include30DayWarranty { get; set; } 
        
        [StringLength(255)]
        public string? Notes { get; set; }
        public bool BlueDot { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool Active { get; set; }

        public string? GeneralCondition { get; set; }
        public string? Accessories { get; set; }
        public string? HourCount { get; set; }
        public DateTime? LastServiced { get; set; }
        public string? OperatorManuals { get; set; }
        public string? Handpieces { get; set; }
        public string? OriginalBoxes { get; set; }
    }
}
