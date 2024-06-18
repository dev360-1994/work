namespace mvno_admin.Models
{
    public class SubscriberDevices
    {

        public SubscriberDevices(string DeviceId, string ESN, string MSL, string ModelNumber, string MakeManufacturer, string MDN, string InventoryLocation, string Inventory, string InventoryType)
        {
            this.DeviceId = DeviceId;
            this.ESN = ESN;
            this.MSL = MSL;
            this.ModelNumber = ModelNumber;
            this.MakeManufacturer = MakeManufacturer;
            this.MDN = MDN;
            this.InventoryLocation = InventoryLocation;
            this.Inventory = Inventory;
            this.InventoryType = InventoryType;
        }
        public string DeviceId { get; set; }
        public string ESN { get; set; }
        public string MSL { get; set; }
        public string ModelNumber { get; set; }
        public string MakeManufacturer { get; set; }
        public string MDN { get; set; }
        public string InventoryLocation { get; set; }
        public string Inventory { get; set; }
        public string InventoryType { get; set; }
    }
}