using HotelManagment.Database_Model;
using HotelManagment.Models.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;

namespace HotelManagment.Helpers
{
    public class Common
    {
        HostelManagmentEntities entity = new HostelManagmentEntities();
        public string Encode(string encodeMe)
        {
            byte[] encoded = System.Text.Encoding.UTF8.GetBytes(encodeMe);
            return Convert.ToBase64String(encoded);
        }

        public string Decode(string decodeMe)
        {
            byte[] encoded = Convert.FromBase64String(decodeMe);
            return System.Text.Encoding.UTF8.GetString(encoded);
        }

        public User FindUserById(int id)
        {
            var user = (from usr in entity.Users where usr.Id == id select usr).FirstOrDefault();
            return user;
        }

        public User FindUserByEmail(string email)
        {
            var user = (from usr in entity.Users where usr.Email.ToLower().ToString() == email.ToLower().ToString() select usr).FirstOrDefault();
            return user;
        }

        public List<City> GetAllCities()
        {
            var cities = (from cty in entity.Cities select cty).ToList();
            return cities;
        }
        public List<State> GetAllStates()
        {
            var states = (from stat in entity.States select stat).ToList();
            return states;
        }
        public List<Country> GetAllCountries()
        {
            var countries = (from cntry in entity.Countries select cntry).ToList();
            return countries;
        }

        public List<Courses> GetAllCourses()
        {
            var courses = (from cors in entity.Courses select cors).ToList();
            return courses;
        }

        public void ManageLogs(int userId, String desc)
        {
            AccessLog log = new AccessLog();
            log.IpAddress = GetIPAddress();
            log.UserId = userId;
            log.Description = desc;
            log.Time = DateTime.Now;
            entity.AccessLogs.Add(log);
            entity.SaveChanges();
        }

        public string GetIPAddress()
        {
            string IPAddress = string.Empty;
            IPHostEntry Host = default(IPHostEntry);
            string Hostname = null;
            Hostname = System.Environment.MachineName;
            Host = Dns.GetHostEntry(Hostname);
            foreach (IPAddress IP in Host.AddressList)
            {
                if (IP.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork)
                {
                    IPAddress = Convert.ToString(IP);
                }
            }
            return IPAddress;
        }

        public UserModel Mapper(User user)
        {
            UserModel usermodel = new UserModel();
            usermodel.UserId = user.Id;
            usermodel.IsAdmin = user.IsAdmin;
            usermodel.IsActive = user.IsActive;
            usermodel.Email = user.Email;
            usermodel.FirstName = user.FirstName;
            usermodel.LastName = user.LastName;
            usermodel.IsProfileCompleted = user.IsProfileCompleted;
            usermodel.Dob = (Convert.ToDateTime(user.Dob)).ToString("dd/MM/yyyy");
            usermodel.Mobile = user.Mobile;
            usermodel.Gender = user.Gender;
            return usermodel;
        }

    }
}