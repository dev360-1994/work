using LaserTraderApi.Dtos;
using LaserTraderApi.Models;

namespace LaserTraderApi.Services
{
    public interface IEmailService
    {
        Task SendEmailWatchList(int productId, int inventoryId, string productName);
        Task SendEmailForSeller(Contact contact, Product product, Inventory inventory);
        Task SendEmailForOffer(Contact contact, InventorySearchResponse inventory, float offerPrice);
        Task SendGeneralContactUsEmail(string toEmail, string userName);
        Task SendMakeAnOfferSubmissionEmail(string toEmail, string userName, string deviceName);
        Task SendAskTheSellerSubmissionEmail(string toEmail, string userName, string deviceDetails);
        Task SendSellYourDeviceSubmissionEmail(string toEmail, string userName);
        Task SendSellisLiveEmail(string toEmail, string userName, int inventoryId);
        Task SendRepairInquirySubmissionEmail(string toEmail, string userName);
        Task SendWatchlistSubmissionEmail(string toEmail, string userName, int productId, int contactId);
        Task SendAskTheSellerAdminEmail(Contact contact, int? inventoryId);
        Task SendRepairInquiryAdminEmail(ContactRequest contactRequest, int? productId);
        Task SendWatchListAdminEmail(Contact contact, int? productId);
    }
}
