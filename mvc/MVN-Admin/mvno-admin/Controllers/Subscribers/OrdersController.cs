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
    public class OrdersController : Controller
    {
        public ActionResult GetOrdersList([DataSourceRequest] DataSourceRequest request)
        {
            try
            {
                List<Orders> _order = new List<Orders>();
                for (int i = 1; i <= 5; i++)
                {
                    _order.Add(new Orders
                    (
                        OrderID: new Random().Next(100000, 1000000),
                        FirstName: "John",
                        LastName: "Doe",
                        MDN: "Device not assigned",
                        LifelineStatus: "",
                        ACPStatus: "Enrolled"
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