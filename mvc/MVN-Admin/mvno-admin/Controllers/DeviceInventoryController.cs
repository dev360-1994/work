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
    public class DeviceInventoryController : Controller
    {
        // GET: DeviceInventory
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult GetDeviceInventoryList([DataSourceRequest] DataSourceRequest request)
        {
            try
            {
                List<DeviceInventoryModel> _deviceInventory = new List<DeviceInventoryModel>();

                for (int i = 0; i < 20; i++)
                {
                    _deviceInventory.Add(new DeviceInventoryModel
                    (
                        DeviceId: i + 1,
                        Status: "Active",
                        CLEC: "Demo",
                        OrderId: 1000 + i,
                        ESN: $"ESN{i + 1}",
                        ILEC: $"ILEC{i + 1}",
                        UICC: $"UICC{i + 1}",
                        MSL: 123456 + i
                    ));
                }
                DataSourceResult result = _deviceInventory.ToDataSourceResult(request);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);

            }
        }

        public ActionResult GetDeviceInventorySimList([DataSourceRequest] DataSourceRequest request)
        {
            try
            {
                List<DeviceInventorySimModel> _deviceInventorySim = new List<DeviceInventorySimModel>();

                for (int i = 0; i < 20; i++)
                {
                    _deviceInventorySim.Add(new DeviceInventorySimModel
                    (
                        ILEC: $"SimILEC{i + 1}",
                        SIM: $"SIM{i + 1}",
                        DeviceESN: 100000 + i,
                        Status: "Active",
                        UICC: $"SimUICC{i + 1}",
                        MDN: 5550000000 + i,
                        Carrier: $"SimCarrier{i + 1}",
                        Price: 29.99 + i
                    ));
                }
                DataSourceResult result = _deviceInventorySim.ToDataSourceResult(request);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);

            }
        }

        public ActionResult GetDeviceInventoryTemplateList([DataSourceRequest] DataSourceRequest request)
        {
            try
            {
                List<DeviceInventoryTemplateModel> _deviceInventoryTemplate = new List<DeviceInventoryTemplateModel>();

                for (int i = 0; i < 20; i++)
                {
                    _deviceInventoryTemplate.Add(new DeviceInventoryTemplateModel
                    (
                        RateTemplateId: i + 1,
                        CLEC: $"TemplateCLEC{i + 1}",
                        Manufacturer: 123456 + i,
                        ModelNumber: $"TemplateModel{i + 1}",
                        Name: $"TemplateName{i + 1}",
                        MarketPrice: 999 + i,
                        MarketPriceDescription: $"Description{i + 1}",
                        Discount: 0.1 + (i * 0.01)
                    ));
                }
                DataSourceResult result = _deviceInventoryTemplate.ToDataSourceResult(request);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);

            }
        }
    }
}