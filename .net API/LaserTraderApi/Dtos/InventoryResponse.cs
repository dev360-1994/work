using LaserTraderApi.Models;

namespace LaserTraderApi.Dtos
{
    public class InventoryResponse
    {
        public Inventory? Inventory { get; set; }
        public Product? ProductDetails { get; set; }
    }

    public class InventoryDetails : Inventory
    {
        public string? Type { get; set; }
    }
}
