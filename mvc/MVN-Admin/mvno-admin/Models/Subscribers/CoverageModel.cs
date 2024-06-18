namespace mvno_admin.Models
{
    public class Coverage
    {

        public Coverage(string Provider, string HasCoverage, string IsValidAddress, string Remarks)
        {
            this.Provider = Provider;
            this.HasCoverage = HasCoverage;
            this.IsValidAddress = IsValidAddress;
            this.Remarks = Remarks;
        }
        public string Provider { get; set; }
        public string HasCoverage { get; set; }
        public string IsValidAddress { get; set; }
        public string Remarks { get; set; }
    }
}