using Azure.Core;
using LaserTraderApi.Dtos;
using LaserTraderApi.Models;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;

namespace LaserTraderApi.Services.ContactService
{
    public class ContactService : IContactService
    {
        private readonly AppDbContext _dbContext;
        public ContactService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        public async Task<List<ContactResponse>> GetRecentContacts(ContactRecentRequest request)
        {
            List<Contact> contacts;
            if (string.IsNullOrEmpty(request.Type))
            {
                if (request.StartDate == null && request.EndDate == null)
                {
                    contacts = await _dbContext.Contacts.Where(x => x.Active && x.UpdatedAt.Date > DateTime.Now.AddDays(-90)).OrderByDescending(x => x.UpdatedAt).ToListAsync();
                }
                else
                {
                    contacts = await _dbContext.Contacts.Where(x => x.Active && x.UpdatedAt.Date >= request.StartDate && x.UpdatedAt.Date <= request.EndDate).OrderByDescending(x => x.UpdatedAt).ToListAsync();
                }
            }
            else
            {
                if (request.StartDate == null && request.EndDate == null)
                {
                    contacts = await _dbContext.Contacts.Where(x => x.Active && x.Type == request.Type && x.UpdatedAt.Date > DateTime.Now.AddDays(-90)).OrderByDescending(x => x.UpdatedAt).ToListAsync();
                }
                else
                {
                    contacts = await _dbContext.Contacts.Where(x => x.Active && x.Type == request.Type && x.UpdatedAt.Date >= request.StartDate && x.UpdatedAt.Date <= request.EndDate).OrderByDescending(x => x.UpdatedAt).ToListAsync();
                }
            }

            var results = from contact in contacts
                          join inventory in _dbContext.Inventories on contact.ContactId equals inventory.InsertedBy into InventoryDetails

                          join state in _dbContext.LookupStates on contact.State equals state.StateId into StateDetails
                          join country in _dbContext.LookupCountries on contact.Country equals country.CountryId into CountryDetails
                          from inv in InventoryDetails.DefaultIfEmpty()
                          join product in _dbContext.Products on inv?.ProductId equals product.ProductId into ProductDetails
                          from stateNew in StateDetails.DefaultIfEmpty()
                          from countryNew in CountryDetails.DefaultIfEmpty()
                          from productNew in ProductDetails.DefaultIfEmpty()
                          select new ContactResponse
                          {
                              ContactId = contact.ContactId,
                              Address = $"{contact.City} {stateNew?.StateCode}",
                              CompanyName = contact.CompanyName ?? "",
                              ContactType = contact.Type ?? "",
                              CreatedAt = contact.CreatedAt,
                              UpdatedAt = contact.UpdatedAt,
                              Email = contact.Email,
                              FirstName = contact.FirstName,
                              LastName = contact.LastName,
                              Phone = contact.Phone ?? "",
                              SKU = inv?.SKU ?? "",
                              ProductName = productNew?.ProductName ?? "",
                              City = contact.City ?? "",
                              Mobile = contact.Mobile ?? "",
                          };
            return results.ToList();
        }

