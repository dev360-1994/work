using LaserTraderApi.Dtos;
using LaserTraderApi.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;
using SendGrid.Helpers.Mail.Model;
using System.Net;

namespace LaserTraderApi.Services
{
    public class EmailService : IEmailService
    {
        private readonly AppDbContext _dbContext;
        private readonly AppSettings _appSettings;
        private SendGridClient _client;
        const string _instagramPageUrl = "https://www.instagram.com/thelasertrader_bysentient";
        public EmailService(AppDbContext dbContext, IOptions<AppSettings> options)
        {
            _dbContext = dbContext;
            _appSettings = options.Value;
            _client = new SendGridClient(_appSettings.SendGridApiKey);
        }

        public async Task SendEmailForOffer(Contact contact, InventorySearchResponse prodInv, float offerPrice)
        {
            string countryName = "";
            if (contact.Country != null)
            {
                var country = await _dbContext.LookupCountries.Where(x => x.CountryId == contact.Country).FirstOrDefaultAsync();
                if (country != null)
                {
                    countryName = country.CountryName;
                }
            }

            string stateName = "";
            if (contact.State != null)
            {
                var state = await _dbContext.LookupStates.Where(x => x.StateId == contact.State).FirstOrDefaultAsync();
                if (state != null)
                {
                    stateName = state.StateName;
                }
            }

            Product product = _dbContext.Products.Where(x => x.ProductId == prodInv.ProductId).FirstOrDefault();
            string productOption = "";
            if (product?.ProductOptions != null)
            {
                var productOptions = await _dbContext.ProductOptions.ToListAsync();
                productOption = string.Join(", ", productOptions.Where(po => product.ProductOptions.Split(',').ToList().Contains(po.ProductOptionId.ToString())).OrderBy(x => x.Order).Select(x => x.Name).ToList());
            }

            string htmlContent = File.ReadAllText(@"EmailTemplates/Admin_MakeAnOffer.txt");
            htmlContent = htmlContent.Replace("[contactFirstName]", contact.FirstName);
            htmlContent = htmlContent.Replace("[contactLastName]", contact.LastName);
            htmlContent = htmlContent.Replace("[contactCompanyName]", contact.CompanyName);
            htmlContent = htmlContent.Replace("[contactAddress1]", contact.Address1);
            htmlContent = htmlContent.Replace("[contactAddress2]", contact.Address2);
            htmlContent = htmlContent.Replace("[contactCity]", contact.City);
            htmlContent = htmlContent.Replace("[stateName]", stateName);
            htmlContent = htmlContent.Replace("[contactZip]", contact.Zip);
            htmlContent = htmlContent.Replace("[countryName]", countryName);
            htmlContent = htmlContent.Replace("[contactEmail]", contact.Email);
            htmlContent = htmlContent.Replace("[contactPhone]", contact.Phone);
            htmlContent = htmlContent.Replace("[contactMobile]", contact.Mobile);

            htmlContent = htmlContent.Replace("[ProductName]", prodInv.ProductModel);
            htmlContent = htmlContent.Replace("[productCompany]", prodInv.ProductCompany);
            htmlContent = htmlContent.Replace("[productType]", prodInv.ProductType);
            htmlContent = htmlContent.Replace("[productWaveLength]", prodInv.WaveLength);
            htmlContent = htmlContent.Replace("[inventorySKU]", prodInv.SKU);
            htmlContent = htmlContent.Replace("[inventoryInclude30DayWarranty]", prodInv.SellerWarranty.ToString());
            htmlContent = htmlContent.Replace("[productOptions]", productOption);
            htmlContent = htmlContent.Replace("[offerPrice]", offerPrice.ToString());
            htmlContent = htmlContent.Replace("[contactComments]", contact.Comments);

            await SendEmail("New Contact - Buyer Offer", htmlContent, _appSettings.ToEmail, true);
        }

