using LaserTraderApi.Dtos;
using LaserTraderApi.Models;
using LaserTraderApi.Services.LookupService;
using Microsoft.AspNetCore.Mvc;

namespace LaserTraderApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LookupController : ControllerBase
    {
        private readonly ILookupService _lookupService;
        public LookupController(ILookupService lookupService)
        {
            _lookupService = lookupService;
        }

        [HttpGet]
        [Route("countries")]
        public async Task<List<LookupCountry>> GetCountries()
        {
            return await _lookupService.GetCountries();
        }

        [HttpGet]
        [Route("states")]
        public async Task<List<LookupState>> GetStates(string countryCode)
        {
            return await _lookupService.GetStates(countryCode);
        }

        [HttpGet]
        [Route("product-options")]
        public async Task<List<ProductOption>> GetProductOptions()
        {
            return await _lookupService.GetProductOptions();
        }

        [HttpGet]
        [Route("laser-types")]
        public async Task<List<LaserType>> GetLayserTypes()
        {
            return await _lookupService.GetLaserTypes();
        }
    }
}
