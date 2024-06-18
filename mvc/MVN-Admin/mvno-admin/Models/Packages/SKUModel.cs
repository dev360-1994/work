using System.Web.Security;
using Telerik.SvgIcons;

namespace mvno_admin.Models
{
    public class SKU
    {
        public SKU(string SKUId, string Name, string Price, string DiscountedPrice, string PriceValueType, string CustomerPrice, string Status, string Author, string SKUType, string IsSignUpPortal, string IsNewOrder)
        {
            this.SKUId = SKUId;
            this.Name = Name;
            this.Price = Price;
            this.DiscountedPrice = DiscountedPrice;
            this.PriceValueType = PriceValueType;
            this.CustomerPrice = CustomerPrice;
            this.Status = Status;
            this.Author = Author;
            this.SKUType = SKUType;
            this.IsSignUpPortal = IsSignUpPortal;
            this.IsNewOrder = IsNewOrder;
        }
        public string SKUId { get; set; }
        public string Name { get; set; }
        public string Price { get; set; }
        public string DiscountedPrice { get; set; }
        public string PriceValueType { get; set; }
        public string CustomerPrice { get; set; }
        public string Status { get; set; }
        public string Author { get; set; }
        public string SKUType { get; set; }
        public string IsSignUpPortal { get; set; }
        public string IsNewOrder { get; set; }
    }
}