        public async Task SendEmailForSeller(Contact contact, Product product, Inventory inventory)
        {
            string countryName = "";
            if (contact.Country != null)
            {
                var country = await _dbContext.LookupCountries.Where(x => x.CountryId == contact.Country).FirstOrDefaultAsync();
                if (country != null)
                {
                    countryName = country.CountryName;
                }
            }

            string stateName = "";
            if (contact.State != null)
            {
                var state = await _dbContext.LookupStates.Where(x => x.StateId == contact.State).FirstOrDefaultAsync();
                if (state != null)
                {
                    stateName = state.StateName;
                }
            }

            string htmlContent = File.ReadAllText(@"EmailTemplates/Admin_SellYourDevice.txt");
            htmlContent = htmlContent.Replace("[contactFirstName]", contact.FirstName);
            htmlContent = htmlContent.Replace("[contactLastName]", contact.LastName);
            htmlContent = htmlContent.Replace("[contactCompanyName]", contact.CompanyName);
            htmlContent = htmlContent.Replace("[contactAddress1]", contact.Address1);
            htmlContent = htmlContent.Replace("[contactAddress2]", contact.Address2);
            htmlContent = htmlContent.Replace("[contactCity]", contact.City);
            htmlContent = htmlContent.Replace("[stateName]", stateName);
            htmlContent = htmlContent.Replace("[contactZip]", contact.Zip);
            htmlContent = htmlContent.Replace("[countryName]", countryName);
            htmlContent = htmlContent.Replace("[contactEmail]", contact.Email);
            htmlContent = htmlContent.Replace("[contactPhone]", contact.Phone);
            htmlContent = htmlContent.Replace("[contactMobile]", contact.Mobile);

            htmlContent = htmlContent.Replace("[ProductName]", product.ProductName);
            htmlContent = htmlContent.Replace("[productCompany]", product.Company);
            htmlContent = htmlContent.Replace("[productType]", product.Type);
            htmlContent = htmlContent.Replace("[productWaveLength]", product.WaveLength);
            htmlContent = htmlContent.Replace("[inventoryInclude30DayWarranty]", inventory.Include30DayWarranty.ToString());

            htmlContent = htmlContent.Replace("[inventoryAskingPrice]", inventory.AskingPrice.ToString());
            htmlContent = htmlContent.Replace("[inventoryProductYear]", inventory.ProductYear.ToString());
            htmlContent = htmlContent.Replace("[inventoryBestOffer]", inventory.BestOffer.ToString());
            htmlContent = htmlContent.Replace("[inventorySerialNumber]", inventory.SerialNumber);
            htmlContent = htmlContent.Replace("[inventoryReasonForSelling]", inventory.ReasonForSelling);
            htmlContent = htmlContent.Replace("[inventoryDescription]", inventory.Description);

            await SendEmail("New Contact - Seller", htmlContent, _appSettings.ToEmail, true);
        }

        public async Task SendEmailWatchList(int productId, int inventoryId, string productName)
        {
            List<int> watchListIds = await _dbContext.WatchListProducts.Where(x => x.ProductId == productId).Select(x => x.WatchListId).ToListAsync();
            List<int> watchContactIds = await _dbContext.WatchLists.Where(x => watchListIds.Contains(x.WatchListId) && x.Active == true).Select(x => x.ContactId).ToListAsync();
            List<Contact> watchContacts = await _dbContext.Contacts.Where(x => watchContactIds.Contains(x.ContactId) && x.Type == "watchlist" && x.Active).ToListAsync();

            foreach (var contact  in watchContacts)
            {
                string htmlContent = File.ReadAllText(@"EmailTemplates/Watchlist_Item_Posted.txt");
                htmlContent = htmlContent.Replace("[contactFirstName]", contact.FirstName);
                htmlContent = htmlContent.Replace("[contactLastName]", contact.LastName);
                htmlContent = htmlContent.Replace("{WEB_URL}", _appSettings.WebUrl);
                htmlContent = htmlContent.Replace("[productName]", productName);
                htmlContent = htmlContent.Replace("[InventoryId]", inventoryId.ToString());
                htmlContent = htmlContent.Replace("[productId]", productId.ToString());
                htmlContent = htmlContent.Replace("[ContactId]", contact.ContactId.ToString());
                
                await SendEmail("Your watched item has just posted on TheLaserTrader.com!!!!", htmlContent, contact.Email, true);
            }
        }

