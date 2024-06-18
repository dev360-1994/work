using Kendo.Mvc.Extensions;
using Kendo.Mvc.UI;
using mvno_admin.Models;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Services.Description;
using System.Xml.Linq;
using Telerik.SvgIcons;

namespace mvno_admin.Controllers
{
    public class SKUController : Controller
    {
        public ActionResult CreateNewTopup()
        {
            ViewBag.Message = "Launched Create New Package Page";
            return View("~/Views/App/Packages/Add/Index.cshtml");

        }

        public ActionResult GetSKUList([DataSourceRequest] DataSourceRequest request)
        {
            try
            {
                List<SKU> _sku = new List<SKU> ();
                for (int i = 1; i <= 5; i++)
                {
                    _sku.Add(new SKU
                    (
                        SKUId: "",
                        Name: "",
                        Price: "",
                        DiscountedPrice: "",
                        PriceValueType: "",
                        CustomerPrice: "",
                        Status: "",
                        Author: "",
                        SKUType: "",
                        IsSignUpPortal: "",
                        IsNewOrder: ""
                    ));
                }
                DataSourceResult result = _sku.ToDataSourceResult(request);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);

            }
        }

    }
}