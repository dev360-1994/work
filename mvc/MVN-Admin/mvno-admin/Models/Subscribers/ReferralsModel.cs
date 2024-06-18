namespace mvno_admin.Models
{
    public class Referrals
    {

        public Referrals(string FirstName, string LastName, string MDN, string PackageId, string Author, string CreationDate)
        {
            this.FirstName = FirstName;
            this.LastName = LastName;
            this.MDN = MDN;
            this.PackageId = PackageId;
            this.Author = Author;
            this.CreationDate = CreationDate;
        }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MDN { get; set; }
        public string PackageId { get; set; }
        public string Author { get; set; }
        public string CreationDate { get; set; }
    }
}