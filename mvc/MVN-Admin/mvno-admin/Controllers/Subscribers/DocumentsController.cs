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
    public class DocumentsController : Controller
    {
        public ActionResult GetDoumentsList([DataSourceRequest] DataSourceRequest request)
        {
            try
            {
                List<Documents> _document = new List<Documents>();
                for (int i = 1; i <= 5; i++)
                {
                    _document.Add(new Documents
                    (
                        DocumentType: "Document Type " + i,
                        ExceptionCode: "Exception Code 1",
                        ReceivedDate: new System.DateTime().ToString(),
                        Agent: "Agent 007",
                        Proof: "gov-id-card.pdf"
                    ));
                }
                DataSourceResult result = _document.ToDataSourceResult(request);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);

            }
        }
    }
}