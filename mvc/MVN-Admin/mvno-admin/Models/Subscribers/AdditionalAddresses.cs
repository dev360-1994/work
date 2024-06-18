using System.Reflection.Emit;

namespace mvno_admin.Models
{
    public class AdditionalAddresses
    {

        public AdditionalAddresses(string AddressId, string FirstName, string LastName, string AddressType, string Address1, string Address2, string City, string StateType, string ZipCode, string Username, string CreateDate, string ModifyDate)
        {
            this.AddressId = AddressId;
            this.FirstName = FirstName;
            this.LastName = LastName;
            this.AddressType = AddressType;
            this.Address1 = Address1;
            this.Address2 = Address2;
            this.City = City;
            this.StateType = StateType;
            this.ZipCode = ZipCode;
            this.Username = Username;
            this.CreateDate = CreateDate;
            this.ModifyDate = ModifyDate;
        }
        public string AddressId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string AddressType { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string City { get; set; }
        public string StateType { get; set; }
        public string ZipCode { get; set; }
        public string Username { get; set; }
        public string CreateDate { get; set; }
        public string ModifyDate { get; set; }
    }
}