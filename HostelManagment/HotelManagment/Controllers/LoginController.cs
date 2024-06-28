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
    public class LoginController : Controller
    {
        HostelManagmentEntities entity = new HostelManagmentEntities();
        Common helper = new Common();
        // GET: Login
        public ActionResult Index()
        {
            Session["CurrentUser"] = null;
            return View();
        }

        public ActionResult Logout()
        {
            Session["CurrentUser"] = null;
            return RedirectToAction("Index", "Login");
        }

        [HttpPost]
        public JsonResult Login(string email, string password)
        {
            AjaxModel model = new AjaxModel();
            int userid = 0;
            try
            {
                var user = helper.FindUserByEmail(email);//(from usr in entity.Users where usr.Email == email select usr).FirstOrDefault();
                if (user == null || !String.Equals(helper.Decode(user.Password), password))
                {
                    model.Success = false;
                    model.Message = "InValid Credentials..";
                    return Json(model, JsonRequestBehavior.AllowGet);
                }
                else if (user.IsActive == false)
                {
                    model.Success = false;
                    model.Message = "Your account is not yet approved by administrator. Please try later.";
                    return Json(model, JsonRequestBehavior.AllowGet);
                }
                userid = user.Id;
                helper.ManageLogs(user.Id, "User Login to the account");

                UserModel usermodel = helper.Mapper(user);
                Session["CurrentUser"] = usermodel;

                model.Success = true;
                model.Message = user.IsAdmin ? "Admin" : "User";
                return Json(model, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                helper.ManageLogs(userid, "User Login to the account");
                model.Success = false;
                model.Message = ex.Message;
                return Json(model, JsonRequestBehavior.AllowGet);
            }

        }

        [HttpPost]
        public JsonResult CreateUser(string email, string name, string password)
        {
            AjaxModel model = new AjaxModel();
            try
            {
                var existuser = helper.FindUserByEmail(email);
                if (existuser != null)
                {
                    model.Success = false;
                    model.Message = "Email already exist in database.";
                    return Json(model, JsonRequestBehavior.AllowGet);
                }
                User user = new User();
                user.FirstName = name;
                user.IsAdmin = false;
                user.Password = helper.Encode(password);
                user.Email = email;
                user.IsProfileCompleted = false;
                user.CreatedOn = DateTime.Now;
                user.IsActive = false;
                entity.Users.Add(user);
                entity.SaveChanges();
                helper.ManageLogs(user.Id, "New User Created");
                model.Success = true;
                model.Message = "Your account has been created successfull. Please wait untill administrator apporves your account.";
                return Json(model, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                model.Success = false;
                model.Message = ex.Message;
                return Json(model, JsonRequestBehavior.AllowGet);
            }

        }

        [HttpPost]
        public ActionResult UpdatePassword(string email, string newPassword)
        {
            AjaxModel result = new AjaxModel();
            try
            {
                var user = helper.FindUserByEmail(email);
                user.Password = helper.Encode(newPassword);
                entity.SaveChanges();
                helper.ManageLogs(user.Id, "Password updated by user.");
                result.Success = true;
                result.Message = "Password update successfully.";
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.Message = ex.Message;
                return Json(result, JsonRequestBehavior.AllowGet);
            }
           
        }

        [HttpPost]
        public JsonResult ResetPasswords(string email,string mobile)
        {
            AjaxModel result = new AjaxModel();
            int userid = 0;
            try
            {
                var user = helper.FindUserByEmail(email);
                if (user == null)
                {
                    result.Success = false;
                    result.Message = "Email doesn't exist..";
                    return Json(result, JsonRequestBehavior.AllowGet);
                }
                else if (string.IsNullOrEmpty(user.Mobile))
                {
                    result.Success = false;
                    result.Message = "you have not entered your mobile number in your profile. Please email us at Ermandeepkaur12@gmail.com ";
                    return Json(result, JsonRequestBehavior.AllowGet);
                }
                else if(user.Mobile != mobile)
                {
                    result.Success = false;
                    result.Message = "Mobile number is incorrect.";
                    return Json(result, JsonRequestBehavior.AllowGet);
                }
                else if(user.Mobile == mobile)
                {
                    helper.ManageLogs(user.Id, "Password reset process started.");
                    result.Success = true;
                    return Json(result, JsonRequestBehavior.AllowGet);
                }
                
                result.Success = false;
                result.Message = "Internal server error..";
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                helper.ManageLogs(userid, ex.Message);
                result.Success = false;
                result.Message = ex.Message;
                return Json(result, JsonRequestBehavior.AllowGet);
            }
        }
    }
}