using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using mvno_admin.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Web;
using System.Web.Mvc;

namespace mvno_admin.Controllers
{
    public class SubscriberDevicesController : Controller
    {
        public ActionResult GetSubscriberDevicesList([DataSourceRequest] DataSourceRequest request)
        {
            try
            {
                List<SubscriberDevices> _subscriberDevice = new List<SubscriberDevices>();
                //for (int i = 1; i <= 10; i++)
                //{
                //    _subscriberDevice.Add(new SubscriberDevices
                //    (
                //        DeviceId: "",
                //        ESN: "",
                //        MSL: "",
                //        ModelNumber: "",
                //        MakeManufacturer: "",
                //        MDN: "",
                //        InventoryLocation: "",
                //        Inventory: "",
                //        InventoryType: ""
                //    ));
                //}
                DataSourceResult result = _subscriberDevice.ToDataSourceResult(request);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);

            }
        }
    }
}