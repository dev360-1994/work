using System.ComponentModel.DataAnnotations;

namespace LaserTraderApi.Models
{
    public class LookupCountry
    {
        [Key]
        public int CountryId { get; set; }
        [StringLength(150)]
        public string CountryName { get; set; }
        [StringLength(2)]
        public string CountryCode { get; set; }
        
        public int Order { get; set; }
        

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool Active { get; set; }

    }
}
