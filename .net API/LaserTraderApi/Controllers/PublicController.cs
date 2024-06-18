using LaserTraderApi.Dtos;
using LaserTraderApi.Models;
using LaserTraderApi.Services;
using LaserTraderApi.Services.ContactService;
using Microsoft.AspNetCore.Mvc;

namespace LaserTraderApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PublicController : ControllerBase
    {
        private readonly IContactService _contactService;
        private readonly IProductService _productService;
        private readonly IInventoryService _inventoryService;
        private readonly IOfferService _offerService;
        private readonly IEmailService _emailService;
        private readonly IWarrantyService _warrantyService;
        public PublicController(IInventoryService inventoryService, IContactService contactService, IProductService productService, IOfferService offerService, IEmailService emailService, IWarrantyService warrantyService)
        {
            _inventoryService = inventoryService;
            _contactService = contactService;
            _productService = productService;
            _offerService = offerService;
            _emailService = emailService;
            _warrantyService = warrantyService;
        }

        [HttpPost]
        [Route("sell")]
        public async Task<ActionResult<Inventory>> CreateSell([FromForm] CreateSellRequest request)
        {
            var contact = await _contactService.CreateContact(request.Contact);
            var invRequest = new InventoryRequest
            {
                Active = true,
                Approved = true,
                ApprovedBy = 1,
                AskingPrice = request.ProductInventory.AskingPrice,
                SerialNumber = request.ProductInventory.SerialNumber,
                BestOffer = request.ProductInventory.BestOffer,
                BlueDot = request.ProductInventory.BlueDot,
                Description = request.ProductInventory.Description,
                HotDeal = request.ProductInventory.HotDeal,
                Include30DayWarranty = request.ProductInventory.Include30DayWarranty,
                InsertedBy = contact.ContactId,
                InventoryImageFile = request.ProductInventory.UserImageFile,
                ProductYear = request.ProductInventory.ProductYear,
                ReasonForSelling = request.ProductInventory.ReasonForSelling,
                Sold = false,
                UserImageFile = request.ProductInventory.UserImageFile,
                VideoLink = request.ProductInventory.VideoLink,
                Views = 0,
                UserImageApproved = false,
                VideoApproved = false,

                GeneralCondition = request.ProductInventory.GeneralCondition,
                Accessories = request.ProductInventory.Accessories,
                HourCount = request.ProductInventory.HourCount,
                LastServiced = request.ProductInventory.LastServiced,
                OperatorManuals = request.ProductInventory.OperatorManuals,
                Handpieces = request.ProductInventory.Handpieces,
                OriginalBoxes = request.ProductInventory.OriginalBoxes

            };
            var productExist = request.ProductInventory.ProductId == 0 ? null : await _productService.GetProduct(request.ProductInventory.ProductId);
            
            if (request.ProductInventory.ProductId == 0 || productExist == null)
            {
                // create new product
                var productRequest = new ProductRequest
                {
                    Active = true,
                    Approved = true,
                    AskingPrice = request.ProductInventory.AskingPrice,
                    Company = request.ProductInventory.Company,
                    Description = request.ProductInventory.Description,
                    EnergyOutput = request.ProductInventory.EnergyOutput,
                    ProductImageFile = request.ProductInventory.UserImageFile,
                    ProductName = request.ProductInventory.ProductName,
                    ProductOptions = request.ProductInventory.ProductOptions,
                    PulseLength = request.ProductInventory.PulseLength,
                    Type = request.ProductInventory.Type,
                    VideoLink = request.ProductInventory.VideoLink,
                    WaveLength = request.ProductInventory.WaveLength,
                    InsertBy = contact.ContactId,
                };
                productExist = await _productService.CreateProduct(productRequest);
                invRequest.ProductId = productExist.ProductId;
            }
            else
            {
                invRequest.ProductId = request.ProductInventory.ProductId;

            }
            // create new Inventory
            invRequest.Approved = false;
            var inv = await _inventoryService.CreateInventory(invRequest);
            if (inv != null)
            {
                // send emails to watch list with ProductId and InventoryId
                string productName = $"{productExist.ProductName} - {productExist.Company}";
                await _emailService.SendEmailWatchList(inv.ProductId, inv.InventoryId, productName);

                // send email to site owner (admin email) for new contact information, product information, Inventory Information
                await _emailService.SendEmailForSeller(contact, productExist, inv);

                await _emailService.SendSellYourDeviceSubmissionEmail(request.Contact.Email, request.Contact.FirstName + " " + request.Contact.LastName);
            }

            return inv == null ? NotFound() : Ok(inv);
        }

        [HttpPost]
        [Route("contact-us")]
        public async Task<ActionResult> ContactUs(ContactUsRequest request)
        {
            var contactRequest = request.Contact;
            string deviceName = string.Empty;
            if (request.InventoryId != null && contactRequest.Type != "watchlist")
            {
                var inv = await _inventoryService.SearchOneInventory(request.InventoryId ?? 0);
                if (inv != null)
                {
                    deviceName = $"{inv.ProductModel} - {inv.ProductCompany}";
                    if (string.IsNullOrEmpty(contactRequest.Comments))
                        contactRequest.Comments = $"Inquiry about {inv.ProductModel} - {inv.ProductCompany} - SKU {inv.SKU} ";
                }
            }
            var contact = await _contactService.CreateContact(request.Contact, request.ProductId);

            if (request.OfferPrice != null && request.InventoryId != null)
            {
                // add Offer
                var offer = new Offer
                {
                    ContactId = contact.ContactId,
                    OfferPrice = request.OfferPrice ?? 0,
                    InventoryId = request.InventoryId
                };

                await _offerService.CreateOffer(offer);

                // Send Email to site owner (admin email) with contact information and product information, offer price
                var inv = await _inventoryService.SearchOneInventory(request.InventoryId ?? 0);
                if (inv != null)
                {
                    if(string.IsNullOrEmpty(deviceName))
                        deviceName = $"{inv.ProductModel} - {inv.ProductCompany}";
                    await _emailService.SendMakeAnOfferSubmissionEmail(contactRequest.Email, contactRequest.FirstName + " " + contactRequest.LastName, deviceName);
                    await _emailService.SendEmailForOffer(contact, inv, offer.OfferPrice);
                }
            }
            if (request.ProductId != null && contactRequest.Type == "watchlist")
            {
                var watchList = await _offerService.CreateWatchList(new WatchList
                {
                    ContactId = contact.ContactId,
                    ProductId = request.ProductId ?? 0,
                });
                await _offerService.CreateWatchListProduct(new WatchListProduct
                {
                    ProductId = request.ProductId ?? 0,
                    WatchListId = watchList.WatchListId,
                });

                if (!string.IsNullOrEmpty(request.ProductOptions))
                {
                    string[] productOptionIds = request.ProductOptions.Split(',');
                    foreach (string productOptionId in productOptionIds)
                    {
                        await _offerService.CreateWatchListProductOption(new WatchListProductOption
                        {
                            ProductOptionId = int.Parse(productOptionId),
                            WatchListId = watchList.WatchListId,
                        });
                    }
                }
                await _emailService.SendWatchlistSubmissionEmail(contactRequest.Email, contactRequest.FirstName + " " + contactRequest.LastName, watchList.ProductId, watchList.ContactId);
                await _emailService.SendWatchListAdminEmail(contact, request.ProductId);
            }

            if(contact.Type == "question")
                await _emailService.SendGeneralContactUsEmail(contactRequest.Email, contactRequest.FirstName + " " + contactRequest.LastName);
            if (contact.Type == "buyer question")
            {
                await _emailService.SendAskTheSellerSubmissionEmail(contactRequest.Email, contactRequest.FirstName + " " + contactRequest.LastName, deviceName);
                await _emailService.SendAskTheSellerAdminEmail(contact, request.InventoryId);
            }
            if (contact.Type == "maintenance")
            {
                await _emailService.SendRepairInquirySubmissionEmail(contactRequest.Email, contactRequest.FirstName + " " + contactRequest.LastName);
                await _emailService.SendRepairInquiryAdminEmail(contactRequest, request.ProductId);
            }

            return Ok();
        }

        [HttpPost]
        [Route("maintainance-contact-us")]
        public async Task<ActionResult> ContactUsMaintainance([FromForm] ContactUsRequest request)
        {
            var contactRequest = request.Contact;
            string deviceName = string.Empty;
            if (request.InventoryId != null && contactRequest.Type != "watchlist")
            {
                var inv = await _inventoryService.SearchOneInventory(request.InventoryId ?? 0);
                if (inv != null)
                {
                    deviceName = $"{inv.ProductModel} - {inv.ProductCompany}";
                    if (string.IsNullOrEmpty(contactRequest.Comments))
                        contactRequest.Comments = $"Inquiry about {inv.ProductModel} - {inv.ProductCompany} - SKU {inv.SKU} ";
                }
            }
            var contact = await _contactService.CreateContact(request.Contact, request.ProductId);

            if (request.OfferPrice != null && request.InventoryId != null)
            {
                // add Offer
                var offer = new Offer
                {
                    ContactId = contact.ContactId,
                    OfferPrice = request.OfferPrice ?? 0,
                    InventoryId = request.InventoryId
                };

                await _offerService.CreateOffer(offer);

                // Send Email to site owner (admin email) with contact information and product information, offer price
                var inv = await _inventoryService.SearchOneInventory(request.InventoryId ?? 0);
                if (inv != null)
                {
                    if (string.IsNullOrEmpty(deviceName))
                        deviceName = $"{inv.ProductModel} - {inv.ProductCompany}";
                    await _emailService.SendMakeAnOfferSubmissionEmail(contactRequest.Email, contactRequest.FirstName + " " + contactRequest.LastName, deviceName);
                    await _emailService.SendEmailForOffer(contact, inv, offer.OfferPrice);
                }
            }
            if (request.ProductId != null && contactRequest.Type == "watchlist")
            {
                var watchList = await _offerService.CreateWatchList(new WatchList
                {
                    ContactId = contact.ContactId,
                    ProductId = request.ProductId ?? 0,
                });
                await _offerService.CreateWatchListProduct(new WatchListProduct
                {
                    ProductId = request.ProductId ?? 0,
                    WatchListId = watchList.WatchListId,
                });

                if (!string.IsNullOrEmpty(request.ProductOptions))
                {
                    string[] productOptionIds = request.ProductOptions.Split(',');
                    foreach (string productOptionId in productOptionIds)
                    {
                        await _offerService.CreateWatchListProductOption(new WatchListProductOption
                        {
                            ProductOptionId = int.Parse(productOptionId),
                            WatchListId = watchList.WatchListId,
                        });
                    }
                }
                await _emailService.SendWatchlistSubmissionEmail(contactRequest.Email, contactRequest.FirstName + " " + contactRequest.LastName, watchList.ProductId, watchList.ContactId);
                await _emailService.SendWatchListAdminEmail(contact, request.ProductId);
            }

            if (contact.Type == "question")
                await _emailService.SendGeneralContactUsEmail(contactRequest.Email, contactRequest.FirstName + " " + contactRequest.LastName);
            if (contact.Type == "buyer question")
            {
                await _emailService.SendAskTheSellerSubmissionEmail(contactRequest.Email, contactRequest.FirstName + " " + contactRequest.LastName, deviceName);
                await _emailService.SendAskTheSellerAdminEmail(contact, request.InventoryId);
            }
            if (contact.Type == "maintenance")
            {
                await _emailService.SendRepairInquirySubmissionEmail(contactRequest.Email, contactRequest.FirstName + " " + contactRequest.LastName);
                await _emailService.SendRepairInquiryAdminEmail(contactRequest, request.ProductId);
            }

            return Ok();
        }

        [HttpPost]
        [Route("/unwatch")]
        public async Task<ActionResult> Unwatch(UnwatchRequest request)
        {
            bool success = await _offerService.Unwatch(request);
            if (success)
            {
                return Ok(new
                {
                    messsage = "Successfully unwatched"
                });
            }
            else
            {
                return NotFound();
            }

        }

        [HttpPost]
        [Route("/warranty-contact")]
        public async Task<ActionResult<Warranty>> CreateWarrantyContact([FromForm] WarrantyContactRequest request)
        {
            var contact = await _contactService.CreateContact(request.Contact);
            var warranty = await _warrantyService.CreateWarranty(request.Warranty, contact.ContactId);
            return Ok(warranty);
        }

    }
}
