namespace mvno_admin.Models
{
    public class SIMS
    {

        public SIMS(long SubscribeSIMID, long SIM, string StatusType)
        {
            this.SubscribeSIMID = SubscribeSIMID;
            this.SIM = SIM;
            this.StatusType = StatusType;
        }
        public long SubscribeSIMID { get; set; }
        public long SIM { get; set; }
        public string StatusType { get; set; }
    }
}