        private async Task SendEmail(string subject, string body, string toEmail, bool isHTMLContent = false)
        {
            var msg = new SendGridMessage()
            {
                From = new EmailAddress(_appSettings.SenderEmail),
                Subject = subject,
            };
            if (isHTMLContent)
                msg.HtmlContent = body;
            else
                msg.PlainTextContent = body;

            msg.AddTo(new EmailAddress(toEmail));
            // debug purpose
            //msg.AddCc("dce1@sentientlasers.com");
            var response = await _client.SendEmailAsync(msg);
            if (response.IsSuccessStatusCode)
            {
                Console.WriteLine("Success");
            } else
            {
                Console.WriteLine("failed");
            }
        }

        #region SendGeneralContactUsEmail
        public async Task SendGeneralContactUsEmail(string toEmail, string userName)
        {
            string htmlContent = File.ReadAllText(@"EmailTemplates/GeneralContactUs.txt");
            htmlContent = htmlContent.Replace("[Recipient's Name]", userName);
            htmlContent = htmlContent.Replace("{WEB_URL}", _appSettings.WebUrl);
            htmlContent = htmlContent.Replace("{InstagramPage_URL}", _instagramPageUrl);
            
            await SendEmail("AWESOME 😎 We Will Be in Touch Soon!", htmlContent, toEmail, true);
        }
        #endregion

        #region SendMakeAnOfferEmail
        public async Task SendMakeAnOfferSubmissionEmail(string toEmail, string userName, string deviceName)
        {
            string htmlContent = File.ReadAllText(@"EmailTemplates/MakeAnOffer.txt");
            htmlContent = htmlContent.Replace("[Recipient's Name]", userName);
            htmlContent = htmlContent.Replace("[DEVICE NAME]", deviceName);
            htmlContent = htmlContent.Replace("{WEB_URL}", _appSettings.WebUrl);

            await SendEmail("Your Offer have been submitted", htmlContent, toEmail, true);
        }
        #endregion

        #region SendAskTheSellerSubmissionEmail
        public async Task SendAskTheSellerSubmissionEmail(string toEmail, string userName, string deviceDetails)
        {
            string htmlContent = File.ReadAllText(@"EmailTemplates/AskTheSellerQuestion.txt");
            htmlContent = htmlContent.Replace("[Recipient's Name]", userName);
            htmlContent = htmlContent.Replace("[Device Details]", deviceDetails);
            htmlContent = htmlContent.Replace("{WEB_URL}", _appSettings.WebUrl);

            await SendEmail("Your Question have been submitted", htmlContent, toEmail, true);
        }
        #endregion

        #region SendSellYourDeviceSubmissionEmail
        public async Task SendSellYourDeviceSubmissionEmail(string toEmail, string userName)
        {
            string htmlContent = File.ReadAllText(@"EmailTemplates/SellYourDevice.txt");
            htmlContent = htmlContent.Replace("[Recipient's Name]", userName);
            htmlContent = htmlContent.Replace("{WEB_URL}", _appSettings.WebUrl);

            await SendEmail("Thank you for posting your Device", htmlContent, toEmail, true);
        }
        #endregion

        #region SendSellisLiveEmail
        public async Task SendSellisLiveEmail(string toEmail, string userName, int inventoryId)
        {
            string htmlContent = File.ReadAllText(@"EmailTemplates/SellisLive.txt");
            htmlContent = htmlContent.Replace("[Recipient's Name]", userName);
            htmlContent = htmlContent.Replace("{WEB_URL}", _appSettings.WebUrl);
            htmlContent = htmlContent.Replace("[InventoryId]", inventoryId.ToString());

            await SendEmail("Your Device is LIVE!", htmlContent, toEmail, true);
        }
        #endregion

        #region SendRepairInquirySubmissionEmail
        public async Task SendRepairInquirySubmissionEmail(string toEmail, string userName)
        {
            string htmlContent = File.ReadAllText(@"EmailTemplates/RepairInquiry.txt");
            htmlContent = htmlContent.Replace("[Recipient's Name]", userName);
            htmlContent = htmlContent.Replace("{WEB_URL}", _appSettings.WebUrl);

            await SendEmail("Your Service Inquiry have been submitted", htmlContent, toEmail, true);
        }
        #endregion

