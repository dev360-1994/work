using System.Web.Security;
using Telerik.SvgIcons;

namespace mvno_admin.Models
{
    public class Packages
    {
        public Packages(string PackageId, string PackageDescription, string CurrentStateType, string OrderCount, string Provider, string Author, string RevisionDatetime, string IVRDescription, string IsWebPackage, string WebPackageName, string Comments, string SOC, string ACP)
        {
            this.PackageId = PackageId;
            this.PackageDescription = PackageDescription;
            this.CurrentStateType = CurrentStateType;
            this.OrderCount = OrderCount;
            this.Provider = Provider;
            this.Author = Author;
            this.RevisionDatetime = RevisionDatetime;
            this.IVRDescription = IVRDescription;
            this.IsWebPackage = IsWebPackage;
            this.WebPackageName = WebPackageName;
            this.Comments = Comments;
            this.SOC = SOC;
            this.ACP = ACP;
        }
        public string PackageId { get; set; }
        public string PackageDescription { get; set; }
        public string CurrentStateType { get; set; }
        public string OrderCount { get; set; }
        public string Provider { get; set; }
        public string Author { get; set; }
        public string RevisionDatetime { get; set; }
        public string IVRDescription { get; set; }
        public string IsWebPackage { get; set; }
        public string WebPackageName { get; set; }
        public string Comments { get; set; }
        public string SOC { get; set; }
        public string ACP { get; set; }
    }
}