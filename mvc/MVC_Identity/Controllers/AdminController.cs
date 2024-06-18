using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MVC_Identity.DTO;
using MVC_Identity.Repositories.Interface;

namespace MVC_Identity.Controllers
{

    [Authorize(Roles = "admin")]
    public class AdminController : Controller
    {
        private readonly IAccountService _service;
        public AdminController(IAccountService service)
        {
            _service = service;
        }

        public async Task<IActionResult> Display()
        {
            return View();
        }

        public async Task<IActionResult> AddEditUser(string id = null)
        {
            if (string.IsNullOrEmpty(id))
                return View(new RegistrationModel());
            else
            {
                var userDetails = await _service.GetAsync(id);
                var mappedUser = new RegistrationModel
                {
                    Id = userDetails.Id,
                    Name = userDetails.Name,
                    UserName = userDetails.UserName,
                    Email = userDetails.Email,
                    PhoneNumber = userDetails.PhoneNumber,
                    Role = await _service.GetUserRole(userDetails),
                    Password = userDetails.PasswordHash,
                    PasswordConfirm = userDetails.PasswordHash,
                };
                return View(mappedUser);
            }
        }
    }
}
