using LaserTraderApi.Dtos;
using LaserTraderApi.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace LaserTraderApi.Services
{
    public class ReportService : IReportService
    {
        private readonly AppDbContext _dbContext;
        public ReportService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }
                
        public async Task<List<ContactReportResponse>> GetCsvContacts(ContactReportRequest contactReportRequest)
        {
            var contacts = contactReportRequest.ContactType == "all" ? await _dbContext.Contacts.Where(x => x.UpdatedAt.Date >= contactReportRequest.StartDate && x.UpdatedAt.Date <= contactReportRequest.EndDate).ToListAsync() : await _dbContext.Contacts.Where(x => x.UpdatedAt.Date >= contactReportRequest.StartDate && x.UpdatedAt.Date <= contactReportRequest.EndDate && x.Type == contactReportRequest.ContactType).ToListAsync();

            var results = from contact in contacts
                          join inventory in _dbContext.Inventories on contact.ContactId equals inventory.InsertedBy into InventoryDetails
                          join state in _dbContext.LookupStates on contact.State equals state.StateId into StateDetails
                          join country in _dbContext.LookupCountries on contact.Country equals country.CountryId into CountryDetails
                          from inv in InventoryDetails.DefaultIfEmpty()
                          from stateNew in StateDetails.DefaultIfEmpty()
                          from countryNew in CountryDetails.DefaultIfEmpty()
                          select new ContactReportResponse
                          {
                              Address = $"{contact.Address1} {contact.Address2} {contact.City} {stateNew?.StateName} {countryNew?.CountryName}",
                              Comments = contact.Comments ?? "",
                              CompanyName = contact.CompanyName ?? "",
                              ContactType = contact.Type ?? "",
                              DateCreated = contact.CreatedAt.ToString("MM/dd/yyyy"),
                              Email = contact.Email,
                              FirstName = contact.FirstName,
                              LastName = contact.LastName,
                              IsActive = contact.Active ? "Yes" : "No",
                              Phone = contact.Phone ?? "",
                              SKU = inv?.SKU ?? ""
                          };
            return results.ToList();
        }

        public async Task<List<ProductReportResponse>> GetCsvProducts(ProductReportRequest productReportRequest)
        {
            var productOptions = await _dbContext.ProductOptions.ToListAsync();
            var results = await _dbContext.Products
                .Where(x => x.UpdatedAt.Date >= productReportRequest.StartDate && x.UpdatedAt.Date <= productReportRequest.EndDate)
                .Select(y => new ProductReportResponse
                {
                    Company = y.Company ?? "",
                    ProductId = y.ProductId.ToString(),
                    CreatedDate = y.CreatedAt.ToString("MM/dd/yyyy"),
                    ModifiedDate = y.UpdatedAt.ToString("MM/dd/yyyy"),
                    Description = y.Description ?? "",
                    IsActive = y.Active ? "Yes": "No",
                    ProductModel = y.ProductName,
                    Type = y.Type ?? "",
                    WaveLength = y.WaveLength ?? "",
                    ProductOption = y.ProductOptions ?? ""
                })
                .ToListAsync();
            foreach(var item in results)
            {
                if (!string.IsNullOrEmpty(item.ProductOption)){
                    item.ProductOption = String.Join("\r\n", productOptions.Where(po => item.ProductOption.Split(',').ToList().Contains(po.ProductOptionId.ToString())).OrderBy(x => x.Order).Select(x => x.Name).ToList());
                }
            }
            return results;
        }

        public async Task<List<InventoryReportResponse>> GetCsvInventories(InventoryReportRequest request)
        {
            var active = request.Active == 1 ? true : false;
            var inventories = await _dbContext.Inventories.Where(x => x.UpdatedAt.Date >= request.StartDate && x.UpdatedAt.Date <= request.EndDate && x.Active == active).ToListAsync();

            var results = from inventory in inventories
                          join product in _dbContext.Products on inventory.ProductId equals product.ProductId into ProductDetails
                          join contact in _dbContext.Contacts on inventory.InsertedBy equals contact.ContactId into ContactDetails
                          from productNew in ProductDetails.DefaultIfEmpty()
                          from contactNew in ContactDetails.DefaultIfEmpty()
                          join state in _dbContext.LookupStates on contactNew?.State equals state.StateId into StateDetails
                          join country in _dbContext.LookupCountries on contactNew?.Country equals country.CountryId into CountryDetails
                          from stateNew in StateDetails.DefaultIfEmpty()
                          from countryNew in CountryDetails.DefaultIfEmpty()
                          select new InventoryReportResponse
                          {
                              AskingPrice = inventory.AskingPrice.ToString(),
                              InventoryId = inventory.InventoryId.ToString(),
                              ProductId = inventory.ProductId.ToString(),
                              ProductCompany = productNew?.Company ?? "",
                              Description = productNew?.Description ?? "",
                              ProductModel = productNew?.ProductName ?? "",
                              ProductYear = inventory.ProductYear.ToString(),
                              SellerWarranty = inventory.Include30DayWarranty ? "Yes": "No",
                              SKU = inventory.SKU ?? "",
                              BestOffer = inventory.BestOffer ? "Yes": "No",
                              Address = $"{contactNew?.Address1} {contactNew?.Address2} {contactNew?.City} {stateNew?.StateName} {countryNew?.CountryName}",
                              Comments = contactNew?.Comments ?? "",
                              CompanyName = contactNew?.CompanyName ?? "",
                              CreatedDate = contactNew?.CreatedAt.ToString("MM/dd/yyyy") ?? "",
                              ModifiedDate = inventory?.UpdatedAt.ToString("MM/dd/yyyy") ?? "",
                              Email = contactNew?.Email ?? "",
                              FirstName = contactNew?.FirstName ?? "",
                              LastName = contactNew?.LastName ?? "",
                              Phone = contactNew?.Phone ?? "",
                              
                              IsActive = inventory.Active ? "Yes" : "No",
                          };
            return results.ToList();
        }
    }
}
