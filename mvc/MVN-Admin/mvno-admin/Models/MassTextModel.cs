using System;

namespace mvno_admin.Models
{
    public class MassTextModel
    {
        public string Clec { get; set; }
        public long InternalId { get; set; }
        public long MDNs { get; set; }
        public string Provider { get; set; }
        public string Message { get; set; }
        public string Status { get; set; }
        public string Response { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Author { get; set; }

        public MassTextModel(string clec, long internalId, long mdns, string provider, string message, string status, string response, DateTime createdDate, string author)
        {
            Clec = clec;
            InternalId = internalId;
            MDNs = mdns;
            Provider = provider;
            Message = message;
            Status = status;
            Response = response;
            CreatedDate = createdDate;
            Author = author;
        }
    }
}