        #region SendWatchlistSubmissionEmail
        public async Task SendWatchlistSubmissionEmail(string toEmail, string userName, int productId, int contactId)
        {
            string productName = _dbContext.Products.Where(x => x.ProductId == productId).Select(x => x.ProductName).FirstOrDefault();
            string htmlContent = File.ReadAllText(@"EmailTemplates/Watchlist.txt");
            htmlContent = htmlContent.Replace("[Recipient's Name]", userName);
            htmlContent = htmlContent.Replace("{WEB_URL}", _appSettings.WebUrl);
            htmlContent = htmlContent.Replace("[ProductName]", productName);
            htmlContent = htmlContent.Replace("{InstagramPage_URL}", _instagramPageUrl);
            htmlContent = htmlContent.Replace("{productId}", productId.ToString());
            htmlContent = htmlContent.Replace("{ContactId}", contactId.ToString());

            await SendEmail("Your Watch List have been submitted", htmlContent, toEmail, true);
        }
        #endregion

        #region Admin Emails

        #region SendAskTheSellerAdminEmail
        public async Task SendAskTheSellerAdminEmail(Contact contact, int? inventoryId)
        {
            Inventory inventory = _dbContext.Inventories.Where(x => x.InventoryId == inventoryId).FirstOrDefault();
            if (inventory != null)
            {
                Product product = _dbContext.Products.Where(x => x.ProductId == inventory.ProductId).FirstOrDefault();
                string countryName = "";
                if (contact.Country != null)
                {
                    var country = await _dbContext.LookupCountries.Where(x => x.CountryId == contact.Country).FirstOrDefaultAsync();
                    if (country != null)
                        countryName = country.CountryName;
                }

                string stateName = "";
                if (contact.State != null)
                {
                    var state = await _dbContext.LookupStates.Where(x => x.StateId == contact.State).FirstOrDefaultAsync();
                    if (state != null)
                        stateName = state.StateName;
                }

                string productOption = "";
                if (product?.ProductOptions != null)
                {
                    var productOptions = await _dbContext.ProductOptions.ToListAsync();
                    productOption = string.Join(", ", productOptions.Where(po => product.ProductOptions.Split(',').ToList().Contains(po.ProductOptionId.ToString())).OrderBy(x => x.Order).Select(x => x.Name).ToList());
                }

                string htmlContent = File.ReadAllText(@"EmailTemplates/Admin_AskTheSellerQuestion.txt");
                htmlContent = htmlContent.Replace("[contactFirstName]", contact.FirstName);
                htmlContent = htmlContent.Replace("[contactLastName]", contact.LastName);
                htmlContent = htmlContent.Replace("[contactCompanyName]", contact.CompanyName);
                htmlContent = htmlContent.Replace("[contactAddress1]", contact.Address1);
                htmlContent = htmlContent.Replace("[contactAddress2]", contact.Address2);
                htmlContent = htmlContent.Replace("[contactCity]", contact.City);
                htmlContent = htmlContent.Replace("[stateName]", stateName);
                htmlContent = htmlContent.Replace("[contactZip]", contact.Zip);
                htmlContent = htmlContent.Replace("[countryName]", countryName);
                htmlContent = htmlContent.Replace("[contactEmail]", contact.Email);
                htmlContent = htmlContent.Replace("[contactPhone]", contact.Phone);
                htmlContent = htmlContent.Replace("[contactMobile]", contact.Mobile);

                htmlContent = htmlContent.Replace("[ProductName]", product.ProductName);
                htmlContent = htmlContent.Replace("[productCompany]", product.Company);
                htmlContent = htmlContent.Replace("[productType]", product.Type);
                htmlContent = htmlContent.Replace("[productWaveLength]", product.WaveLength);
                htmlContent = htmlContent.Replace("[inventorySKU]", inventory.SKU);
                htmlContent = htmlContent.Replace("[inventoryInclude30DayWarranty]", inventory.Include30DayWarranty.ToString());
                htmlContent = htmlContent.Replace("[productOptions]", productOption);
                htmlContent = htmlContent.Replace("[comments]", contact.Comments);

                await SendEmail("New Contact - Question for Seller", htmlContent, _appSettings.ToEmail, true);
            }
        }
        #endregion

