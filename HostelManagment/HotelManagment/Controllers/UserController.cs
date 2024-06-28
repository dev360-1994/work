using HotelManagment.Database_Model;
using HotelManagment.Helpers;
using HotelManagment.Models;
using HotelManagment.Models.User;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace HotelManagment.Controllers
{
    public class UserController : Controller
    {
        HostelManagmentEntities entity = new HostelManagmentEntities();
        Common helper = new Common();

        public ActionResult Dashboard()
        {
            UserModel session = (UserModel)Session["CurrentUser"];
            if (session == null)
                return RedirectToAction("Index", "Login");

            var logs = (from log in entity.AccessLogs where log.UserId == session.UserId orderby log.Id descending select log).ToList();
            return View(logs);
        }

        // GET: User
        public ActionResult Index()
        {
            UserModel session = (UserModel)Session["CurrentUser"];
            if (session == null || !session.IsAdmin)
            {
                return RedirectToAction("Index", "Login");
            }
            var users = (from usr in entity.Users select usr).ToList();
            return View(users);
        }

        public ActionResult Profile(int? Id)
        {
            var sessionUser = CheckUserSession();
            if (sessionUser == null)
                return RedirectToAction("Index", "Login");

            UserModel model = new UserModel();
            User user = new User();
            if (Id == null || Id == 0)
            {
                user = helper.FindUserById(sessionUser.UserId);//(from usr in entity.Users where usr.Id == sessionUser.UserId select usr).FirstOrDefault();
            }
            else if (Id > 0 && sessionUser.IsAdmin)
            {
                user = helper.FindUserById(Convert.ToInt16(Id));//(from usr in entity.Users where usr.Id == Id select usr).FirstOrDefault();
            }
            else if (Id > 0 && !sessionUser.IsAdmin)
            {
                return RedirectToAction("Index", "Login");
            }
            model = helper.Mapper(user);
            model.Countries = (from cntry in entity.Countries select cntry).ToList();
            model.State = (from state in entity.States select state).ToList();
            model.Cities = (from city in entity.Cities select city).ToList();
            var address = (from add in entity.User_Address where add.UserId == model.UserId && add.IsPrimary == true select add).FirstOrDefault(); //user.User_Address.Where(x => x.IsPrimary == true).FirstOrDefault();
            if (address != null)
            {
                model.AddressId = address.Id;
                model.Address1 = address.Address1;
                model.Address2 = address.Address2;
                model.PostCode = address.PostCode;
                model.CityId = address.CityId;
                model.StateId = address.StateId;
                model.CountryId = address.CountryId;
                model.IsPrimary = address.IsPrimary;
            }
            return View(model);
        }
        

        public ActionResult AddUser(int? Id)
        {
            var sessionUser = CheckUserSession();
            if (sessionUser == null || !sessionUser.IsAdmin)
                return RedirectToAction("Index", "Login");

            UserModel model = new UserModel();
            if (Id > 0)
            {
                User user = helper.FindUserById(Convert.ToInt16(Id));
                model = helper.Mapper(user);
            }
            return View(model);
        }

        public ActionResult GetRoomDetails()
        {
            UserModel sessionUser = CheckUserSession();
            if (sessionUser == null)
                return RedirectToAction("Index", "Login");

            RoomBookedDetails model = new RoomBookedDetails();

            #region Getting info from database
            var user = helper.FindUserById(sessionUser.UserId);
            var cities = helper.GetAllCities();
            var states = helper.GetAllStates();
            var countries = helper.GetAllCountries();
            var course = helper.GetAllCourses();
            var userRoomReq = user.User_RoomRequest.FirstOrDefault();
            var userRoom = user.User_Rooms.FirstOrDefault();
            var userCourse = user.User_Courses.FirstOrDefault();
            var roomInfo = (from room in entity.HostelRooms where room.Id == userRoom.RoomId select room).FirstOrDefault();
            #endregion

            #region Binidng infor into view model
            model.UserId = sessionUser.UserId;
            model.FirstName = user.FirstName;
            model.LastName = user.LastName;
            model.Gender = user.Gender;
            model.Dob = (Convert.ToDateTime(user.Dob)).ToString("dd/MM/yyyy");
            model.Mobile = user.Mobile;
            model.Course = course.Where(x => x.Id == userCourse.CourseId).Select(x => x.Name).FirstOrDefault();
            model.AddressList = new List<RoomBookedDetails.Address>();
            foreach (var add in user.User_Address)
            {
                var temp = new RoomBookedDetails.Address();
                temp.Address1 = add.Address1;
                temp.Address2 = add.Address2;
                temp.Address2 = add.Address2;
                temp.City = cities.Where(x => x.Id == add.CityId).Select(x => x.City1).FirstOrDefault();
                temp.State = states.Where(x => x.Id == add.StateId).Select(x => x.State1).FirstOrDefault();
                temp.Country = countries.Where(x => x.Id == add.CountryId).Select(x => x.Country1).FirstOrDefault();
                temp.PostCode = add.PostCode;
                temp.GuradianMobile = add.Mobile;
                temp.IsPrimary = add.IsPrimary;
                model.AddressList.Add(temp);
            }
            model.RoomNo = roomInfo.RoomNo;
            model.RoomChangres = roomInfo.RoomChangres;
            model.CheckIn = (Convert.ToDateTime(userRoomReq.CheckIn)).ToString("dd/MM/yyyy");
            model.Floor = roomInfo.Floor;
            model.Description = roomInfo.Description;
            #endregion

            return View(model);
        }

        [HttpPost]
        public JsonResult CreateUser(int Id, string email, string name, string password, string mobile, bool IsActive, bool IsAdmin)
        {
            AjaxModel model = new AjaxModel();
            try
            {
                UserModel session = (UserModel)Session["CurrentUser"];
                var existuser = helper.FindUserByEmail(email);
                if (existuser != null && Id==0)
                {
                    model.Success = false;
                    model.Message = "Email already exist in database.";
                    return Json(model, JsonRequestBehavior.AllowGet);
                }
                User user = new User();
                if (Id > 0)
                {
                    user = helper.FindUserById(Id);
                }
                user.FirstName = name;

                user.Email = email;
                user.IsProfileCompleted = false;
                user.CreatedOn = DateTime.Now;
                user.IsActive = IsActive;
                user.IsAdmin = IsAdmin;
                user.Mobile = mobile;
                if (Id == 0)
                {
                    user.Password = helper.Encode(password);
                    entity.Users.Add(user);
                }
                entity.SaveChanges();
                helper.ManageLogs(session.UserId, "New User Created by " + session.FirstName + " " + session.LastName);
                model.Success = true;
                model.Message = Id == 0 ? "New user has been created successfully." : "User has been updated successfully.";
                return Json(model, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                model.Success = false;
                model.Message = ex.Message;
                return Json(model, JsonRequestBehavior.AllowGet);
            }
        }

        //[HttpPost]
        //public JsonResult UpdateUser(UserModel model)
        //{
        //}

        [HttpPost]
        public JsonResult UpdateProfile(UserModel model)
        {
            AjaxModel result = new AjaxModel();
            try
            {
                var user = helper.FindUserById(model.UserId);
                if (user == null)
                {
                    result.Success = false;
                    result.Message = "User account not found. Please contact administrator.";
                    return Json(result, JsonRequestBehavior.AllowGet);
                }

                user.FirstName = model.FirstName;
                user.LastName = model.LastName;
                user.IsActive = user.IsAdmin ? model.IsActive : user.IsActive;
                user.IsAdmin = user.IsAdmin ? model.IsAdmin : user.IsAdmin;
                user.Mobile = model.Mobile;
                CultureInfo provider = CultureInfo.InvariantCulture;
                user.Dob = DateTime.ParseExact(model.Dob, "mm/dd/yyyy", provider);
                user.IsProfileCompleted = true;//model.AddressId == 0 ? true : user.IsProfileCompleted;
                user.Gender = model.Gender;
                model.IsProfileCompleted = true;
                Session["CurrentUser"] = model;
                User_Address address = new User_Address();
                if (model.AddressId > 0)
                {
                    address = (from add in entity.User_Address where add.Id == model.AddressId select add).FirstOrDefault();
                }
                address.IsPrimary = model.AddressId == 0 ? true : address.IsPrimary;
                address.PostCode = model.PostCode;
                address.Address1 = model.Address1;
                address.UserId = model.UserId;
                address.Address2 = model.Address2;
                address.CityId = model.CityId;
                address.StateId = model.StateId;
                address.CountryId = model.CountryId;

                if (model.AddressId == 0)
                {
                    entity.User_Address.Add(address);
                }
                entity.SaveChanges();
                helper.ManageLogs(model.UserId, "Profile updated by user.");
                result.Success = true;
                result.Message = "Profile updated successfully.";
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.Message = ex.Message;
                return Json(result, JsonRequestBehavior.AllowGet);
            }

        }

        public ActionResult HostelBooking()
        {
            var sessionuser = CheckUserSession();
            if (sessionuser == null)
                return RedirectToAction("Index", "Login");

            UserModel usermodel = new UserModel();
            var roomreq = (from req in entity.User_RoomRequest where req.UserId == sessionuser.UserId orderby req.Id descending select req).FirstOrDefault();
            if (roomreq != null)
            {
                usermodel.IsRoomRequested = true;
                usermodel.CancelRequest = roomreq.CancelRequest;
                usermodel.RooomAssigned = roomreq.IsRoomAssigned;
                usermodel.CancelMessage = roomreq.Message;
            }
            else
            {
                var user = helper.FindUserById(sessionuser.UserId);
                usermodel = helper.Mapper(user);
                usermodel.Countries = (from cntry in entity.Countries select cntry).ToList();
                usermodel.State = (from state in entity.States select state).ToList();
                usermodel.Cities = (from city in entity.Cities select city).ToList();
                usermodel.AllCourses = (from cors in entity.Courses where cors.IsActive == true select cors).ToList();
                var address = (from add in entity.User_Address where add.UserId == user.Id && add.IsPrimary == false select add).FirstOrDefault(); //user.User_Address.Where(x => x.IsPrimary == true).FirstOrDefault();
                if (address != null)
                {
                    usermodel.AddressId = address.Id;
                    usermodel.Address1 = address.Address1;
                    usermodel.Address2 = address.Address2;
                    usermodel.PostCode = address.PostCode;
                    usermodel.CityId = address.CityId;
                    usermodel.StateId = address.StateId;
                    usermodel.CountryId = address.CountryId;
                    usermodel.IsPrimary = address.IsPrimary;
                }
            }
            return View(usermodel);
        }

        [HttpPost]
        public JsonResult SaveHostelRequest(int userId, int courseId, int budget, string checkin, int addressid, string address1, string address2, string guardianmobile, int city, int state, int country, string postcode)
        {
            AjaxModel result = new AjaxModel();
            try
            {
                User_RoomRequest roomrequest = new User_RoomRequest();
                roomrequest.UserId = userId;
                roomrequest.Budegt = budget;
                roomrequest.IsRoomAssigned = false;
                roomrequest.CancelRequest = false;
                roomrequest.Message = string.Empty;
                roomrequest.CheckIn = Convert.ToDateTime(checkin);
                entity.User_RoomRequest.Add(roomrequest);

                User_Courses usercourse = new User_Courses();
                usercourse.CourseId = courseId;
                usercourse.UserId = userId;
                entity.User_Courses.Add(usercourse);

                if (addressid == 0)
                {
                    User_Address address = new User_Address();
                    address.IsPrimary = false;
                    address.PostCode = postcode.ToString();
                    address.Address1 = address1;
                    address.UserId = userId;
                    address.Address2 = address2;
                    address.CityId = city;
                    address.StateId = state;
                    address.CountryId = country;
                    address.Mobile = guardianmobile;
                    entity.User_Address.Add(address);
                }
                helper.ManageLogs(userId, "User has requested for room booking in hostel.");
                entity.SaveChanges();
                result.Success = true;
                result.Message = "Your hostel room request has been submitted. Please wait for further response.";
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.Message = ex.Message;
                return Json(result, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult ChangePassword()
        {
            var user = CheckUserSession();
            if (user == null)
                return RedirectToAction("Index", "Login");

            TempData["UserId"] = user.UserId.ToString();
            return View();
        }

        [HttpPost]
        public ActionResult UpdatePassword(string Id, string old, string newpass)
        {
            AjaxModel result = new AjaxModel();
            int userid = 0;
            try
            {
                userid = Convert.ToInt16(Id);
                var user = helper.FindUserById(userid);
                userid = user.Id;
                if (helper.Decode(user.Password) != old)
                {
                    helper.ManageLogs(user.Id, "old password mismatch while updating it with new password..");
                    result.Success = false;
                    result.Message = "Old Password is not correct";
                    return Json(result, JsonRequestBehavior.AllowGet);
                }
                user.Password = helper.Encode(newpass);
                entity.SaveChanges();
                helper.ManageLogs(user.Id, "Password updated on " + DateTime.Now);
                result.Success = true;
                result.Message = user.IsAdmin ? "Admin" : "User";
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

        private UserModel CheckUserSession()
        {
            var user = (UserModel)Session["CurrentUser"];
            return user;
        }
    }
}