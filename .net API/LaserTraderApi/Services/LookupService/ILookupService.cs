using LaserTraderApi.Models;

namespace LaserTraderApi.Services.LookupService
{
    public interface ILookupService
    {
        Task<List<LookupCountry>> GetCountries();
        Task<List<LookupState>> GetStates(string countryCode);
        Task<List<LaserType>> GetLaserTypes();
        Task<List<ProductOption>> GetProductOptions();

    }
}
