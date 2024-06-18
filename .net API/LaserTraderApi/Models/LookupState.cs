using System.ComponentModel.DataAnnotations;

namespace LaserTraderApi.Models
{
    public class LookupState
    {
        [Key]
        public int StateId { get; set; }
        [StringLength(150)]
        public string StateName { get; set; }
        [StringLength(2)]
        public string StateCode { get; set; }
        
        public int Order { get; set; }
        [StringLength(2)]
        public string CountryCode { get; set; }

        [StringLength(2048)]
        public string? Regulations { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool Active { get; set; }

    }
}
