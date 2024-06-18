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
    public class AdditionalAddressesController : Controller
    {
        public ActionResult GetAdditionalAddressesList([DataSourceRequest] DataSourceRequest request)
        {
            try
            {
                List<AdditionalAddresses> _additionalAddress = new List<AdditionalAddresses>();
                //for (int i = 1; i <= 5; i++)
                //{
                //    _additionalAddress.Add(new AdditionalAddresses
                //    (
                //        AddressId: "",
                //        FirstName: "",
                //        LastName: "",
                //        AddressType: "",
                //        Address1: "",
                //        Address2: "",
                //        City: "",
                //        StateType: "",
                //        ZipCode: "",
                //        Username: "",
                //        CreateDate: "",
                //        ModifyDate: ""
                //    ));
                //}
                DataSourceResult result = _additionalAddress.ToDataSourceResult(request);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);

            }
        }
    }
}