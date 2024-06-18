using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LaserTraderApi.Models
{
    public class Offer
    {
        [Key]
        public int OfferId { get; set; }
        public int? ContactId { get; set; }
        public Contact? Contact { get; set; }
        public int? InventoryId { get; set; }
        public Inventory? Inventory { get; set; }
        public float OfferPrice { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool Active { get; set; } = true;

    }
}
