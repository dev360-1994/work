using LaserTraderApi.Dtos;
using LaserTraderApi.Models;
using LaserTraderApi.Services;
using Microsoft.AspNetCore.Mvc;

namespace LaserTraderApi.Controllers
{
    //[Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class InventoryController : ControllerBase
    {
        private readonly IInventoryService _inventoryService;
        
        public InventoryController(IInventoryService inventoryService)
        {
            _inventoryService = inventoryService;

        }

        [HttpGet]
        [Route("")]
        public async Task<List<InventoryReportResponse>> GetAllInventorys(string type="")
        {
            return await _inventoryService.GetAllInventories(type);
        }

        [HttpPost]
        [Route("")]
        public async Task<ActionResult<Inventory>> CreateInventory([FromForm] InventoryRequest request)
        {
            var inventory = await _inventoryService.CreateInventory(request);
            return inventory == null ? NotFound() : Ok(inventory);
        }

        [HttpGet]
        [Route("{inventoryId}")]
        public async Task<ActionResult<InventoryResponse>> GetInventory(int inventoryId)
        {
            var inventoryResponse = await _inventoryService.GetInventoryDetails(inventoryId);
            return inventoryResponse != null ? Ok(inventoryResponse) : NotFound();
            
        }

        [HttpDelete]
        [Route("{inventoryId}")]
        public async Task<ActionResult> DeleteInventory(int inventoryId)
        {
            var isSuccess = await _inventoryService.DeleteInventory(inventoryId);
            return !isSuccess ? NotFound() : Ok();
        }

        [HttpPut]
        [Route("{inventoryId}")]
        public async Task<ActionResult<Inventory>> UpdateInventory(int inventoryId, [FromForm] InventoryRequest request)
        {
            var inventory = await _inventoryService.UpdateInventory(inventoryId, request);
            return inventory == null ? NotFound() : Ok(inventory);
        }

        [HttpPatch]
        [Route("{inventoryId}/update-active")]
        public async Task<ActionResult<bool>> UpdateInventoryActive(int inventoryId, bool isActive)
        {
            var isSuccess = await _inventoryService.ChangeActive(inventoryId, isActive);
            return !isSuccess ? NotFound() : Ok(isSuccess);
        }

        [HttpPatch]
        [Route("{inventoryId}/update-hotdeal")]
        public async Task<ActionResult<bool>> UpdateInventoryHotDeal(int inventoryId, bool isHotDeal)
        {
            var isSuccess = await _inventoryService.ChangeHotDeal(inventoryId, isHotDeal);
            return !isSuccess ? NotFound() : Ok(isSuccess);
        }

        [HttpPatch]
        [Route("{inventoryId}/update-warranty")]
        public async Task<ActionResult<bool>> UpdateInventoryWarranty(int inventoryId, bool isWarranty)
        {
            var isSuccess = await _inventoryService.ChangeWarranty(inventoryId, isWarranty);
            return !isSuccess ? NotFound() : Ok(isSuccess);
        }

        [HttpPatch]
        [Route("{inventoryId}/increament-views")]
        public async Task<ActionResult<bool>> IncrementViews(int inventoryId)
        {
            var isSuccess = await _inventoryService.IncrementViews(inventoryId);
            return !isSuccess ? NotFound() : Ok(isSuccess);
        }

        [HttpGet]
        [Route("/group-by/product-name")]
        public async Task<List<FilterResponseByProductName>> GetGroupByProductName(string type = "")
        {
            return await _inventoryService.GetFilterByProductName(type);
        }

        [HttpGet]
        [Route("/group-by/company-name")]
        public async Task<List<FilterResponseByCompanyName>> GetGroupByCompanyName(string type="")
        {
            return await _inventoryService.GetFilterByCompanyName(type);
        }

        [HttpGet]
        [Route("/group-by/price-range")]
        public async Task<List<FilterResponseByPriceRange>> GetGroupByPriceRange(string type = "")
        {
            return await _inventoryService.GetFilterByPriceRange(type);
        }

        [HttpPost]
        [Route("/search")]
        public async Task<List<InventorySearchResponse>> SearchInventories(InventorySearchRequest request)
        {
            return await _inventoryService.SearchInventory(request);
        }

        [HttpGet]
        [Route("/search/{inventoryId}")]
        public async Task<ActionResult<InventorySearchResponse>> GetSearchInventory(int inventoryId)
        {
            var inv = await _inventoryService.SearchOneInventory(inventoryId);
            return inv == null ? NotFound() : Ok(inv);
        }

        [HttpGet]
        [Route("/recents-inventories")]
        public async Task<List<InventorySearchResponse>> GetRecentInventories()
        {
            return await _inventoryService.GetRecentInventory();
        }


        [HttpGet]
        [Route("/popular-inventories")]
        public async Task<List<InventorySearchResponse>> GetPopularInventories()
        {
            return await _inventoryService.GetPopularInventory();
        }

        [HttpGet]
        [Route("/popular-hotdeal-inventories")]
        public async Task<List<InventorySearchResponse>> GetPopularHotDealInventories()
        {
            return await _inventoryService.GetPopularHotDealInventory();
        }
    }
}