        public async Task<List<ContactResponse>> GetAllContacts(string type)
        {
            var contacts = string.IsNullOrEmpty(type) ? await _dbContext.Contacts.Where(x => x.Active).ToListAsync() : type == "inactive" ? await _dbContext.Contacts.Where(x => x.Active == false).ToListAsync() : await _dbContext.Contacts.Where(x => x.Active && x.Type == type).ToListAsync();

            var results = from contact in contacts
                          join inventory in _dbContext.Inventories on contact.ContactId equals inventory.InsertedBy into InventoryDetails

                          join state in _dbContext.LookupStates on contact.State equals state.StateId into StateDetails
                          join country in _dbContext.LookupCountries on contact.Country equals country.CountryId into CountryDetails
                          from inv in InventoryDetails.DefaultIfEmpty()
                          join product in _dbContext.Products on inv?.ProductId equals product.ProductId into ProductDetails
                          from stateNew in StateDetails.DefaultIfEmpty()
                          from countryNew in CountryDetails.DefaultIfEmpty()
                          from productNew in ProductDetails.DefaultIfEmpty()
                          select new ContactResponse
                          {
                              ContactId = contact.ContactId,
                              Address = $"{contact.City} {stateNew?.StateCode}",
                              CompanyName = contact.CompanyName ?? "",
                              ContactType = contact.Type ?? "",
                              CreatedAt = contact.CreatedAt,
                              UpdatedAt = contact.UpdatedAt,
                              Email = contact.Email,
                              FirstName = contact.FirstName,
                              LastName = contact.LastName,
                              Phone = contact.Phone ?? "",
                              SKU = inv?.SKU ?? "",
                              ProductName = productNew?.ProductName ?? "",
                              City = contact.City ?? "",
                              Mobile = contact.Mobile ?? "",
                          };
            return results.OrderBy(x => x.LastName).ThenBy(x => x.FirstName).ToList();
        }
        public async Task<Contact> CreateContact(ContactRequest contactRequest, int? productId = null)
        {
            string productFile = null;
            if (contactRequest.ProductFile != null)
            {
                await UploadMaintenanceProductFile(contactRequest.ProductFile);
                productFile = contactRequest.ProductFile.FileName;
            }

            Contact contact = new()
            {
                Active = contactRequest.Active,
                Type = contactRequest.Type,
                Address1 = contactRequest.Address1,
                Address2 = contactRequest.Address2,
                City = contactRequest.City,
                State = contactRequest.State,
                Comments = contactRequest.Comments,
                CompanyName = contactRequest.CompanyName,
                Country = contactRequest.Country,
                Email = contactRequest.Email,
                Mobile = contactRequest.Mobile,
                FirstName = contactRequest.FirstName,
                LastName = contactRequest.LastName,
                ItlPrefix = contactRequest.ItlPrefix,
                Phone = contactRequest.Phone,
                Zip = contactRequest.Zip,
                PreferredContactType = contactRequest.PreferredContactType,
                Fax = contactRequest.Fax,
                Finance = contactRequest.Finance,
                MethodOfContact = contactRequest.MethodOfContact,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
                YearOfManufacture = contactRequest.YearOfManufacture,
                ErrorCode = contactRequest.ErrorCode,
                LastServiceDesc = contactRequest.LastServiceDesc,
                LastServiceDate = !string.IsNullOrEmpty(contactRequest.LastServiceDate)
    ? DateTime.Parse(contactRequest.LastServiceDate, null, System.Globalization.DateTimeStyles.RoundtripKind) : null,
                WhoLastService = contactRequest.WhoLastService,
                ProductFile = productFile,
                PersonTraining = contactRequest.PersonTraining,
                VirtualTraining = contactRequest.VirtualTraining,
                ProductId = productId
            };

            _dbContext.Contacts.Add(contact);
            await _dbContext.SaveChangesAsync();
            return contact;
        }
        public async Task<Contact?> UpdateContact(int contactId, ContactsRequest request)
        {
            var contact = await _dbContext.Contacts.FindAsync(contactId);
            if (contact != null)
            {
                var contactRequest = request.Contact;
                string productFile = null;
                if (contactRequest.ProductFile != null && contactRequest.Type == "maintenance")
                {
                    await UploadMaintenanceProductFile(contactRequest.ProductFile);
                    productFile = contactRequest.ProductFile.FileName;
                }
                contact.Active = contactRequest.Active;
                contact.Type = contactRequest.Type;
                contact.Address1 = contactRequest.Address1;
                contact.Address2 = contactRequest.Address2;
                contact.City = contactRequest.City;
                contact.State = contactRequest.State;
                contact.Comments = contactRequest.Comments;
                contact.CompanyName = contactRequest.CompanyName;
                contact.Country = contactRequest.Country;
                contact.Email = contactRequest.Email;
                contact.Mobile = contactRequest.Mobile;
                contact.FirstName = contactRequest.FirstName;
                contact.LastName = contactRequest.LastName;
                contact.ItlPrefix = contactRequest.ItlPrefix;
                contact.Phone = contactRequest.Phone;
                contact.Zip = contactRequest.Zip;
                contact.PreferredContactType = contactRequest.PreferredContactType;
                contact.Fax = contactRequest.Fax;
                contact.Finance = contactRequest.Finance;
                contact.MethodOfContact = contactRequest.MethodOfContact;
                contact.UpdatedAt = DateTime.Now;
                contact.YearOfManufacture = contactRequest.YearOfManufacture;
                contact.ErrorCode = contactRequest.ErrorCode;
                contact.LastServiceDesc = contactRequest.LastServiceDesc;
                contact.LastServiceDate = !string.IsNullOrEmpty(contactRequest.LastServiceDate)
                                   ? DateTime.Parse(contactRequest.LastServiceDate, null, System.Globalization.DateTimeStyles.RoundtripKind) : null;
                contact.WhoLastService = contactRequest.WhoLastService;
                if (contactRequest.ProductFile != null)
                    contact.ProductFile = productFile;
                contact.PersonTraining = contactRequest.PersonTraining;
                contact.VirtualTraining = contactRequest.VirtualTraining;
                contact.ProductId = request.ProductId;

                if (!contactRequest.Active)
                {
                    var inventories = await _dbContext.Inventories.Where(x => x.InsertedBy == contactId).ToListAsync();
                    foreach (var inv in inventories)
                    {
                        inv.Active = false;
                    }
                }
                await _dbContext.SaveChangesAsync();
                return contact;
            }
            else
            {
                return null;
            }
        }

