using LaserTraderApi.Dtos;
using LaserTraderApi.Models;

namespace LaserTraderApi.Services
{
    public interface IReportService
    {
        Task<List<ContactReportResponse>> GetCsvContacts(ContactReportRequest contactReportRequest);
        Task<List<ProductReportResponse>> GetCsvProducts(ProductReportRequest productReportRequest);

        Task<List<InventoryReportResponse>> GetCsvInventories(InventoryReportRequest request);
    }
}
