using System.ComponentModel.DataAnnotations;

namespace LaserTraderApi.Models
{
    public class WatchListProductOption
    {
        [Key]
        public int WatchListProductOptionId { get; set; }
        public int WatchListId { get; set; }
        public int ProductOptionId { get; set; }

        public ProductOption ProductOption { get; set; }
    }
}
