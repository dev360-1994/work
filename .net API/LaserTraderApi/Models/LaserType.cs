using System.ComponentModel.DataAnnotations;

namespace LaserTraderApi.Models
{
    public class LaserType
    {
        [Key]
        public int LaserTypeId { get; set; }
        [StringLength(50)]
        public string Name { get; set; }
        [StringLength(200)]
        public string? Description { get; set; }
        
        public int Order { get; set; }
        
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool Active { get; set; }

    }
}
