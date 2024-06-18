using System.Web.Security;
using Telerik.SvgIcons;

namespace mvno_admin.Models
{
    public class AgentCommissions
    {
        public AgentCommissions(string CommissionRateId, string Description)
        {
            this.CommissionRateId = CommissionRateId;
            this.Description = Description;
        }
        public string CommissionRateId { get; set; }
        public string Description { get; set; }
    }
}