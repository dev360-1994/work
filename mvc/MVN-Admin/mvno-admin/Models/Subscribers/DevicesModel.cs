namespace mvno_admin.Models
{
    public class Devices
    {

        public Devices(long Subscribe, long ESN, long IMEI, string MDN, string DeviceType, string MSL, string StatusType, string ModelNumber, int Price)
        {
            this.Subscribe = Subscribe;
            this.ESN = ESN;
            this.IMEI = IMEI;
            this.MDN = MDN;
            this.DeviceType = DeviceType;
            this.MSL = MSL;
            this.StatusType = StatusType;
            this.ModelNumber = ModelNumber;
            this.Price = Price;
        }
        public long Subscribe { get; set; }
        public long ESN { get; set; }
        public long IMEI { get; set; }
        public string MDN { get; set; }
        public string DeviceType { get; set; }
        public string MSL { get; set; }
        public string StatusType { get; set; }
        public string ModelNumber { get; set; }
        public int Price { get; set; }
    }
}