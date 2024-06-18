namespace mvno_admin.Models
{
    public class DeviceInventorySimModel
    {
        public string ILEC { get; set; }
        public string SIM { get; set; }
        public long DeviceESN { get; set; }
        public string Status { get; set; }
        public string UICC { get; set; }
        public long MDN { get; set; }
        public string Carrier { get; set; }
        public double Price { get; set; }

        public DeviceInventorySimModel(string ILEC, string SIM, long DeviceESN, string Status, string UICC, long MDN, string Carrier, double Price)
        {
            this.ILEC = ILEC;
            this.SIM = SIM;
            this.DeviceESN = DeviceESN;
            this.Status = Status;
            this.UICC = UICC;
            this.MDN = MDN;
            this.Carrier = Carrier;
            this.Price = Price;
        }
    }

}