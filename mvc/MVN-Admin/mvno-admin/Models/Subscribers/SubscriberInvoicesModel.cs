using System;

namespace mvno_admin.Models
{
    public class SubscriberInvoices
    {

        public SubscriberInvoices(string Details, string InvoiceNumber, string InvoiceStatus, string InvoiceType, string TotalAmount, string OpenAmount, string InvoiceDate, string PaymentDueDate, string CustomerPackage, string SKU, string GraceDay, string CreationAuthor, string CreationDateTime, string RevisionAuthor, string RevisionDateTime)
        {
            this.Details = Details;
            this.InvoiceNumber = InvoiceNumber;
            this.InvoiceStatus = InvoiceStatus;
            this.InvoiceType = InvoiceType;
            this.TotalAmount = TotalAmount;
            this.OpenAmount = OpenAmount;
            this.InvoiceDate = InvoiceDate;
            this.PaymentDueDate = PaymentDueDate;
            this.CustomerPackage = CustomerPackage;
            this.SKU = SKU;
            this.GraceDay = GraceDay;
            this.CreationAuthor = CreationAuthor;
            this.CreationDateTime = CreationDateTime;
            this.RevisionAuthor = RevisionAuthor;
            this.RevisionDateTime = RevisionDateTime;
        }

        public string Details { get; set; }
        public string InvoiceNumber { get; set; }
        public string InvoiceStatus { get; set; }
        public string InvoiceType { get; set; }
        public string TotalAmount { get; set; }
        public string OpenAmount { get; set; }
        public string InvoiceDate { get; set; }
        public string PaymentDueDate { get; set; }
        public string CustomerPackage { get; set; }
        public string SKU { get; set; }
        public string GraceDay { get; set; }
        public string CreationAuthor { get; set; }
        public string CreationDateTime { get; set; }
        public string RevisionAuthor { get; set; }
        public string RevisionDateTime { get; set; }
    }
}