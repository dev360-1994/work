using LaserTraderApi.Dtos;
using LaserTraderApi.Models;

namespace LaserTraderApi.Services
{
    public interface IWarrantyService
    {
        Task<List<WarrantyResponse>> GetAllWarranties(string type);
        Task<Warranty> CreateWarranty(WarrantyRequest request, int contactId);
        Task<Warranty?> GetWarranty(int warrantyId);
        Task<Warranty?> UpdateWarranty(int warrantyId, WarrantyRequest Request);
        Task<bool> DeleteWarranty(int warrantyId);

    }
}
