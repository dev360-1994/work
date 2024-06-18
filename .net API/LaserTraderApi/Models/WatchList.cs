using System.ComponentModel.DataAnnotations;

namespace LaserTraderApi.Models
{
    public class WatchList
    {
        [Key]
        public int WatchListId { get; set; }
        public int ContactId { get; set; }
        public int ProductId { get; set; }
        

        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool Active { get; set; } = true;

        public ICollection<WatchListProduct>? WatchListProducts { get; set; }
        public ICollection<WatchListProductOption>? WatchListProductOptions { get; set; }
    }
}
