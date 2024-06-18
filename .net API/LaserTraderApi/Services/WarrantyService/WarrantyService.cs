using LaserTraderApi.Dtos;
using LaserTraderApi.Models;
using Microsoft.EntityFrameworkCore;

namespace LaserTraderApi.Services
{
    public class WarrantyService : IWarrantyService
    {
        private readonly AppDbContext _dbContext;
        public WarrantyService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<WarrantyResponse>> GetAllWarranties(string type = "active")
        {
            var warranties = type == "active" ? await _dbContext.Warranties.Where(x => x.Active).ToListAsync() : await _dbContext.Warranties.Where(x => !x.Active).ToListAsync();
            var results = from warranty in warranties
                          join contact in _dbContext.Contacts on warranty.ContactId equals contact.ContactId
                          select new WarrantyResponse
                          {
                              Warranty = warranty,
                              FullName = contact.FirstName + " " + contact.LastName,
                              Email = contact.Email,
                          };

            return results.ToList();
        }
        public async Task<Warranty> CreateWarranty(WarrantyRequest warrantyRequest, int contactId)
        {
            string warrantyImage = null;
            if (warrantyRequest.ProductIamgeFile  != null)
            {
                await UploadWarrantyImage(warrantyRequest.ProductIamgeFile);
                warrantyImage = warrantyRequest.ProductIamgeFile.FileName;
            }
            Warranty warranty = new()
            {
                Active = warrantyRequest.Active,
                ContactId = contactId,
                Description = warrantyRequest.Description,
                Issues = warrantyRequest.Issues,
                IsUnderWarranty = warrantyRequest.IsUnderWarranty,
                LastServiceAction = warrantyRequest.LastServiceAction,
                LastServiceDate = warrantyRequest.LastServiceDate,
                Manufacturer = warrantyRequest.Manufacturer,
                Model = warrantyRequest.Model,
                PreferredContactMode = warrantyRequest.PreferredContactMode,
                PreferredContactTime = warrantyRequest.PreferredContactTime,
                ProductImage = warrantyImage,
                RecentServiceUserName = warrantyRequest.RecentServiceUserName,
                UnderWarrantyUserName = warrantyRequest.UnderWarrantyUserName,
                WarrantyPlanCost = warrantyRequest.WarrantyPlanCost,
                WarrantyPlanPeriod = warrantyRequest.WarrantyPlanPeriod,
                Year = warrantyRequest.Year,

                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
            };

            _dbContext.Warranties.Add(warranty);
            await _dbContext.SaveChangesAsync();
            return warranty;
        }

        private async Task UploadWarrantyImage(IFormFile imgFile)
        {
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "warranties", imgFile.FileName);
            Directory.CreateDirectory(Path.GetDirectoryName(filePath));
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await imgFile.CopyToAsync(stream);
            }
        }
        public async Task<Warranty?> UpdateWarranty(int warrantyId, WarrantyRequest warrantyRequest)
        {
            var warranty = await _dbContext.Warranties.FindAsync(warrantyId);
            if (warranty != null)
            {
                string warrantyImage = null;
                if (warrantyRequest.ProductIamgeFile != null)
                {
                    await UploadWarrantyImage(warrantyRequest.ProductIamgeFile);
                    warrantyImage = warrantyRequest.ProductIamgeFile.FileName;
                }

                warranty.Active = warrantyRequest.Active;
                warranty.Description = warrantyRequest.Description;
                warranty.Issues = warrantyRequest.Issues;
                warranty.IsUnderWarranty = warrantyRequest.IsUnderWarranty;
                warranty.LastServiceAction = warrantyRequest.LastServiceAction;
                warranty.LastServiceDate = warrantyRequest.LastServiceDate;
                warranty.Manufacturer = warrantyRequest.Manufacturer;
                warranty.Model = warrantyRequest.Model;
                warranty.PreferredContactMode = warrantyRequest.PreferredContactMode;
                warranty.PreferredContactTime = warrantyRequest.PreferredContactTime;
                warranty.RecentServiceUserName = warrantyRequest.RecentServiceUserName;
                warranty.UnderWarrantyUserName = warrantyRequest.UnderWarrantyUserName;
                warranty.WarrantyPlanCost = warrantyRequest.WarrantyPlanCost;
                warranty.WarrantyPlanPeriod = warrantyRequest.WarrantyPlanPeriod;
                warranty.Year = warrantyRequest.Year;
                if (warrantyImage != null)
                {
                    warranty.ProductImage = warrantyImage;
                }
                
                warranty.UpdatedAt = DateTime.Now;
                await _dbContext.SaveChangesAsync();
                return warranty;
            }
            else
            {
                return null;
            }
        }

        public async Task<Warranty?> GetWarranty(int warrantyId)
        {
            return await _dbContext.Warranties.FindAsync(warrantyId);
        }

        public async Task<bool> DeleteWarranty(int warrantyId)
        {
            var warranty = await _dbContext.Warranties.FindAsync(warrantyId);
            if (warranty != null)
            {
                var contact = await _dbContext.Contacts.FindAsync(warranty.ContactId);
                if (contact != null)
                {
                    _dbContext.Contacts.Remove(contact);
                }
                
                _dbContext.Warranties.Remove(warranty);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            else
            {
                return false;
            }
        }

    }
}
