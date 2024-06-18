using LaserTraderApi.Dtos;
using LaserTraderApi.Models;
using LaserTraderApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LaserTraderApi.Controllers
{
    //[Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class WarrantyController : ControllerBase
    {
        private readonly IWarrantyService _warrantyService;
        public WarrantyController(IWarrantyService warrantyService)
        {
            _warrantyService = warrantyService;
        }

        [HttpGet]
        [Route("")]
        public async Task<List<WarrantyResponse>> GetAllWarrantys(string type="")
        {
            return await _warrantyService.GetAllWarranties(type);
        }

        [HttpGet]
        [Route("{warrantyId}")]
        public async Task<ActionResult<Warranty>> GetWarranty(int warrantyId)
        {
            var warranty = await _warrantyService.GetWarranty(warrantyId);
            return warranty == null ? NotFound() : Ok(warranty);
        }

        [HttpDelete]
        [Route("{warrantyId}")]
        public async Task<ActionResult> DeleteWarranty(int warrantyId)
        {
            var isSuccess = await _warrantyService.DeleteWarranty(warrantyId);
            return !isSuccess ? NotFound() : Ok();
        }

        [HttpPut]
        [Route("{warrantyId}")]
        public async Task<ActionResult<Warranty>> UpdateWarranty(int warrantyId, [FromForm] WarrantyRequest request)
        {
            var warranty = await _warrantyService.UpdateWarranty(warrantyId, request);
            return warranty == null ? NotFound() : Ok(warranty);
        }
    }
}
