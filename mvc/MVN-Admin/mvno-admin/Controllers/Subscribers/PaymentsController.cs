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
    public class PaymentsController : Controller
    {
        public ActionResult GetPaymentsList([DataSourceRequest] DataSourceRequest request)
        {
            try
            {
                List<Payments> _order = new List<Payments>();
                for (int i = 1; i <= 5; i++)
                {
                    _order.Add(new Payments
                    (
                        Items: "Starter Plan " + i,
                        Price: "$ 10.0",
                        Status: "Pending"
                    ));
                }
                DataSourceResult result = _order.ToDataSourceResult(request);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);

            }
        }
    }
}