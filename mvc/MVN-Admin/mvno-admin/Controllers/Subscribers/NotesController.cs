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
    public class NotesController : Controller
    {
        public ActionResult GetNotesList([DataSourceRequest] DataSourceRequest request)
        {
            try
            {
                List<Notes> _note= new List<Notes>();
                //for (int i = 1; i <= 5; i++)
                //{
                //    _note.Add(new Notes
                //    (
                //        NoteType: "",
                //        NoteStatus: "",
                //        AllNotes: "",
                //        CreationAuthor: "",
                //        CreationDatetime: "",
                //        RevisionAuthor: "",
                //        RevisionDatetime: ""
                //    ));
                //}
                DataSourceResult result = _note.ToDataSourceResult(request);
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(ex.Message, JsonRequestBehavior.AllowGet);

            }
        }
    }
}