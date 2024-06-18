namespace mvno_admin.Models
{
    public class Documents
    {

        public Documents(string DocumentType, string ExceptionCode, string ReceivedDate, string Agent, string Proof)
        {
            this.DocumentType = DocumentType;
            this.ExceptionCode = ExceptionCode;
            this.ReceivedDate = ReceivedDate;
            this.Agent = Agent;
            this.Proof = Proof;
        }
        public string DocumentType { get; set; }
        public string ExceptionCode { get; set; }
        public string ReceivedDate { get; set; }
        public string Agent { get; set; }
        public string Proof { get; set; }
    }
}