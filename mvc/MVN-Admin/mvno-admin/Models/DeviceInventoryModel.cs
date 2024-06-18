namespace mvno_admin.Models
{
    public class DeviceInventoryModel
    {
        public string ILEC { get; set; }
        public string CLEC { get; set; }
        public long DeviceId { get; set; }
        public long OrderId { get; set; }
        public string ESN { get; set; }
        public string Status { get; set; }
        public string UICC { get; set; }
        public long MSL { get; set; }

        public DeviceInventoryModel(long DeviceId, string Status, string CLEC, long OrderId, string ESN, string ILEC, string UICC, long MSL)
        {
            this.DeviceId = DeviceId;
            this.Status = Status;
            this.CLEC = CLEC;
            this.OrderId = OrderId;
            this.ESN = ESN;
            this.ILEC = ILEC;
            this.UICC = UICC;
            this.MSL = MSL;
        }
    }

}