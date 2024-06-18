using LaserTraderApi.Models;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace LaserTraderApi.Dtos
{
    public class InventoryRequest
    {
        [Required]
        public int ProductId { get; set; }
        [Required]
        public int ProductYear { get; set; }
        [Required]
        public float AskingPrice { get; set; }
        [Required]
        public bool BestOffer { get; set; }
        public IFormFile? InventoryImageFile { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.Always)]
        public string? InventoryImage { get; set; }

        public string? SKU { get; set; }
        public string? SerialNumber { get; set; }
        public string? ReasonForSelling { get; set; }
        public string? Description { get; set; }
        [Required]
        public bool Approved { get; set; }
        public int? ApprovedBy { get; set; }
        [Required]
        public int InsertedBy { get; set; }
        [Required]
        public bool Sold { get; set; }
        public int Views { get; set; } = 0;

        public bool HotDeal { get; set; }
        public string? VideoLink { get; set; }
        public bool VideoApproved { get; set; }
        public IFormFile? UserImageFile { get; set; }
        [JsonIgnore(Condition = JsonIgnoreCondition.Always)]
        public string? UserImage { get; set; }
        [Required]
        public bool UserImageApproved { get; set; }
        [Required]
        public bool Include30DayWarranty { get; set; }

        public string? Notes { get; set; }
        [Required]
        public bool BlueDot { get; set; }
        [Required]
        public bool Active { get; set; }

        public string? GeneralCondition { get; set; }
        public string? Accessories { get; set; }
        public string? HourCount { get; set; }
        public string? LastServiced { get; set; }
        public string? OperatorManuals { get; set; }
        public string? Handpieces { get; set; }
        public string? OriginalBoxes { get; set; }

    }

    public class FilterResponseByProductName
    {
        public string ProductName { get; set; }
        public int Cnt { get; set; }
    }

    public class FilterResponseByCompanyName
    {
        public string CompanyName { get; set; }
        public int Cnt { get; set; }
    }
    public class FilterResponseByPriceRange
    {
        public string PriceRange { get; set; }
        public int RangeStart { get; set; }
        public int RangeEnd { get; set; }
        public int Cnt { get; set; }
    }

    public class InventorySearchRequest
    {
        public string ProductName { get; set; } = "";
        public string CompanyName { get; set; } = "";
        public int? RangeStart { get; set; }
        public int? RangeEnd { get; set; }
        public string ProductOption { get; set; } = "";
        public bool? BlueDot { get; set; }

        public string ProductSearchKey { get; set; } = string.Empty;
        public string CompanySearchKey { get; set; } = string.Empty;

        // for getting multiple Inventories
        public string InventoryIds { get; set; } = string.Empty;
    }

    public class InventorySearchResponse
    {
        public int InventoryId { get; set; }
        public int ProductId { get; set; }
        public string ProductCompany { get; set; } = "";
        public string ProductModel { get; set; } = "";
        public string ProductType { get; set; } = "";
        public string ProductImage { get; set; } = "";
        public List<string> ProductOptions { get; set; } = new List<string>();
        public string ProductOptionIds { get; set; } = "";
        public string WaveLength { get; set; } = "";


        public int ProductYear { get; set; }
        public string SKU { get; set; } = "";
        public string Description { get; set; } = "";
        public bool SellerWarranty { get; set; }
        public float AskingPrice { get; set; }
        public bool IsActive { get; set; }
        public bool BestOffer { get; set; }
        public bool BlueDot { get; set; }
        
        public DateTime CreatedAt { get; set; }
        public int Views { get; set; }
    }
}
