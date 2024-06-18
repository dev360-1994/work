using LaserTraderApi.Models;
using Microsoft.EntityFrameworkCore;

namespace LaserTraderApi.Services.LookupService
{
    public class LookupService : ILookupService
    {
        private readonly AppDbContext _dbContext;
        public LookupService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<LookupCountry>> GetCountries()
        {
            return await _dbContext.LookupCountries.OrderBy(x => x.Order).ToListAsync();
        }

        public async Task<List<LaserType>> GetLaserTypes()
        {
            return await _dbContext.LaserTypes.OrderBy(x => x.Order).ToListAsync();
        }

        public async Task<List<ProductOption>> GetProductOptions()
        {
            return await _dbContext.ProductOptions.OrderBy(x => x.Order).ToListAsync();
        }

        public async Task<List<LookupState>> GetStates(string countryCode)
        {
            return await _dbContext.LookupStates.Where(x => x.CountryCode == countryCode).OrderBy(x => x.Order).ToListAsync();
        }
    }
}
