namespace mvno_admin.Models
{
    public class DeviceInventoryTemplateModel
    {
        public int RateTemplateId { get; set; }
        public string CLEC { get; set; }
        public long Manufacturer { get; set; }
        public string ModelNumber { get; set; }
        public string Name { get; set; }
        public long MarketPrice { get; set; }
        public string MarketPriceDescription { get; set; }
        public double Discount { get; set; }

        public DeviceInventoryTemplateModel(int RateTemplateId, string CLEC, long Manufacturer, string ModelNumber, string Name, long MarketPrice, string MarketPriceDescription, double Discount)
        {
            this.RateTemplateId = RateTemplateId;
            this.CLEC = CLEC;
            this.Manufacturer = Manufacturer;
            this.ModelNumber = ModelNumber;
            this.Name = Name;
            this.MarketPrice = MarketPrice;
            this.MarketPriceDescription = MarketPriceDescription;
            this.Discount = Discount;
        }
    }

}