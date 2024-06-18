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
    public class ReportsController : Controller
    {
        public ActionResult Invoices()
        {
            ViewBag.Message = "Launched Invoices Page";
            return View("~/Views/App/Reports/List/Invoices.cshtml");
        }

        public ActionResult GetInvoicesList([DataSourceRequest] DataSourceRequest request)
        {
            try
            {
                List<Invoices> _invoice = new List<Invoices>();
                _invoice.Add(new Invoices("9203052333", "8542835", "3584836", "11/23/2023 03:54:26", "$13.00", "$13.00", "Pending", "New Order", "SignUpPortal-Quetzal_Test", "Hobart", "WI", "John", "Doe", "3000 Data Only Plan", "Customer Payment"));
                

                DataSourceResult result = _invoice.ToDataSourceResult(request);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);

            }
        }
    }
}