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
    public class SubscriberPaymentsController : Controller
    {
        public ActionResult GetSubscriberPaymentsList([DataSourceRequest] DataSourceRequest request)
        {
            try
            {
                List<SubscriberPayments> _subscriberPayment = new List<SubscriberPayments>();
                //for (int i = 1; i <= 5; i++)
                //{
                //    _subscriberPayment.Add(new SubscriberPayments
                //    (
                //        PaymentProviderType: "",
                //        FirstName: "",
                //        LastName: "",
                //        CCLast4Digits: "",
                //        ExpiryDate: "",
                //        LastTransactionCode: "",
                //        LastTransactionDate: ""
                //    ));
                //}
                DataSourceResult result = _subscriberPayment.ToDataSourceResult(request);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);

            }
        }
    }
}