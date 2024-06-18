using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace mvno_admin.Controllers
{
    public class AppController : Controller
    {
        // GET: App
        public ActionResult Dashboards()
        {
            ViewBag.Message = "Launched Dashboards Page";
            return View("~/Views/App/Dashboards/Index.cshtml");

        }

        public ActionResult Tools()
        {
            ViewBag.Message = "Launched Tools Page";
            return View("~/Views/App/Tools/Index.cshtml");

        }

        public ActionResult Reports()
        {
            ViewBag.Message = "Launched Reports Page";
            return View("~/Views/App/Reports/Index.cshtml");

        }

        public ActionResult Agents()
        {
            ViewBag.Message = "Launched Agents Page";
            return View("~/Views/App/Agents/Index.cshtml");

        }
        public ActionResult Devices()
        {
            ViewBag.Message = "Launched Devices Page";
            return View("~/Views/App/Devices/Index.cshtml");

        }

        public ActionResult PortIn()
        {
            ViewBag.Message = "Launched PortIn Page";
            return View("~/Views/App/Port In/Index.cshtml");

        }

        public ActionResult Alerts()
        {
            ViewBag.Message = "Launched Alerts Page";
            return View("~/Views/App/Alerts/Index.cshtml");

        }

        public ActionResult Support()
        {
            ViewBag.Message = "Launched Support Page";
            return View("~/Views/App/Support/Index.cshtml");

        }
    }
}