using LaserTraderApi.Dtos;
using LaserTraderApi.Models;

namespace LaserTraderApi.Services.ContactService
{
    public interface IContactService
    {
        Task<List<ContactResponse>> GetAllContacts(string type);
        Task<Contact> CreateContact(ContactRequest contactRequest, int? productId = null);
        Task<ContactExtDto?> GetContact(int contactId);
        Task<Contact?> UpdateContact(int contactId, ContactsRequest contactRequest);
        Task<bool> DeleteContact(int contactId);

        Task<List<ContactResponse>> GetRecentContacts(ContactRecentRequest request);

        Task<bool> SetInactive(int contactId);
    }
}
