using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using mvno_admin.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace mvno_admin.Controllers
{
    public class SIMSController : Controller
    {
        public ActionResult GetSIMList([DataSourceRequest] DataSourceRequest request)
        {
            try
            {
                List<SIMS> _sim = new List<SIMS>();
                for (int i = 1; i <= 5; i++)
                {
                    _sim.Add(new SIMS
                    (
                        SubscribeSIMID: new Random().Next(100000, 1000000),
                        SIM: new Random().Next(100000, 1000000),
                        StatusType: "Pending"
                    ));
                }
                DataSourceResult result = _sim.ToDataSourceResult(request);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);

            }
        }
    }
}