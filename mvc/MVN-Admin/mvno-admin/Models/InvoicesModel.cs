using System.Web.Security;
using Telerik.SvgIcons;

namespace mvno_admin.Models
{
    public class Invoices
    {
        public Invoices(string mdn, string invoiceNumber, string orderId, string dueDate, string totalAmount, string openAmount, string invoiceStatus, string invoiceType, string author, string city, string stateType, string firstName, string lastName, string customerPackage, string sku)
        {
            this.mdn = mdn;
            this.invoiceNumber = invoiceNumber;
            this.orderId = orderId;
            this.dueDate = dueDate;
            this.totalAmount = totalAmount;
            this.openAmount = openAmount;
            this.invoiceStatus = invoiceStatus;
            this.invoiceType = invoiceType;
            this.author = author;
            this.city = city;
            this.stateType = stateType;
            this.firstName = firstName;
            this.lastName = lastName;
            this.customerPackage = customerPackage;
            this.sku = sku;
        }
        public string mdn { get; set; }
        public string invoiceNumber { get; set; }
        public string orderId { get; set; }
        public string dueDate { get; set; }
        public string totalAmount { get; set; }
        public string openAmount { get; set; }
        public string invoiceStatus { get; set; }
        public string invoiceType { get; set; }
        public string author { get; set; }
        public string city { get; set; }
        public string stateType { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string customerPackage { get; set; }
        public string sku { get; set; }
    }
}