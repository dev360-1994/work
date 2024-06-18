using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using mvno_admin.Models;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Telerik.SvgIcons;

namespace mvno_admin.Controllers
{
    public class SubscriberInvoicesController : Controller
    {
        public ActionResult GetSubscriberInvoicesList([DataSourceRequest] DataSourceRequest request)
        {
            try
            {
                List<SubscriberInvoices> _subscriberInvoice = new List<SubscriberInvoices>();
                //for (int i = 1; i <= 5; i++)
                //{
                //    _subscriberInvoice.Add(new SubscriberInvoices
                //    (
                //        Details: "",
                //        InvoiceNumber: "",
                //        InvoiceStatus: "",
                //        InvoiceType: "",
                //        TotalAmount: "",
                //        OpenAmount: "",
                //        InvoiceDate: "",
                //        PaymentDueDate: "",
                //        CustomerPackage: "",
                //        SKU: "",
                //        GraceDay: "",
                //        CreationAuthor: "",
                //        CreationDateTime: "",
                //        RevisionAuthor: "",
                //        RevisionDateTime: ""
                //    ));
                //}
                DataSourceResult result = _subscriberInvoice.ToDataSourceResult(request);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);

            }
        }
    }
}