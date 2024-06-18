using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using mvno_admin.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Xml.Linq;
using Telerik.SvgIcons;

namespace mvno_admin.Controllers
{
    public class AgentCommissionsController : Controller
    {
        public ActionResult GetAgentCommissionsList([DataSourceRequest] DataSourceRequest request)
        {
            try
            {
                List<AgentCommissions> _agentCommission = new List<AgentCommissions>();
                for (int i = 1; i <= 5; i++)
                {
                    _agentCommission.Add(new AgentCommissions
                    (
                        CommissionRateId: "",
                        Description: ""
                    ));
                }
                DataSourceResult result = _agentCommission.ToDataSourceResult(request);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);

            }
        }
    }
}