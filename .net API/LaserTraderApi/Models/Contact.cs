using System.ComponentModel.DataAnnotations;

namespace LaserTraderApi.Models
{
    public class Contact
    {
        [Key]
        public int ContactId { get; set; }
        [StringLength(50)]
        public string? UserId { get; set; }
        [StringLength(50)]
        public string FirstName { get; set; } = string.Empty;
        [StringLength(50)]
        public string LastName { get; set; } = string.Empty;
        [StringLength(256)]
        public string? CompanyName { get; set; }
        [StringLength(256)]
        public string? Address1 { get; set; }
        [StringLength(100)]
        public string? Address2 { get; set; }
        [StringLength(50)]
        public string? City { get; set; }
        public int? State { get; set; }
        [StringLength(50)]
        public string? Zip { get; set; }
        public int? Country { get; set; }
        [StringLength(256)]
        public string Email { get; set; } = string.Empty;
        public string? ItlPrefix { get; set; }
        [StringLength(50)]
        public string? Phone { get; set; }
        [StringLength(50)]
        public string? Mobile { get; set; }
        [StringLength(50)]
        public string? Type { get; set; }

        [StringLength(4096)]
        public string? Comments { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool Active { get; set; }

        [StringLength(10)]
        public string? PreferredContactType { get; set; }

        [StringLength(50)]
        public string? Fax { get; set; }

        [StringLength(10)]
        public string? Finance { get; set; }

        [StringLength(50)]
        public string? MethodOfContact { get; set; }

        public int? YearOfManufacture { get; set; }
        public string? ErrorCode { get; set; }
        public string? LastServiceDesc { get; set; }
        public DateTime? LastServiceDate { get; set; }
        public string? WhoLastService { get; set; }
        public string? ProductFile { get; set; }
        public bool? PersonTraining { get; set; }
        public bool? VirtualTraining { get; set; }
        public int? ProductId { get; set; }
    }
}
