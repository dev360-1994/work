using System.ComponentModel.DataAnnotations;
using System.Security.Policy;

namespace LaserTraderApi.Dtos
{
    public class ContactReportResponse
    {
        public string DateCreated { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string CompanyName { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string SKU { get; set; }
        public string Comments { get; set; }
        public string IsActive { get; set; }
        public string ContactType { get; set; }
    }
    public class ProductReportResponse
    {
        public string ProductId { get; set; }
        public string Company { get; set; }
        public string ProductModel { get; set; }
        public string Type { get; set; }
        public string WaveLength { get; set; }
        public string ProductOption { get; set; }
        public string Description { get; set; }
        public string IsActive { get; set; }
        public string CreatedDate { get; set; }
        public string ModifiedDate { get; set; }
    }

    public class InventoryReportResponse
    {
        public string InventoryId { get; set; }
        public string ProductCompany { get; set; }
        public string ProductModel { get; set; }
        public string ProductYear { get; set; }
        public string SKU { get; set; }
        public string SellerWarranty { get; set; }
        public string AskingPrice { get; set; }
        public string IsActive { get; set; }
        public string Description { get; set; }
        public string BestOffer { get; set; }

        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string CompanyName { get; set; }
        public string Address { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Comments { get; set; }   
        public string CreatedDate { get; set; }
        public string ModifiedDate { get; set; }
        public string ProductId { get; set; }
    }
}