        #region SendRepairInquiryAdminEmail
        public async Task SendRepairInquiryAdminEmail(ContactRequest contactRequest, int? productId)
        {
            Product product = _dbContext.Products.Where(x => x.ProductId == productId).FirstOrDefault();
            string countryName = "";
            if (contactRequest.Country != null)
            {
                var country = await _dbContext.LookupCountries.Where(x => x.CountryId == contactRequest.Country).FirstOrDefaultAsync();
                if (country != null)
                    countryName = country.CountryName;
            }

            string stateName = "";
            if (contactRequest.State != null)
            {
                var state = await _dbContext.LookupStates.Where(x => x.StateId == contactRequest.State).FirstOrDefaultAsync();
                if (state != null)
                    stateName = state.StateName;
            }
            string address = contactRequest.Address1 + ','+ contactRequest.Address2 + ',' + contactRequest.City + ',' + stateName + ',' + countryName;
            address = RemoveExtraCommasInString(address);

            string htmlContent = File.ReadAllText(@"EmailTemplates/Admin_RepairInquiry.txt");
            htmlContent = htmlContent.Replace("[FullName]", (contactRequest.FirstName + " " + contactRequest.LastName));
            htmlContent = htmlContent.Replace("[Company]", contactRequest.CompanyName);
            htmlContent = htmlContent.Replace("[Address]", address);
            htmlContent = htmlContent.Replace("[Phone]", contactRequest.Phone);
            htmlContent = htmlContent.Replace("[Email]", contactRequest.Email);
            if(product != null)
            {
                htmlContent = htmlContent.Replace("[Make]", product.Company);
                htmlContent = htmlContent.Replace("[Model]", product.ProductName + " - " + product.Type);
                htmlContent = htmlContent.Replace("[Year]", contactRequest.YearOfManufacture?.ToString());
            }
            else
            {
                htmlContent = htmlContent.Replace("[Make]", string.Empty);
                htmlContent = htmlContent.Replace("[Model]", string.Empty);
                htmlContent = htmlContent.Replace("[Year]", string.Empty);
            }

            await SendEmail("New Service/Repair - Request Received", htmlContent, _appSettings.ToEmail, true);
        }
        #endregion

        #region SendWatchListAdminEmail
        public async Task SendWatchListAdminEmail(Contact contact, int? productId)
        {
            Product product = _dbContext.Products.Where(x => x.ProductId == productId).FirstOrDefault();
            string countryName = "";
            if (contact.Country != null)
            {
                var country = await _dbContext.LookupCountries.Where(x => x.CountryId == contact.Country).FirstOrDefaultAsync();
                if (country != null)
                    countryName = country.CountryName;
            }

            string stateName = "";
            if (contact.State != null)
            {
                var state = await _dbContext.LookupStates.Where(x => x.StateId == contact.State).FirstOrDefaultAsync();
                if (state != null)
                    stateName = state.StateName;
            }

            string htmlContent = File.ReadAllText(@"EmailTemplates/Admin_WatchList.txt");
            htmlContent = htmlContent.Replace("[contactFirstName]", contact.FirstName);
            htmlContent = htmlContent.Replace("[contactLastName]", contact.LastName);
            htmlContent = htmlContent.Replace("[contactCompanyName]", contact.CompanyName);
            htmlContent = htmlContent.Replace("[contactAddress1]", contact.Address1);
            htmlContent = htmlContent.Replace("[contactAddress2]", contact.Address2);
            htmlContent = htmlContent.Replace("[contactCity]", contact.City);
            htmlContent = htmlContent.Replace("[stateName]", stateName);
            htmlContent = htmlContent.Replace("[contactZip]", contact.Zip);
            htmlContent = htmlContent.Replace("[countryName]", countryName);
            htmlContent = htmlContent.Replace("[contactEmail]", contact.Email);
            htmlContent = htmlContent.Replace("[contactPhone]", contact.Phone);
            htmlContent = htmlContent.Replace("[contactMobile]", contact.Mobile);
            htmlContent = htmlContent.Replace("[ProductName]", product.ProductName);
            htmlContent = htmlContent.Replace("[comments]", contact.Comments);

            await SendEmail("New Contact - New Watch List", htmlContent, _appSettings.ToEmail, true);
        }
        #endregion

        #endregion

        public string RemoveExtraCommasInString(string input)
        {
            string[] items = input.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
            if (items != null)
                return string.Join(",", items);
            else
                return string.Empty;
        }
    }
}
