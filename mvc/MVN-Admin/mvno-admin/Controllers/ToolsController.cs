using Kendo.Mvc.UI;
using mvno_admin.Models;
using System.Collections.Generic;
using System;
using System.Web.Mvc;
using Kendo.Mvc.Extensions;

namespace mvno_admin.Controllers
{
    public class ToolsController : Controller
    {
        // GET: Tools
        public ActionResult GetMassTextMessagesList([DataSourceRequest] DataSourceRequest request)
        {
            try
            {
                List<MassTextModel> _massTextMessagesList = new List<MassTextModel>();

                for (int i = 0; i < 20; i++)
                {
                    _massTextMessagesList.Add(new MassTextModel
                    (
                        clec: "Demo",
                        internalId: i + 1,
                        mdns: 1000 + i,
                        provider: $"Provider{i + 1}",
                        message: $"This is message {i + 1}",
                        status: "Sent",
                        response: $"Response{i + 1}",
                        createdDate: DateTime.Now.AddDays(-i),
                        author: $"Author{i + 1}"
                    ));
                }

                DataSourceResult result = _massTextMessagesList.ToDataSourceResult(request);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);

            }
        }
    }
}