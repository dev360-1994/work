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
    public class TopupsController : Controller
    {
        public ActionResult CreateNewTopup()
        {
            ViewBag.Message = "Launched Create New Package Page";
            return View("~/Views/App/Packages/Add/Index.cshtml");

        }

        public ActionResult GetTopupsList([DataSourceRequest] DataSourceRequest request)
        {
            try
            {
                List<Topups> _topup = new List<Topups>();
                for (int i = 1; i <= 5; i++)
                {
                    _topup.Add(new Topups
                    (
                        CustomerPackageId: "",
                        PackageDescription: "",
                        CurrentStateType: "",
                        IsTribal: "",
                        IsETC: "",
                        IsAutoRefresh: "",
                        IsShared: "",
                        Provider: "",
                        Author: "",
                        RevisionDatetime: "",
                        IVRDescription: "",
                        IsEnabledForIVRPurchase: "",
                        ExternalPackageId: ""
                    ));
                }
                DataSourceResult result = _topup.ToDataSourceResult(request);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);

            }
        }

    }
}