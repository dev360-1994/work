using LaserTraderApi.Dtos;
using LaserTraderApi.Models;
using LaserTraderApi.Services;
using LaserTraderApi.Services.ContactService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Mvc;

namespace LaserTraderApi.Controllers
{
    //[Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ContactController : ControllerBase
    {
        private readonly IContactService _contactService;
        private readonly IOfferService _offerService;
        public ContactController(IContactService contactService, IOfferService offerService)
        {
            _contactService = contactService;
            _offerService = offerService;
        }

        [HttpGet]
        [Route("recent")]
        public async Task<List<ContactResponse>> GetRecentActivity(DateTime? startDate, DateTime? endDate, string type = "")
        {
            ContactRecentRequest request = new ContactRecentRequest
            {
                Type = type,
                StartDate = startDate,
                EndDate = endDate
            };
            return await _contactService.GetRecentContacts(request);
            
        }

        [HttpGet]
        [Route("")]
        public async Task<List<ContactResponse>> GetAllContacts(string type="")
        {
            return await _contactService.GetAllContacts(type);
        }

        [HttpPost]
        [Route("")]
        public async Task<ActionResult<Contact>> CreateContact(ContactRequest request)
        {
            var contact = await _contactService.CreateContact(request);
            return contact == null ? NotFound() : Ok(contact);
        }

        [HttpGet]
        [Route("{contactId}")]
        public async Task<ActionResult<ContactExtDto>> GetContact(int contactId)
        {
            var contact = await _contactService.GetContact(contactId);
            return contact == null ? NotFound() : Ok(contact);
        }

        [HttpDelete]
        [Route("{contactId}")]
        public async Task<ActionResult<bool>> DeleteContact(int contactId)
        {
            var isSuccess = await _contactService.DeleteContact(contactId);
            return !isSuccess ? NotFound() : Ok(isSuccess);
        }

        [HttpPut]
        [Route("{contactId}")]
        public async Task<ActionResult<Contact>> UpdateContact(int contactId, [FromForm] ContactsRequest request)
        {
            var contactRequest = request.Contact;
            var contact = await _contactService.UpdateContact(contactId, request);
            if(contact == null) 
                return NotFound();
            
            if (request.Offer != null && request.Offer.OfferPrice >= 0 && contactRequest.Type == "buyer offer")
            {
                request.Offer.UpdatedAt = DateTime.Now;
                var offer = new Offer
                {
                    OfferId = (int) request.Offer.OfferId,
                    ContactId = contact.ContactId,
                    OfferPrice = request.Offer.OfferPrice,
                    InventoryId = request.Offer.InventoryId,
                    Active = (bool) request.Offer.Active,
                    CreatedAt = (DateTime) request.Offer.CreatedAt,
                    UpdatedAt = DateTime.Now,
                };

                await _offerService.UpdateOffer(offer);
            }
            else if (request.WatchList != null && contactRequest.Type == "watchlist")
            {
                int watchListId = (int)request.WatchList.WatchListId;
                int productId = (int)request.ProductId;

                await _offerService.UpdateWatchList(watchListId,productId);
                await _offerService.UpdateWatchListProduct(watchListId, productId);

                if (!string.IsNullOrEmpty(request.WatchList.WatchListProductOptionIds))
                {
                    string[] productOptionIds = request.WatchList.WatchListProductOptionIds.Split(',');

                    await _offerService.UpdateWatchListProductOption(watchListId, productOptionIds);
                }
            }
            return Ok();
        }

        [HttpPatch]
        [Route("{contactId}/set-inactive")]
        public async Task<ActionResult<bool>> SetInactive(int contactId)
        {
            var isSuccess = await _contactService.SetInactive(contactId);
            return !isSuccess ? NotFound() : Ok(isSuccess);
        }
    }
}
