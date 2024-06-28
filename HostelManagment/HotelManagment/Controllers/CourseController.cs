using HotelManagment.Database_Model;
using HotelManagment.Helpers;
using HotelManagment.Models;
using HotelManagment.Models.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HotelManagment.Controllers
{
    public class CourseController : Controller
    {
        HostelManagmentEntities entity = new  HostelManagmentEntities();
        Common helper = new Common();
        // GET: Course
        public ActionResult AllCourses()
        {
            UserModel session = (UserModel)Session["CurrentUser"];
            if (session == null || !session.IsAdmin)
            {
                return RedirectToAction("Index", "Login");
            }
            var courses = (from cors in entity.Courses orderby cors.Id descending select cors).ToList();
            return View(courses);
        }
        

        public ActionResult AddCourse(int? Id)
        {
            UserModel session = (UserModel)Session["CurrentUser"];
            if (session == null || !session.IsAdmin)
            {
                return RedirectToAction("Index", "Login");
            }
            Courses model = new Courses();
            if (Id > 0)
            {
                model = (from cors in entity.Courses where cors.Id == Id select cors).FirstOrDefault();
            }
            return View(model);
        }

        [HttpPost]
        public JsonResult SaveCourse(Courses model)
        {
            AjaxModel result = new AjaxModel();
            try
            {
                UserModel session = (UserModel)Session["CurrentUser"];
                if (model == null)
                {
                    result.Success = false;
                    result.Message = "Model Can't be null..";
                    return Json(result, JsonRequestBehavior.AllowGet);
                }
                model.IsActive = model.IsActive;
                model.CreatedOn = DateTime.Now;
                if (model.Id == 0)
                {
                    entity.Courses.Add(model);
                    helper.ManageLogs(session.UserId, "New Course added by " + session.FirstName + " " + session.LastName);
                    result.Message = "New Course added successfully.";
                }
                else
                {
                    var course = (from cors in entity.Courses where cors.Id == model.Id select cors).FirstOrDefault();
                    if(course == null)
                    {
                        result.Success = false;
                        result.Message = "Course not found. Please try again later.";
                        return Json(result, JsonRequestBehavior.AllowGet);
                    }
                    course.Name = model.Name;
                    course.Description = model.Description;
                    course.Fees = model.Fees;
                    course.IsActive = model.IsActive;
                    helper.ManageLogs(session.UserId, "Course updated added by " + session.FirstName + " " + session.LastName);
                    result.Message = "Course updated successfully.";
                }
                entity.SaveChanges();
                result.Success = true;
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.Message = ex.Message;
                return Json(result, JsonRequestBehavior.AllowGet);
            }
        }
    }
}