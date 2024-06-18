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
    public class SubscribersController : Controller
    {
        public ActionResult SubscribersList()
        {
            ViewBag.Message = "Launched Subscribers Page";
            return View("~/Views/App/Subscribers/Index.cshtml");

        }

        public ActionResult CreateNewSubscriber()
        {
            ViewBag.Message = "Launched Create Subscriber Page";
            return View("~/Views/App/Subscribers/Add/Index.cshtml");

        }

        public ActionResult ViewSubscriber()
        {
            ViewBag.Message = "Launched View Subscriber Page";
            return View("~/Views/App/Subscribers/View/Index.cshtml");

        }

        public ActionResult GetSubscribersList([DataSourceRequest] DataSourceRequest request)
        {
            try
            {
                List<Subscribers> _subscriber = new List<Subscribers>();
                _subscriber.Add(new Subscribers(35684836, "Active", "Demo", "Quetzal", 9203052333, "John", "Clavin", "3,000 Data Only Pan", 123456, "ACP", false, false));
                _subscriber.Add(new Subscribers(35684836, "Active", "Demo", "Quetzal", 9203052333, "John", "Clavin", "3,000 Data Only Pan", 123456, "ACP", false, false));
                _subscriber.Add(new Subscribers(35684836, "Active", "Demo", "Quetzal", 9203052333, "John", "Clavin", "3,000 Data Only Pan", 123456, "ACP", false, false));
                _subscriber.Add(new Subscribers(35684836, "Active", "Demo", "Quetzal", 9203052333, "John", "Clavin", "3,000 Data Only Pan", 123456, "ACP", false, false));
                _subscriber.Add(new Subscribers(35684836, "Active", "Demo", "Quetzal", 9203052333, "John", "Clavin", "3,000 Data Only Pan", 123456, "ACP", false, false));
                _subscriber.Add(new Subscribers(35684836, "Active", "Demo", "Quetzal", 9203052333, "John", "Clavin", "3,000 Data Only Pan", 123456, "ACP", false, false));
                _subscriber.Add(new Subscribers(35684836, "Active", "Demo", "Quetzal", 9203052333, "John", "Clavin", "3,000 Data Only Pan", 123456, "ACP", false, false));
                _subscriber.Add(new Subscribers(35684836, "Active", "Demo", "Quetzal", 9203052333, "John", "Clavin", "3,000 Data Only Pan", 123456, "ACP", false, false));
                _subscriber.Add(new Subscribers(35684836, "Active", "Demo", "Quetzal", 9203052333, "John", "Clavin", "3,000 Data Only Pan", 123456, "ACP", false, false));
                _subscriber.Add(new Subscribers(35684836, "Active", "Demo", "Quetzal", 9203052333, "John", "Clavin", "3,000 Data Only Pan", 123456, "ACP", false, false));
                _subscriber.Add(new Subscribers(35684836, "Active", "Demo", "Quetzal", 9203052333, "John", "Clavin", "3,000 Data Only Pan", 123456, "ACP", false, false));
                _subscriber.Add(new Subscribers(35684836, "Active", "Demo", "Quetzal", 9203052333, "John", "Clavin", "3,000 Data Only Pan", 123456, "ACP", false, false));
                _subscriber.Add(new Subscribers(35684836, "Active", "Demo", "Quetzal", 9203052333, "John", "Clavin", "3,000 Data Only Pan", 123456, "ACP", false, false));
                _subscriber.Add(new Subscribers(35684836, "Active", "Demo", "Quetzal", 9203052333, "John", "Clavin", "3,000 Data Only Pan", 123456, "ACP", false, false));
                _subscriber.Add(new Subscribers(35684836, "Active", "Demo", "Quetzal", 9203052333, "John", "Clavin", "3,000 Data Only Pan", 123456, "ACP", false, false));
                _subscriber.Add(new Subscribers(35684836, "Active", "Demo", "Quetzal", 9203052333, "John", "Clavin", "3,000 Data Only Pan", 123456, "ACP", false, false));
                _subscriber.Add(new Subscribers(35684836, "Active", "Demo", "Quetzal", 9203052333, "John", "Clavin", "3,000 Data Only Pan", 123456, "ACP", false, false));
                _subscriber.Add(new Subscribers(35684836, "Active", "Demo", "Quetzal", 9203052333, "John", "Clavin", "3,000 Data Only Pan", 123456, "ACP", false, false));
                _subscriber.Add(new Subscribers(35684836, "Active", "Demo", "Quetzal", 9203052333, "John", "Clavin", "3,000 Data Only Pan", 123456, "ACP", false, false));
                _subscriber.Add(new Subscribers(35684836, "Active", "Demo", "Quetzal", 9203052333, "John", "Clavin", "3,000 Data Only Pan", 123456, "ACP", false, false));
                _subscriber.Add(new Subscribers(35684836, "Active", "Demo", "Quetzal", 9203052333, "John", "Clavin", "3,000 Data Only Pan", 123456, "ACP", false, false));
                _subscriber.Add(new Subscribers(35684836, "Active", "Demo", "Quetzal", 9203052333, "John", "Clavin", "3,000 Data Only Pan", 123456, "ACP", false, false));
                _subscriber.Add(new Subscribers(35684836, "Active", "Demo", "Quetzal", 9203052333, "John", "Clavin", "3,000 Data Only Pan", 123456, "ACP", false, false));
                _subscriber.Add(new Subscribers(35684836, "Active", "Demo", "Quetzal", 9203052333, "John", "Clavin", "3,000 Data Only Pan", 123456, "ACP", false, false));
                _subscriber.Add(new Subscribers(35684836, "Active", "Demo", "Quetzal", 9203052333, "John", "Clavin", "3,000 Data Only Pan", 123456, "ACP", false, false));
                _subscriber.Add(new Subscribers(35684836, "Active", "Demo", "Quetzal", 9203052333, "John", "Clavin", "3,000 Data Only Pan", 123456, "ACP", false, false));
                _subscriber.Add(new Subscribers(35684836, "Active", "Demo", "Quetzal", 9203052333, "John", "Clavin", "3,000 Data Only Pan", 123456, "ACP", false, false));
                _subscriber.Add(new Subscribers(35684836, "Active", "Demo", "Quetzal", 9203052333, "John", "Clavin", "3,000 Data Only Pan", 123456, "ACP", false, false));
                _subscriber.Add(new Subscribers(35684836, "Active", "Demo", "Quetzal", 9203052333, "John", "Clavin", "3,000 Data Only Pan", 123456, "ACP", false, false));
                _subscriber.Add(new Subscribers(35684836, "Active", "Demo", "Quetzal", 9203052333, "John", "Clavin", "3,000 Data Only Pan", 123456, "ACP", false, false));
                _subscriber.Add(new Subscribers(35684836, "Active", "Demo", "Quetzal", 9203052333, "John", "Clavin", "3,000 Data Only Pan", 123456, "ACP", false, false));
                _subscriber.Add(new Subscribers(35684836, "Active", "Demo", "Quetzal", 9203052333, "John", "Clavin", "3,000 Data Only Pan", 123456, "ACP", false, false));

                DataSourceResult result = _subscriber.ToDataSourceResult(request);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);

            }
        }

        public ActionResult GetCoverageInfo([DataSourceRequest] DataSourceRequest request)
        {
            try
            {
                List<Coverage> _coverage = new List<Coverage>();

                _coverage.Add(new Coverage("Provider 1", "Yes", "Yes", "Lorem ipsum dolor"));
                _coverage.Add(new Coverage("Provider 2", "Yes", "Yes", "Lorem ipsum dolor"));
                _coverage.Add(new Coverage("Provider 3", "Yes", "Yes", "Lorem ipsum dolor"));
                _coverage.Add(new Coverage("Provider 4", "Yes", "Yes", "Lorem ipsum dolor"));
                _coverage.Add(new Coverage("Provider 5", "Yes", "Yes", "Lorem ipsum dolor"));


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