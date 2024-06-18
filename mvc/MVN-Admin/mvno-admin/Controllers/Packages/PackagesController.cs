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
    public class PackagesController : Controller
    {

        public ActionResult AddNewPackage()
        {
            ViewBag.Message = "Launched Add New Package Page";
            return View("~/Views/App/Packages/Add/AddPackage.cshtml");

        }

        public ActionResult GetPackagesList([DataSourceRequest] DataSourceRequest request)
        {
            try
            {
                List<Packages> _package = new List<Packages>();
                for (int i = 1; i <= 30; i++)
                {
                    _package.Add(new Packages
                    (
                        PackageId : "Package " + i,
                        PackageDescription: "Sample Description",
                        CurrentStateType: "Sample State",
                        OrderCount: "Sample Order Count",
                        Provider: "Sample Provider",
                        Author: "Sample Author",
                        RevisionDatetime: new System.DateTime().ToString(),
                        IVRDescription: "Sample IVR Description",
                        IsWebPackage: "Sample Web Package",
                        WebPackageName: "Sample Web Package Name",
                        Comments: "Sample Comments",
                        SOC: "Sample SOC",
                        ACP: "Sample ACP"
                    ));
                }
                DataSourceResult result = _package.ToDataSourceResult(request);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);

            }
        }
    }
}