using LaserTraderApi.Dtos;
using LaserTraderApi.Models;

namespace LaserTraderApi.Services
{
    public interface IInventoryService
    {
        Task<List<InventoryReportResponse>> GetAllInventories(string type);
        Task<Inventory?> CreateInventory(InventoryRequest inventoryRequest);
        Task<Inventory?> GetInventory(int inventoryId);
        Task<InventoryResponse?> GetInventoryDetails(int inventoryId);
        Task<Inventory?> UpdateInventory(int inventoryId, InventoryRequest inventoryRequest);
        Task<bool> DeleteInventory(int inventoryId);

        Task<bool> ChangeActive(int inventoryId, bool isActive);
        Task<bool> ChangeWarranty(int inventoryId, bool isWarranty);
        Task<bool> ChangeHotDeal(int inventoryId, bool isActive);
        Task<bool> IncrementViews(int inventoryId);

        Task<List<FilterResponseByProductName>> GetFilterByProductName(string type = "");
        Task<List<FilterResponseByCompanyName>> GetFilterByCompanyName(string type = "");
        Task<List<FilterResponseByPriceRange>> GetFilterByPriceRange(string type = "");

        Task<List<InventorySearchResponse>> SearchInventory(InventorySearchRequest request);
        Task<InventorySearchResponse?> SearchOneInventory(int inventoryId);

        Task<List<InventorySearchResponse>> GetRecentInventory();

        Task<List<InventorySearchResponse>> GetPopularInventory();

        Task<List<InventorySearchResponse>> GetPopularHotDealInventory();
    }
}
