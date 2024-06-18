using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LaserTraderApi.Models
{
    public class Product
    {
        [Key]
        public int ProductId { get; set; }
        [StringLength(255)]
        public string? Company { get; set; }
        [StringLength(255)]
        public string ProductName { get; set; }
        [StringLength(4096)]
        public string? MetaTitle { get; set; }
        [StringLength(4096)]
        public string? MetaKeywords { get; set; }
        [StringLength(4096)]
        public string? MetaDescription { get; set; }
        [StringLength(255)]
        public string? Type { get; set; }
        [StringLength(255)]
        public string? WaveLength { get; set; }
        
        [StringLength(50)]
        public string? EnergyOutput { get; set; }
        [StringLength(50)]
        public string? PulseLength { get; set; }
        [StringLength(255)]
        public string? ProductOptions { get; set; }

        public float? AskingPrice { get; set; } 
        public float? HighPrice { get; set; }

        [StringLength(255)]
        public string? ProductImage { get; set; }
        [StringLength(4096)]
        public string? Description { get; set; }

        public bool Approved { get; set; }
        public int? ApprovedBy { get; set; }
        public int? InsertBy { get; set; }
        [StringLength(500)]
        public string? VideoLink { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool Active { get; set; }

    }
}
