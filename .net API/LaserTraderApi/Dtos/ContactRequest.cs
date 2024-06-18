using LaserTraderApi.Models;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.Reflection.Metadata;

namespace LaserTraderApi.Dtos
{
    public class ContactRequest
    {
        [Required]
        public string FirstName { get; set; }
        [Required]
        public string LastName { get; set; }

        public string? CompanyName { get; set; }
        public string? Address1 { get; set; }
        public string? Address2 { get; set; }
        public string? City { get; set; }
        public int? State { get; set; }
        public string? Zip { get; set; }
        public int? Country { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        public string? ItlPrefix { get; set; }
        public string? Phone { get; set; }
        public string? Mobile { get; set; }
        [Required]
        public string Type { get; set; }

        public string? Comments { get; set; }

        public bool Active { get; set; }

        public string? PreferredContactType { get; set; }
        public string? Fax { get; set; }
        public string? Finance { get; set; }
        public string? MethodOfContact { get; set; }


        public int? YearOfManufacture { get; set; }
        public string? ErrorCode { get; set; }
        public string? LastServiceDesc { get; set; }
        public string? LastServiceDate { get; set; }
        public string? WhoLastService { get; set; }
        public IFormFile? ProductFile { get; set; }
        public bool? PersonTraining { get; set; }
        public bool? VirtualTraining { get; set; }
    }
    
    public class InvProdDto
    {
        public int InventoryId { get; set; }
        public int ProductId { get; set; }
        public string CompanyName { get; set; }
        public string ProductModel { get; set; }
        public bool IsActive { get; set; }
        public bool IsWarranty { get; set;}
    }

    public class ContactExtDto
    {
        public Contact Contact { get; set; }
        public InvProdDto? InvProduct { get; set; }

        public List<WatchList>? WatchList { get; set; }
        public ContactOffer? Offer { get; set; }
    }

    public class ContactResponse
    {
        public int ContactId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string CompanyName { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string SKU { get; set; }
        public string ContactType { get; set; }
        public string ProductName { get; set; }
        public string City { get; set; }
        public string Mobile { get; set; }
    }

    public class ContactRecentRequest
    {
        public string Type { get; set; } = string.Empty;
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }

    public class ContactsRequest
    {
        [Required]
        public ContactRequest Contact { get; set; }

        public ContactOffer? Offer { get; set; }

        public ContactWatchList? WatchList { get; set; }
        public int? ProductId { get; set; }
    }

    public class ContactOffer
    {
        public int? OfferId { get; set; }
        public int? ContactId { get; set; }
        public int? InventoryId { get; set; }
        public float OfferPrice { get; set; }

        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public bool? Active { get; set; }

    }

    public class ContactWatchList
    {
        public int? WatchListId { get; set; }
        public string? WatchListProductOptionIds { get; set; }
    }
}
