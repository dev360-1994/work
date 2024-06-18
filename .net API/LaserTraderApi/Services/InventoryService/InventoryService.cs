using Azure.Core;
using LaserTraderApi.Dtos;
using LaserTraderApi.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace LaserTraderApi.Services
{
    public class InventoryService : IInventoryService
    {
        private readonly AppDbContext _dbContext;
        private readonly IEmailService _emailService;
        public InventoryService(AppDbContext dbContext, IEmailService emailService)
        {
            _dbContext = dbContext;
            _emailService = emailService;
        }

        public async Task<List<InventoryReportResponse>> GetAllInventories(string type)
        {
            var inventories = type == "active" ? await _dbContext.Inventories.Where(x => x.Active).ToListAsync() : type == "inactive" ? await _dbContext.Inventories.Where(x => x.Active == false).ToListAsync() : await _dbContext.Inventories.ToListAsync();

            var results = from inventory in inventories
                          join product in _dbContext.Products on inventory.ProductId equals product.ProductId into ProductDetails
                          join contact in _dbContext.Contacts on inventory.InsertedBy equals contact.ContactId into ContactDetails
                          from contactNew in ContactDetails.DefaultIfEmpty()
                          from productNew in ProductDetails.DefaultIfEmpty()
                          select new InventoryReportResponse
                          {
                              AskingPrice = inventory.AskingPrice.ToString(),
                              InventoryId = inventory.InventoryId.ToString(),
                              ProductCompany = productNew?.Company ?? "",
                              Description = productNew?.Description ?? "",
                              ProductModel = productNew?.ProductName ?? "",
                              ProductYear = inventory.ProductYear.ToString(),
                              SellerWarranty = inventory.Include30DayWarranty ? "Yes" : "No",
                              SKU = inventory.SKU ?? "",
                              BestOffer = inventory.BestOffer ? "Yes" : "No",
                              Comments = contactNew?.Comments ?? "",
                              CompanyName = contactNew?.CompanyName ?? "",
                              CreatedDate = inventory?.CreatedAt.ToString("MM/dd/yyyy") ?? "",
                              ModifiedDate = inventory?.UpdatedAt.ToString("MM/dd/yyyy") ?? "",
                              Email = contactNew?.Email ?? "",
                              FirstName = contactNew?.FirstName ?? "",
                              LastName = contactNew?.LastName ?? "",
                              Phone = contactNew?.Phone ?? "",

                              IsActive = inventory.Active ? "Yes" : "No",
                          };
            return results.ToList();
        }
        public async Task<Inventory?> CreateInventory(InventoryRequest inventoryRequest)
        {
            var product = await _dbContext.Products.FindAsync(inventoryRequest.ProductId);
            if (product == null)
            {
                return null;
            }
            string inventoryImage = null;
            if (inventoryRequest.InventoryImageFile != null)
            {
                await UploadInventoryImage(inventoryRequest.InventoryImageFile);
                inventoryImage = inventoryRequest.InventoryImageFile.FileName;
            }
            string userImagePath = null;
            if (inventoryRequest.UserImageFile != null)
            {
                await UploadInventoryImage(inventoryRequest.UserImageFile);
                userImagePath = inventoryRequest.UserImageFile.FileName;
            }
            Inventory inventory = new Inventory
            {
                Approved = inventoryRequest.Approved,
                Active = inventoryRequest.Active,
                ApprovedBy = inventoryRequest.ApprovedBy,
                AskingPrice = inventoryRequest.AskingPrice,
                BestOffer = inventoryRequest.BestOffer,
                BlueDot = inventoryRequest.BlueDot,
                Description = inventoryRequest.Description,
                HotDeal = inventoryRequest.HotDeal,
                Include30DayWarranty = inventoryRequest.Include30DayWarranty,
                InsertedBy = inventoryRequest.InsertedBy,
                InventoryImage = inventoryImage == null ? product.ProductImage : inventoryImage,
                Notes = inventoryRequest.Notes,
                ProductId = inventoryRequest.ProductId,
                ProductYear = inventoryRequest.ProductYear,
                ReasonForSelling = inventoryRequest.ReasonForSelling,
                SerialNumber = inventoryRequest.SerialNumber,
                SKU = inventoryRequest.SKU,
                Sold = inventoryRequest.Sold,
                UserImage = userImagePath,
                UserImageApproved = inventoryRequest.UserImageApproved,
                VideoApproved = inventoryRequest.VideoApproved,
                VideoLink = inventoryRequest.VideoLink,
                Views = inventoryRequest.Views,

                GeneralCondition = inventoryRequest.GeneralCondition,
                Accessories = inventoryRequest.Accessories,
                HourCount = inventoryRequest.HourCount,
                LastServiced = !string.IsNullOrEmpty(inventoryRequest.LastServiced)
    ? DateTime.Parse(inventoryRequest.LastServiced, null, System.Globalization.DateTimeStyles.RoundtripKind) : null,
                OperatorManuals = inventoryRequest.OperatorManuals,
                Handpieces = inventoryRequest.Handpieces,
                OriginalBoxes = inventoryRequest.OriginalBoxes,

                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
            };

            _dbContext.Inventories.Add(inventory);
            await _dbContext.SaveChangesAsync();
            return inventory;
        }

        private async Task UploadInventoryImage(IFormFile imgFile)
        {
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "products", imgFile.FileName);
            Directory.CreateDirectory(Path.GetDirectoryName(filePath));
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await imgFile.CopyToAsync(stream);
            }
        }
        public async Task<Inventory?> UpdateInventory(int inventoryId, InventoryRequest inventoryRequest)
        {
            var inventory = await _dbContext.Inventories.FindAsync(inventoryId);
            var product = await _dbContext.Products.FindAsync(inventoryRequest.ProductId);
            if (inventory != null && product != null)
            {
                bool existingIsActive = inventory.Active;
                string inventoryImage = null;
                if (inventoryRequest.InventoryImageFile != null)
                {
                    await UploadInventoryImage(inventoryRequest.InventoryImageFile);
                    inventoryImage = inventoryRequest.InventoryImageFile.FileName;
                }
                string userImagePath = null;
                if (inventoryRequest.UserImageFile != null)
                {
                    await UploadInventoryImage(inventoryRequest.UserImageFile);
                    userImagePath = inventoryRequest.UserImageFile.FileName;
                }

                inventory.Approved = inventoryRequest.Approved;
                inventory.Active = inventoryRequest.Active;
                inventory.ApprovedBy = inventoryRequest.ApprovedBy;
                inventory.AskingPrice = inventoryRequest.AskingPrice;
                inventory.BestOffer = inventoryRequest.BestOffer;
                inventory.BlueDot = inventoryRequest.BlueDot;
                inventory.Description = inventoryRequest.Description;
                inventory.HotDeal = inventoryRequest.HotDeal;
                inventory.Include30DayWarranty = inventoryRequest.Include30DayWarranty;
                inventory.InsertedBy = inventoryRequest.InsertedBy;
                if (inventoryImage != null)
                {
                    inventory.InventoryImage = inventoryImage;
                }

                inventory.Notes = inventoryRequest.Notes;
                inventory.ProductId = inventoryRequest.ProductId;
                inventory.ProductYear = inventoryRequest.ProductYear;
                inventory.ReasonForSelling = inventoryRequest.ReasonForSelling;
                inventory.SerialNumber = inventoryRequest.SerialNumber;
                inventory.SKU = inventoryRequest.SKU;
                inventory.Sold = inventoryRequest.Sold;
                if (userImagePath != null)
                {
                    inventory.UserImage = userImagePath;
                }

                inventory.UserImageApproved = inventoryRequest.UserImageApproved;
                inventory.VideoApproved = inventoryRequest.VideoApproved;
                inventory.VideoLink = inventoryRequest.VideoLink;
                inventory.Views = inventoryRequest.Views;

                inventory.UpdatedAt = DateTime.Now;

                inventory.GeneralCondition = inventoryRequest.GeneralCondition;
                inventory.Accessories = inventoryRequest.Accessories;
                inventory.HourCount = inventoryRequest.HourCount;
                inventory.LastServiced = !string.IsNullOrEmpty(inventoryRequest.LastServiced)
    ? DateTime.Parse(inventoryRequest.LastServiced, null, System.Globalization.DateTimeStyles.RoundtripKind) : null;
                inventory.OperatorManuals = inventoryRequest.OperatorManuals;
                inventory.Handpieces = inventoryRequest.Handpieces;
                inventory.OriginalBoxes = inventoryRequest.OriginalBoxes;

                await _dbContext.SaveChangesAsync();

                var inventoryContact = _dbContext.Contacts.Where(x => x.ContactId == inventory.InsertedBy).FirstOrDefault();
                if (inventoryContact != null && inventoryRequest.Active && !existingIsActive)
                    await _emailService.SendSellisLiveEmail(inventoryContact.Email, inventoryContact.FirstName + " " + inventoryContact.LastName, inventoryId);

                return inventory;
            }
            else
            {
                return null;
            }
        }

        public async Task<Inventory?> GetInventory(int inventoryId)
        {
            return await _dbContext.Inventories.Where(x => x.InventoryId == inventoryId).FirstOrDefaultAsync();
        }

        public async Task<InventoryResponse?> GetInventoryDetails(int inventoryId)
        {
            var inventoryDetails = new InventoryResponse();
            var inventoryRecord = await _dbContext.Inventories
                     .Where(x => x.InventoryId == inventoryId)
                     .Select(x => new InventoryDetails
                     {
                         InventoryId = x.InventoryId,
                         ProductId = x.ProductId,
                         ProductYear = x.ProductYear,
                         AskingPrice = x.AskingPrice,
                         BestOffer = x.BestOffer,
                         InventoryImage = x.InventoryImage,
                         SKU = x.SKU,
                         SerialNumber = x.SerialNumber,
                         ReasonForSelling = x.ReasonForSelling,
                         Description = x.Description,
                         Approved = x.Approved,
                         ApprovedBy = x.ApprovedBy,
                         InsertedBy = x.InsertedBy,
                         Sold = x.Sold,
                         Views = x.Views,
                         HotDeal = x.HotDeal,
                         VideoLink = x.VideoLink,
                         VideoApproved = x.VideoApproved,
                         UserImage = x.UserImage,
                         UserImageApproved = x.UserImageApproved,
                         Include30DayWarranty = x.Include30DayWarranty,
                         Notes = x.Notes,
                         BlueDot = x.BlueDot,
                         CreatedAt = x.CreatedAt,
                         UpdatedAt = x.UpdatedAt,
                         Active = x.Active,
                         GeneralCondition = x.GeneralCondition,
                         Accessories = x.Accessories,
                         HourCount = x.HourCount,
                         LastServiced = x.LastServiced,
                         OperatorManuals = x.OperatorManuals,
                         Handpieces = x.Handpieces,
                         OriginalBoxes = x.OriginalBoxes,
                     })
                     .FirstOrDefaultAsync();

            if (inventoryRecord != null)
            {
                var inventoryContactId = inventoryRecord.InsertedBy;
                var inventoryContactDetails = await _dbContext.Contacts.Where(x => x.ContactId == inventoryContactId).FirstOrDefaultAsync();
                inventoryRecord.Type = inventoryContactDetails != null ? inventoryContactDetails.Type : string.Empty;

                var invProductDetails = await _dbContext.Products.FindAsync(inventoryRecord.ProductId);
                inventoryDetails = new InventoryResponse
                {
                    Inventory = inventoryRecord, ProductDetails = invProductDetails
                };
            }
            return inventoryDetails;
        }

        public async Task<bool> DeleteInventory(int inventoryId)
        {
            var inventory = await _dbContext.Inventories.FindAsync(inventoryId);
            if (inventory != null)
            {
                _dbContext.Offers.RemoveRange(_dbContext.Offers.Where(x => x.InventoryId != null && x.InventoryId == inventory.InventoryId));
                _dbContext.Contacts.RemoveRange(_dbContext.Contacts.Where(x => x.ContactId == inventory.InsertedBy));
                _dbContext.Inventories.Remove(inventory);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            else
            {
                return false;
            }
        }

        public async Task<bool> ChangeActive(int inventoryId, bool isActive)
        {
            var inventory = await _dbContext.Inventories.FindAsync(inventoryId);
            if (inventory != null)
            {
                bool existingIsActive = inventory.Active;
                var contact = await _dbContext.Contacts.FindAsync(inventory.InsertedBy);
                inventory.Active = isActive;
                if (!isActive)
                {
                    if (contact != null)
                    {
                        contact.Active = isActive;
                    }
                }
                await _dbContext.SaveChangesAsync();

                if (isActive && !existingIsActive)
                    await _emailService.SendSellisLiveEmail(contact.Email, contact.FirstName + " " + contact.LastName, inventoryId);

                return true;
            }
            else
            {
                return false;
            }
        }

        public async Task<bool> ChangeHotDeal(int inventoryId, bool isActive)
        {
            var inventory = await _dbContext.Inventories.FindAsync(inventoryId);
            if (inventory != null)
            {
                inventory.HotDeal = isActive;
                await _dbContext.SaveChangesAsync();
                return true;
            }
            else
            {
                return false;
            }
        }

        public async Task<bool> ChangeWarranty(int inventoryId, bool isWarranty)
        {
            var inventory = await _dbContext.Inventories.FindAsync(inventoryId);
            if (inventory != null)
            {
                inventory.Include30DayWarranty = isWarranty;
                await _dbContext.SaveChangesAsync();
                return true;
            }
            else
            {
                return false;
            }
        }

        public async Task<bool> IncrementViews(int inventoryId)
        {
            var inventory = await _dbContext.Inventories.FindAsync(inventoryId);
            if (inventory != null)
            {
                inventory.Views++;
                await _dbContext.SaveChangesAsync();
                return true;
            }
            else
            {
                return false;
            }
        }

        public async Task<List<FilterResponseByProductName>> GetFilterByProductName(string type = "")
        {
            var inventories = type == "bluedot" ? await _dbContext.Inventories.Where(x => x.BlueDot == true && x.Approved && x.Active).ToListAsync() : await _dbContext.Inventories.Where(x => x.Approved && x.Active).ToListAsync();
            var results = from i in inventories
                          join p in _dbContext.Products on i.ProductId equals p.ProductId
                          where i.Active == true
                          group p by p.ProductName into g
                          orderby g.Key
                          select new FilterResponseByProductName
                          {
                              ProductName = g.Key,
                              Cnt = g.Count()
                          };
            return results.ToList();
        }

        public async Task<List<FilterResponseByCompanyName>> GetFilterByCompanyName(string type = "")
        {
            var inventories = type == "bluedot" ? await _dbContext.Inventories.Where(x => x.BlueDot == true && x.Approved && x.Active).ToListAsync() : await _dbContext.Inventories.Where(x => x.Approved && x.Active).ToListAsync();
            var results = from i in inventories
                          join p in _dbContext.Products on i.ProductId equals p.ProductId
                          where i.Active == true
                          group p by p.Company into g
                          orderby g.Key
                          select new FilterResponseByCompanyName
                          {
                              CompanyName = g.Key,
                              Cnt = g.Count()
                          };
            return results.ToList();
        }

        public async Task<List<FilterResponseByPriceRange>> GetFilterByPriceRange(string type = "")
        {
            var priceRanges = new float[] { 0, 5000, 10000, 25000, 50000, 255001 };
            var inventories = type == "bluedot" ? await _dbContext.Inventories.Where(x => x.BlueDot == true && x.Active && x.Approved && x.AskingPrice < priceRanges.Last()).ToListAsync() : await _dbContext.Inventories.Where(x => x.Active && x.Approved && x.AskingPrice < priceRanges.Last()).ToListAsync();

            var results = from i in inventories
                          let rangeIndex = priceRanges.TakeWhile(pr => pr <= i.AskingPrice).Count() - 1
                          group i by rangeIndex into g
                          select new FilterResponseByPriceRange
                          {
                              PriceRange = $"{priceRanges[g.Key]} - {priceRanges[g.Key + 1] - 1}",
                              Cnt = g.Count(),
                              RangeStart = (int)priceRanges[g.Key],
                              RangeEnd = (int)priceRanges[g.Key + 1] - 1,
                          };
            return results.OrderBy(x => x.RangeStart).ToList();
        }

        public async Task<List<InventorySearchResponse>> GetRecentInventory()
        {
            var productOptionStr = await _dbContext.ProductOptions.ToListAsync();
            List<Inventory> inventories = await _dbContext.Inventories.Where(x => x.Active && x.Approved && x.CreatedAt >= DateTime.Now.AddDays(-30)).OrderByDescending(x => x.CreatedAt).ToListAsync();

            var results = from inventory in inventories
                          join product in _dbContext.Products on inventory.ProductId equals product.ProductId into ProductDetails
                          from productNew in ProductDetails.DefaultIfEmpty()
                          select new InventorySearchResponse
                          {
                              AskingPrice = inventory.AskingPrice,
                              InventoryId = inventory.InventoryId,
                              ProductId = inventory.ProductId,
                              ProductCompany = productNew?.Company ?? "",
                              ProductModel = productNew?.ProductName ?? "",
                              WaveLength = productNew?.WaveLength ?? "",
                              ProductOptionIds = productNew?.ProductOptions ?? "",
                              ProductImage = !string.IsNullOrEmpty(inventory.UserImage) ? inventory.UserImage : !string.IsNullOrEmpty(inventory.InventoryImage) ? inventory.InventoryImage : productNew?.ProductImage ?? "",
                              ProductType = productNew?.Type ?? "",

                              Description = inventory.Description ?? "",
                              BlueDot = inventory.BlueDot,
                              ProductYear = inventory.ProductYear,
                              SellerWarranty = inventory.Include30DayWarranty,
                              SKU = inventory.SKU ?? "",
                              BestOffer = inventory.BestOffer,
                              IsActive = inventory.Active,
                              CreatedAt = inventory.CreatedAt,
                          };

            var invResults = results.ToList();

            foreach (var item in invResults)
            {
                if (!string.IsNullOrEmpty(item.ProductOptionIds))
                {
                    item.ProductOptions = productOptionStr.Where(po => item.ProductOptionIds.Split(',').ToList().Contains(po.ProductOptionId.ToString())).OrderBy(x => x.Order).Select(x => x.Name).ToList();
                }
            }

            return invResults.OrderByDescending(x => x.CreatedAt).ToList();
        }

        public async Task<List<InventorySearchResponse>> GetPopularHotDealInventory()
        {
            var productOptionStr = await _dbContext.ProductOptions.ToListAsync();
            List<Inventory> inventories = await _dbContext.Inventories.Where(x => x.Active && x.Approved && x.HotDeal).OrderByDescending(x => x.CreatedAt).ToListAsync();

            var results = from inventory in inventories
                          join product in _dbContext.Products on inventory.ProductId equals product.ProductId into ProductDetails
                          from productNew in ProductDetails.DefaultIfEmpty()
                          select new InventorySearchResponse
                          {
                              AskingPrice = inventory.AskingPrice,
                              InventoryId = inventory.InventoryId,
                              ProductId = inventory.ProductId,
                              ProductCompany = productNew?.Company ?? "",
                              ProductModel = productNew?.ProductName ?? "",
                              WaveLength = productNew?.WaveLength ?? "",
                              ProductOptionIds = productNew?.ProductOptions ?? "",
                              ProductImage = !string.IsNullOrEmpty(inventory.UserImage) ? inventory.UserImage : !string.IsNullOrEmpty(inventory.InventoryImage) ? inventory.InventoryImage : productNew?.ProductImage ?? "",
                              ProductType = productNew?.Type ?? "",

                              Description = inventory.Description ?? "",
                              BlueDot = inventory.BlueDot,
                              ProductYear = inventory.ProductYear,
                              SellerWarranty = inventory.Include30DayWarranty,
                              SKU = inventory.SKU ?? "",
                              BestOffer = inventory.BestOffer,
                              IsActive = inventory.Active,
                              CreatedAt = inventory.CreatedAt,
                              Views = inventory.Views,
                          };

            var invResults = results.ToList();

            foreach (var item in invResults)
            {
                if (!string.IsNullOrEmpty(item.ProductOptionIds))
                {
                    item.ProductOptions = productOptionStr.Where(po => item.ProductOptionIds.Split(',').ToList().Contains(po.ProductOptionId.ToString())).OrderBy(x => x.Order).Select(x => x.Name).ToList();
                }
            }

            return invResults.ToList();
        }

        public async Task<List<InventorySearchResponse>> GetPopularInventory()
        {
            var productOptionStr = await _dbContext.ProductOptions.ToListAsync();
            List<Inventory> inventories = await _dbContext.Inventories.Where(x => x.Active && x.Approved).OrderByDescending(x => x.Views).Take(20).ToListAsync();

            var results = from inventory in inventories
                          join product in _dbContext.Products on inventory.ProductId equals product.ProductId into ProductDetails
                          from productNew in ProductDetails.DefaultIfEmpty()
                          select new InventorySearchResponse
                          {
                              AskingPrice = inventory.AskingPrice,
                              InventoryId = inventory.InventoryId,
                              ProductId = inventory.ProductId,
                              ProductCompany = productNew?.Company ?? "",
                              ProductModel = productNew?.ProductName ?? "",
                              WaveLength = productNew?.WaveLength ?? "",
                              ProductOptionIds = productNew?.ProductOptions ?? "",
                              ProductImage = !string.IsNullOrEmpty(inventory.UserImage) ? inventory.UserImage : !string.IsNullOrEmpty(inventory.InventoryImage) ? inventory.InventoryImage : productNew?.ProductImage ?? "",
                              ProductType = productNew?.Type ?? "",

                              Description = inventory.Description ?? "",
                              BlueDot = inventory.BlueDot,
                              ProductYear = inventory.ProductYear,
                              SellerWarranty = inventory.Include30DayWarranty,
                              SKU = inventory.SKU ?? "",
                              BestOffer = inventory.BestOffer,
                              IsActive = inventory.Active,
                              CreatedAt = inventory.CreatedAt,
                              Views = inventory.Views,
                          };

            var invResults = results.ToList();

            foreach (var item in invResults)
            {
                if (!string.IsNullOrEmpty(item.ProductOptionIds))
                {
                    item.ProductOptions = productOptionStr.Where(po => item.ProductOptionIds.Split(',').ToList().Contains(po.ProductOptionId.ToString())).OrderBy(x => x.Order).Select(x => x.Name).ToList();
                }
            }

            return invResults.ToList();
        }
        public async Task<List<InventorySearchResponse>> SearchInventory(InventorySearchRequest request)
        {
            var productOptionStr = await _dbContext.ProductOptions.ToListAsync();
            List<Inventory> inventories;
            if (request.RangeStart != null && request.RangeEnd != null)
            {
                inventories = await _dbContext.Inventories.Where(x => x.Active && x.Approved && x.AskingPrice >= (float)request.RangeStart && x.AskingPrice < (float)request.RangeEnd).ToListAsync();
            }
            else
            {
                inventories = await _dbContext.Inventories.Where(x => x.Active && x.Approved).ToListAsync();
            }
            if (request.BlueDot != null)
            {
                inventories = inventories.Where(x => x.BlueDot == request.BlueDot).ToList();
            }
            if (!string.IsNullOrEmpty(request.InventoryIds))
            {
                inventories = inventories.Where(x => request.InventoryIds.Split(",").Contains(x.InventoryId.ToString())).ToList();
            }

            var results = from inventory in inventories
                          join product in _dbContext.Products on inventory.ProductId equals product.ProductId into ProductDetails
                          from productNew in ProductDetails.DefaultIfEmpty()
                          select new InventorySearchResponse
                          {
                              AskingPrice = inventory.AskingPrice,
                              InventoryId = inventory.InventoryId,
                              ProductId = inventory.ProductId,
                              ProductCompany = productNew?.Company ?? "",
                              ProductModel = productNew?.ProductName ?? "",
                              WaveLength = productNew?.WaveLength ?? "",
                              ProductOptionIds = productNew?.ProductOptions ?? "",
                              ProductImage = !string.IsNullOrEmpty(inventory.UserImage) ? inventory.UserImage : !string.IsNullOrEmpty(inventory.InventoryImage) ? inventory.InventoryImage : productNew?.ProductImage ?? "",
                              ProductType = productNew?.Type ?? "",

                              Description = inventory.Description ?? "",
                              BlueDot = inventory.BlueDot,
                              ProductYear = inventory.ProductYear,
                              SellerWarranty = inventory.Include30DayWarranty,
                              SKU = inventory.SKU ?? "",
                              BestOffer = inventory.BestOffer,
                              IsActive = inventory.Active,
                              CreatedAt = inventory.CreatedAt,
                              Views = inventory.Views,
                          };
            var invResults = results.ToList();


            if (!string.IsNullOrEmpty(request.ProductName))
            {
                invResults = invResults.Where(x => x.ProductModel.ToLower() == request.ProductName.ToLower()).ToList();
            }
            if (!string.IsNullOrEmpty(request.CompanyName))
            {
                invResults = invResults.Where(x => x.ProductCompany.ToLower() == request.CompanyName.ToLower()).ToList();
            }
            if (!string.IsNullOrEmpty(request.ProductSearchKey))
            {
                invResults = invResults.Where(x => x.ProductModel.ToLower().Contains(request.ProductSearchKey.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(request.CompanySearchKey))
            {
                invResults = invResults.Where(x => x.ProductCompany.ToLower().Contains(request.CompanySearchKey.ToLower())).ToList();
            }
            if (!string.IsNullOrEmpty(request.ProductOption))
            {
                invResults = invResults.Where(o => o.ProductOptionIds.Split(',').Any(x => request.ProductOption.Split(',').Contains(x))).ToList();
            }
            foreach (var item in invResults)
            {
                if (!string.IsNullOrEmpty(item.ProductOptionIds))
                {
                    item.ProductOptions = productOptionStr.Where(po => item.ProductOptionIds.Split(',').ToList().Contains(po.ProductOptionId.ToString())).OrderBy(x => x.Order).Select(x => x.Name).ToList();
                }
            }

            return invResults.OrderBy(x => x.ProductModel).ToList();
        }

        public async Task<InventorySearchResponse?> SearchOneInventory(int inventoryId)
        {
            var productOptionStr = await _dbContext.ProductOptions.ToListAsync();
            List<Inventory> inventories = await _dbContext.Inventories.Where(x => x.InventoryId == inventoryId).ToListAsync();
            if (inventories.Count == 0)
            {
                return null;
            }
            var results = from inventory in inventories
                          join product in _dbContext.Products on inventory.ProductId equals product.ProductId into ProductDetails
                          from productNew in ProductDetails.DefaultIfEmpty()
                          select new InventorySearchResponse
                          {
                              AskingPrice = inventory.AskingPrice,
                              InventoryId = inventory.InventoryId,
                              ProductId = inventory.ProductId,
                              ProductCompany = productNew?.Company ?? "",
                              ProductModel = productNew?.ProductName ?? "",
                              WaveLength = productNew?.WaveLength ?? "",
                              ProductOptionIds = productNew?.ProductOptions ?? "",
                              ProductImage = !string.IsNullOrEmpty(inventory.UserImage) ? inventory.UserImage : !string.IsNullOrEmpty(inventory.InventoryImage) ? inventory.InventoryImage : productNew?.ProductImage ?? "",
                              ProductType = productNew?.Type ?? "",

                              Description = inventory.Description ?? "",
                              BlueDot = inventory.BlueDot,
                              ProductYear = inventory.ProductYear,
                              SellerWarranty = inventory.Include30DayWarranty,
                              SKU = inventory.SKU ?? "",
                              BestOffer = inventory.BestOffer,
                              IsActive = inventory.Active,
                              CreatedAt = inventory.CreatedAt,
                              Views = inventory.Views,
                          };
            var invResults = results.ToList();


            foreach (var item in invResults)
            {
                if (!string.IsNullOrEmpty(item.ProductOptionIds))
                {
                    item.ProductOptions = productOptionStr.Where(po => item.ProductOptionIds.Split(',').ToList().Contains(po.ProductOptionId.ToString())).OrderBy(x => x.Order).Select(x => x.Name).ToList();
                }
            }

            return invResults[0];
        }
    }
}
