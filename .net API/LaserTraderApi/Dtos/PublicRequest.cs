using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace LaserTraderApi.Dtos
{
    public class CreateSellRequest
    {
        [Required]
        public ContactRequest Contact { get; set; }
        [Required]
        public ProductInventoryRequest ProductInventory { get; set; }
    }

    public class ProductInventoryRequest
    {
        public int ProductId { get; set; } = 0;
        [Required]
        public string Company { get; set; } = string.Empty;
        [Required]
        public string ProductName { get; set; } = string.Empty;
        [Required] 
        public string Type { get; set; } = string.Empty;
        public string WaveLength { get; set; } = string.Empty;

        public string? EnergyOutput { get; set; }
        public string? PulseLength { get; set; }
        public string? ProductOptions { get; set; }

        public string? Description { get; set; }
        
        public string? VideoLink { get; set; }
        
        // Inventory
        [Required]
        public int ProductYear { get; set; }
        [Required]
        public float AskingPrice { get; set; }
        [Required]
        public bool BestOffer { get; set; }
        public IFormFile? UserImageFile { get; set; }
        
        public string? SerialNumber { get; set; }
        public string? ReasonForSelling { get; set; }
        public string? InvDescription { get; set; }
        
        [Required]
        public bool HotDeal { get; set; }
        [Required]
        public bool Include30DayWarranty { get; set; }
        [Required]
        public bool BlueDot { get; set; }

        public string? GeneralCondition { get; set; }
        public string? Accessories { get; set; }
        public string? HourCount { get; set; }
        public string? LastServiced { get; set; }
        public string? OperatorManuals { get; set; }
        public string? Handpieces { get; set; }
        public string? OriginalBoxes { get; set; }
    }
    
    public class ContactUsRequest
    {
        [Required]
        public ContactRequest Contact { get; set; }

        // ask seller a question
        public int? InventoryId { get; set; }

        // make seller an offer
        public float? OfferPrice { get; set; }

        // for watch list
        public int? ProductId { get; set; }
        public string? ProductOptions { get; set; }
        public IFormFile? ProductFile { get; set; }
    }

    public class UnwatchRequest
    {
        [Required]
        public int ContactId { get; set; }
        [Required]
        public int ProductId { get; set; }
    }
    public class WarrantyContactRequest
    {
        [Required]
        public ContactRequest Contact { get; set; }
        [Required]
        public WarrantyRequest Warranty { get; set; }
    }
}
