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
    public class EndUserPackagesController : Controller
    {

        public ActionResult Packages()
        {
            ViewBag.Message = "Launched Packages Page";
            return View("~/Views/App/Packages/Index.cshtml");

        }

        public ActionResult PackageViews()
        {
            ViewBag.Message = "Launched End User Packages Page With Packages Tab";
            return View("~/Views/App/Packages/Index.cshtml");

        }

    }
}