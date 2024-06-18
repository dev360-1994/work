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
    public class DevicesController : Controller
    {
        public ActionResult GetDevicesList([DataSourceRequest] DataSourceRequest request)
        {
            try
            {
                List<Devices> _device = new List<Devices>();
                for (int i = 1; i <= 5; i++)
                {
                    _device.Add(new Devices
                    (
                        Subscribe: new Random().Next(100000, 1000000),
                        ESN: new Random().Next(100000, 1000000),
                        IMEI: new Random().Next(100000, 1000000),
                        MDN: "Agent 007",
                        DeviceType: "gov-id-card.pdf",
                        MSL: "",
                        StatusType: "Agent 007",
                        ModelNumber: "gov-id-card.pdf",
                        Price: new Random().Next(10, 100)
                    ));
                }
                DataSourceResult result = _device.ToDataSourceResult(request);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);

            }
        }
    }
}