using System.Web.Security;
using Telerik.SvgIcons;

namespace mvno_admin.Models
{
    public class Topups
    {
        public Topups(string CustomerPackageId, string PackageDescription, string CurrentStateType, string IsTribal, string IsETC, string IsAutoRefresh, string IsShared, string Provider, string Author, string RevisionDatetime, string IVRDescription, string IsEnabledForIVRPurchase, string ExternalPackageId)
        {
            this.CustomerPackageId = CustomerPackageId;
            this.PackageDescription = PackageDescription;
            this.CurrentStateType = CurrentStateType;
            this.IsTribal = IsTribal;
            this.IsETC = IsETC;
            this.IsAutoRefresh = IsAutoRefresh;
            this.IsShared = IsShared;
            this.Provider = Provider;
            this.Author = Author;
            this.RevisionDatetime = RevisionDatetime;
            this.IVRDescription = IVRDescription;
            this.IsEnabledForIVRPurchase = IsEnabledForIVRPurchase;
            this.ExternalPackageId = ExternalPackageId;
        }
        public string CustomerPackageId { get; set; }
        public string PackageDescription { get; set; }
        public string CurrentStateType { get; set; }
        public string IsTribal { get; set; }
        public string IsETC { get; set; }
        public string IsAutoRefresh { get; set; }
        public string IsShared { get; set; }
        public string Provider { get; set; }
        public string Author { get; set; }
        public string RevisionDatetime { get; set; }
        public string IVRDescription { get; set; }
        public string IsEnabledForIVRPurchase { get; set; }
        public string ExternalPackageId { get; set; }
    }
}