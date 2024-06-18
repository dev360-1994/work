using System;

namespace mvno_admin.Models
{
    public class SubscriberPayments
    {

        public SubscriberPayments(string PaymentProviderType, string FirstName, string LastName, string CCLast4Digits, string ExpiryDate, string LastTransactionCode, string LastTransactionDate)
        {
            this.PaymentProviderType = PaymentProviderType;
            this.FirstName = FirstName;
            this.LastName = LastName;
            this.CCLast4Digits = CCLast4Digits;
            this.ExpiryDate = ExpiryDate;
            this.LastTransactionCode = LastTransactionCode;
            this.LastTransactionDate = LastTransactionDate;
        }
        public string PaymentProviderType { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string CCLast4Digits { get; set; }
        public string ExpiryDate { get; set; }
        public string LastTransactionCode { get; set; }
        public string LastTransactionDate { get; set; }
    }
}