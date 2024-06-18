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
    public class CoverageController : Controller
    {
        public ActionResult GetCoverageList([DataSourceRequest] DataSourceRequest request)
        {
            try
            {
                List<Coverage> _coverage = new List<Coverage>();
                for (int i = 1; i <= 5; i++)
                {
                    _coverage.Add(new Coverage
                    (
                        Provider: "Provider Name " + i,
                        HasCoverage: "Yes",
                        IsValidAddress: "Yes",
                        Remarks: "Sample Remarks"
                    ));
                }
                DataSourceResult result = _coverage.ToDataSourceResult(request);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);

            }
        }
    }
}