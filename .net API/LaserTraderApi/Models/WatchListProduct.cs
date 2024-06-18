using System.ComponentModel.DataAnnotations;

namespace LaserTraderApi.Models
{
    public class WatchListProduct
    {
        [Key]
        public int WatchListProductId { get; set; }
        public int WatchListId { get; set; }
        public int ProductId { get; set; }

        public Product Product { get; set; }
    }
}
