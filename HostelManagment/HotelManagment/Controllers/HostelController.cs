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
    public class HostelController : Controller
    {
        HostelManagmentEntities entity = new HostelManagmentEntities();
        Common helper = new Common();
        // GET: Hostel
        public ActionResult Index()
        {
            UserModel session = (UserModel)Session["CurrentUser"];
            if (session == null || !session.IsAdmin)
            {
                return RedirectToAction("Index", "Login");
            }
            var rooms = (from room in entity.HostelRooms orderby room.Id descending select room).ToList();

            return View(rooms);
        }

        public ActionResult AddRoom(int? Id)
        {
            UserModel session = (UserModel)Session["CurrentUser"];
            if (session == null || !session.IsAdmin)
            {
                return RedirectToAction("Index", "Login");
            }
            HostelRoom model = new HostelRoom();
            if (Id > 0)
            {
                model = (from room in entity.HostelRooms where room.Id == Id select room).FirstOrDefault();
            }
            return View(model);
        }
        
        [HttpPost]
        public JsonResult SaveRoom(HostelRoom model)
        {
            AjaxModel result = new AjaxModel();
            try
            {
                UserModel session = (UserModel)Session["CurrentUser"];
                if (model == null)
                {
                    result.Success = false;
                    result.Message = "Internal Server Error.";
                    return Json(result, JsonRequestBehavior.AllowGet);
                }
                var info = (from room in entity.HostelRooms where room.RoomNo == model.RoomNo select room).FirstOrDefault();

                if (info != null && model.Id == 0)
                {
                    result.Success = false;
                    result.Message = "Room Number already exist.";
                    return Json(result, JsonRequestBehavior.AllowGet);
                }
                result.Success = true;
                result.Message = model.Id == 0 ? "New Room Added Succesfully." : "Room Updated Successfully.";
                if (model.Id == 0)
                {
                    helper.ManageLogs(session.UserId, "New room added by " + session.FirstName + " " + session.LastName);
                }
                else
                {
                    info.RoomChangres = model.RoomChangres;
                    info.Description = model.Description;
                    info.NoOfBeds = model.NoOfBeds;
                    info.Floor = model.Floor;
                    helper.ManageLogs(session.UserId, "Room Number " + model.RoomNo + " updated by " + session.FirstName + " " + session.LastName);
                }
                entity.HostelRooms.Add(model);
                entity.SaveChanges();
                return Json(result, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.Message = ex.Message;
                return Json(result, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult RoomsRequest()
        {
            UserModel session = (UserModel)Session["CurrentUser"];
            if (session == null || !session.IsAdmin)
            {
                return RedirectToAction("Index", "Login");
            }
            var data = (from urr in entity.User_RoomRequest
                        join usr in entity.Users on urr.UserId equals usr.Id where urr.IsRoomAssigned== false && urr.CancelRequest ==false
                        select new RoomRequestModel
                        {
                            UserId =usr.Id,
                            FirstName = usr.FirstName,
                            LastName = usr.LastName,
                            Email = usr.Email,
                            Mobile = usr.Mobile,
                            Course = (from cor in entity.Courses where cor.Id == usr.User_Courses.FirstOrDefault().CourseId select cor.Name).FirstOrDefault(),
                            RequestId = urr.Id,
                            Budegt = urr.Budegt,
                            CheckIn = urr.CheckIn.ToString(),
                            Message = urr.Message
                        });
            return View(data);
        }


        public ActionResult AssignRoom(int requestId)
        {
            UserModel session = (UserModel)Session["CurrentUser"];
            if (session == null || !session.IsAdmin)
            {
                return RedirectToAction("Index", "Login");
            }
            RoomRequestModel roomrequestmodel = new RoomRequestModel();
            var request = (from req in entity.User_RoomRequest where req.Id == requestId select req).FirstOrDefault();
            var user = helper.FindUserById(request.UserId);
            var address = user.User_Address.Where(x => x.IsPrimary && x.UserId == request.UserId).FirstOrDefault();
            var city = (from ct in entity.Cities where ct.Id == address.CityId select ct.City1).FirstOrDefault();
            var state = (from stat in entity.States where stat.Id == address.StateId select stat.State1).FirstOrDefault();
            var country = (from cntry in entity.Countries where cntry.Id == address.CountryId select cntry.Country1).FirstOrDefault();
            var course = (from uc in entity.User_Courses
                          join c in entity.Courses on uc.CourseId equals c.Id
                          select c.Name).FirstOrDefault();
            var rooms = (from room in entity.HostelRooms select new RoomRequestModel.Rooms {
                Roomid = room.Id,
                RoomNo = room.RoomNo
            } ).ToList();

            roomrequestmodel.RequestId = requestId;
            roomrequestmodel.UserId = user.Id;
            roomrequestmodel.Email = user.Email;
            roomrequestmodel.FirstName = user.FirstName;
            roomrequestmodel.LastName = user.LastName;
            roomrequestmodel.Address = address.Address1 + " " + address.Address2 + " " + city + " " + state + ", " + country + " " + address.PostCode;
            roomrequestmodel.Mobile = user.Mobile;
            roomrequestmodel.Course = course;
            roomrequestmodel.RoomModel = rooms;
            roomrequestmodel.Budegt = user.User_RoomRequest.FirstOrDefault().Budegt;
            return View(roomrequestmodel);
        }

        [HttpGet]
        public JsonResult GetRoomInfo(int roomid)
        {
            AjaxModel result = new AjaxModel();
            try
            {
                var room = (from rom in entity.HostelRooms where rom.Id == roomid select rom).FirstOrDefault();
                if(room== null)
                {
                    result.Success = false;
                    result.Message = "Room info may be deleted or its mays be not empty.";
                    return Json(result, JsonRequestBehavior.AllowGet);
                      
                }
                var bedscount = (from ur in entity.User_Rooms where ur.RoomId == roomid select ur).Count();
                RoomInfoModel model = new RoomInfoModel();
                model.Id = roomid;
                model.NoOfBeds = room.NoOfBeds;
                model.Floor = room.Floor;
                model.Description = room.Description;
                model.RoomChangres = room.RoomChangres;
                model.RoomNo = room.RoomNo;
                model.VacantBeds = room.NoOfBeds - bedscount;
                
                return Json(model, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.Message = ex.Message;
                return Json(result, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult AssignRoomToUser(int roomId,int requestID,int roomno)
        {
            AjaxModel result = new AjaxModel();
            try
            {
                UserModel session = (UserModel)Session["CurrentUser"];
                var roomreq = (from req in entity.User_RoomRequest where req.Id == requestID && req.CancelRequest == false select req).FirstOrDefault();
                var user = helper.FindUserById(roomreq.UserId);
                if (roomreq== null)
                {
                    result.Success = false;
                    result.Message = "Internal server error. Please contact us.";
                    return Json(result, JsonRequestBehavior.AllowGet);
                }
                roomreq.IsRoomAssigned = true;

                User_Rooms room = new User_Rooms();
                room.UserId = roomreq.UserId;
                room.RoomId = roomId;
                entity.User_Rooms.Add(room);
                entity.SaveChanges();

                helper.ManageLogs(session.UserId, session.FirstName +" "+session.LastName +"has assigned the room no." +roomno +"to "+user.FirstName +" "+user.LastName );

                result.Success = true;
                result.Message = "Room assign to user successfully.";
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
        public JsonResult CancelRoomRequest(int requestId, string message)
        {
            AjaxModel result = new AjaxModel();
            try
            {
                UserModel session = (UserModel)Session["CurrentUser"];
                var roomreq = (from req in entity.User_RoomRequest where req.Id== requestId select req).FirstOrDefault();
                var useroom = (from room in entity.User_Rooms where room.UserId == roomreq.UserId select room).FirstOrDefault();
                if (roomreq == null)
                {
                    result.Success = false;
                    result.Message = "Internal server error. Please contact us.";
                    return Json(result, JsonRequestBehavior.AllowGet);
                }
                if(useroom != null)
                {
                    entity.User_Rooms.Remove(useroom);
                }
                roomreq.CancelRequest = true;
                roomreq.Message = message;
                entity.SaveChanges();
                helper.ManageLogs(session.UserId, session.FirstName + " " + session.LastName + "has cancelled the room request of " +useroom.UserId);
                result.Success = true;
                result.Message = "Room request canclled successfully.";
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