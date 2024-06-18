namespace mvno_admin.Models
{
    public class Payments
    {

        public Payments(string Items, string Price, string Status)
        {
            this.Items = Items;
            this.Price = Price;
            this.Status = Status;
        }
        public string Items { get; set; }
        public string Price { get; set; }
        public string Status { get; set; }
    }
}