        public async Task<ContactExtDto?> GetContact(int contactId)
        {
            var contact = await _dbContext.Contacts.FindAsync(contactId);
            if (contact != null)
            {
                if (contact.Type == "watchlist")
                {
                    var watchList = await _dbContext.WatchLists.Where(x => x.ContactId == contactId).Include(x => x.WatchListProducts).ThenInclude(y => y.Product).Include(x => x.WatchListProductOptions).ThenInclude(y => y.ProductOption).ToListAsync();
                    return new ContactExtDto
                    {
                        Contact = contact,
                        WatchList = watchList
                    };
                }
                else
                {
                    ContactOffer? offerData = null;
                    if (contact.Type == "buyer offer")
                    {
                        var offer = await _dbContext.Offers.Where(x => x.ContactId == contactId).FirstOrDefaultAsync();
                        offerData = new ContactOffer
                        {
                            OfferId = offer.OfferId,
                            ContactId = offer.ContactId,
                            OfferPrice = offer.OfferPrice,
                            InventoryId = offer.InventoryId,
                            Active = offer.Active,
                            CreatedAt = offer.CreatedAt,
                            UpdatedAt = offer.UpdatedAt,
                        };
                    }

                    var inv = await _dbContext.Inventories.Where(x => x.InsertedBy == contact.ContactId).FirstOrDefaultAsync();
                    if (inv != null)
                    {
                        var prod = await _dbContext.Products.Where(x => x.ProductId == inv.ProductId).FirstOrDefaultAsync();
                        return new ContactExtDto
                        {
                            Contact = contact,
                            InvProduct = new InvProdDto
                            {
                                CompanyName = prod?.Company ?? "",
                                InventoryId = inv.InventoryId,
                                IsActive = inv.Active,
                                IsWarranty = inv.Include30DayWarranty,
                                ProductId = prod?.ProductId ?? -1,
                                ProductModel = prod?.ProductName ?? ""
                            },
                            Offer = offerData
                        };
                    }
                    else
                    {
                        InvProdDto? ProductData = null;
                        if (contact.ProductId != null && contact.ProductId > 0)
                        {
                            var product = await _dbContext.Products.Where(x => x.ProductId == contact.ProductId).FirstOrDefaultAsync();
                            if (product != null)
                            {
                                ProductData = new InvProdDto
                                {
                                    CompanyName = product?.Company ?? "",
                                    IsActive = product.Active,
                                    ProductId = product?.ProductId ?? -1,
                                    ProductModel = product?.ProductName ?? "",
                                    InventoryId = 0,
                                    IsWarranty = false // to get product info, assigning Inv values to default values.
                                };
                            }
                        }
                        return new ContactExtDto
                        {
                            Contact = contact,
                            InvProduct = ProductData,
                            Offer = offerData
                        };
                    }
                }
            }
            else
            {
                return null;
            }
        }

        public async Task<bool> DeleteContact(int contactId)
        {
            var contact = await _dbContext.Contacts.FindAsync(contactId);
            if (contact != null)
            {
                _dbContext.Offers.RemoveRange(_dbContext.Offers.Where(x => x.ContactId != null && x.ContactId == contactId));
                _dbContext.Inventories.RemoveRange(_dbContext.Inventories.Where(x => x.InsertedBy == contactId));
                _dbContext.Contacts.Remove(contact);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            else
            {
                return false;
            }
        }

        public async Task<bool> SetInactive(int contactId)
        {
            var contact = await _dbContext.Contacts.FindAsync(contactId);
            if (contact != null)
            {
                contact.Active = false;
                var inventories = await _dbContext.Inventories.Where(x => x.InsertedBy == contactId).ToListAsync();
                foreach (var inv in inventories)
                {
                    inv.Active = false;
                }
                await _dbContext.SaveChangesAsync();
                return true;
            }
            return false;
        }

        private async Task UploadMaintenanceProductFile(IFormFile file)
        {
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "maintenance", file.FileName);
            Directory.CreateDirectory(Path.GetDirectoryName(filePath));
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
        }
    }
}
