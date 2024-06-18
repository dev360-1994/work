using System.ComponentModel.DataAnnotations;

namespace LaserTraderApi.Dtos
{
    public class ContactReportRequest
    {
        [Required]
        public string ContactType { get; set; }
        [Required]
        public DateTime StartDate { get; set; }
        [Required]
        public DateTime EndDate { get; set; }

        public int FullName { get; set; } = 0;
        public int CompanyName { get; set; } = 0;
        public int Address { get; set; } = 0;
        public int Email { get; set; } = 0;
        public int Phone { get; set; } = 0;
        public int Sku { get; set; } = 0;
        public int Comments { get; set; } = 0;
    }

    public class ProductReportRequest
    {
        [Required]
        public DateTime StartDate { get; set; }
        [Required]
        public DateTime EndDate { get; set; }

        public int CompanyName { get; set; } = 0;
        public int ProductModel { get; set; } = 0;
        public int Type { get; set; } = 0;
        public int WaveLength { get; set; } = 0;
        public int Description { get; set; } = 0;
    }

    public class InventoryReportRequest
    {
        [Required]
        public DateTime StartDate { get; set; }
        [Required]
        public DateTime EndDate { get; set; }

        public int Active { get; set; } = 1;
        public int ProductCompany { get; set; } = 0;
        public int ProductModel { get; set; } = 0;
        public int ProductYear { get; set; } = 0;
        public int Sku { get; set; } = 0;
        public int Include30DayWarranty { get; set; } = 0;


        public int ContactFullName { get; set; } = 0;
        public int ContactCompanyName { get; set; } = 0;
        public int ContactAddress { get; set; } = 0;
        public int ContactEmail { get; set; } = 0;
        public int ContactPhone { get; set; } = 0;
        public int ContactComments { get; set; } = 0;
    }
}
