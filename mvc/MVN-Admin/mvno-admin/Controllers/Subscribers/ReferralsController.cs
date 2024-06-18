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
    public class ReferralsController : Controller
    {
        public ActionResult GetReferralsList([DataSourceRequest] DataSourceRequest request)
        {
            try
            {
                List<Referrals> _referral = new List<Referrals>();
                //for (int i = 1; i <= 5; i++)
                //{
                //    _referral.Add(new Referrals
                //    (
                //        FirstName: "",
                //        LastName: "",
                //        MDN: "",
                //        PackageId: "",
                //        Author: "",
                //        CreationDate: ""
                //    ));
                //}
                DataSourceResult result = _referral.ToDataSourceResult(request);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);

            }
        }
    }
}