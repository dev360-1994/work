namespace mvno_admin.Models
{
    public class Subscribers
    {
        public Subscribers(long SubscriberId, string SubscriberStatus, string CLEC, string AgentName, long MDN, string FirstName, string LastName, string Package, long NLAD, string NLADProgram, bool isEtc, bool IsTribal)
        {
            this.SubscriberId = SubscriberId;
            this.SubscriberStatus = SubscriberStatus;
            this.CLEC = CLEC;
            this.AgentName = AgentName;
            this.MDN = MDN;
            this.FirstName = FirstName;
            this.LastName = LastName;
            this.Package = Package;
            this.NLAD = NLAD;
            this.NLADProgram = NLADProgram;
            this.IsEtc = IsEtc;
            this.isTribal = isTribal;
        }
        public long SubscriberId { get; set; }
        public string SubscriberStatus { get; set; }
        public string CLEC { get; set; }
        public string AgentName { get; set; }
        public long MDN { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Package { get; set; }
        public long NLAD { get; set; }
        public string NLADProgram { get; set; }
        public bool IsEtc { get; set; }
        public bool isTribal { get; set; }
    }
}