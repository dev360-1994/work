using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace LaserTraderApi.Dtos
{
    public class ProductRequest
    {
        [Required]
        public string? Company { get; set; }
        [Required]
        public string ProductName { get; set; }
        public string? MetaTitle { get; set; }
        public string? MetaKeywords { get; set; }
        public string? MetaDescription { get; set; }
        public string? Type { get; set; }
        public string? WaveLength { get; set; }

        public string? EnergyOutput { get; set; }
        public string? PulseLength { get; set; }
        public string? ProductOptions { get; set; }

        public float? AskingPrice { get; set; }
        public float? HighPrice { get; set; }

        public IFormFile? ProductImageFile { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.Always)]
        public string? ProductImage { get; set; }
        public string? Description { get; set; }
        [Required]
        public bool Approved { get; set; }
        
        public string? VideoLink { get; set; }
        [Required]
        public bool Active { get; set; }

        public int? InsertBy { get; set; }
    }

    public class SimpleProduct {
        public int ProductId { get; set; }
        public string Company { get; set; } = string.Empty;
        public string ProductName { get; set; } = string.Empty;
        public string WaveLength { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public float? AskingPrice { get; set; }
    }
}
