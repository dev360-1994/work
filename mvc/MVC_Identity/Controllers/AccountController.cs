using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MVC_Identity.DTO;
using MVC_Identity.Repositories.Interface;
using System.Security.Claims;

namespace MVC_Identity.Controllers
{
    public class AccountController : Controller
    {
        private readonly IAccountService _accountService;
        private readonly IEmailSender _emailSenderService;

        public AccountController(IAccountService accountService, IEmailSender emailSenderService)
        {
            _accountService = accountService;
            _emailSenderService = emailSenderService;
        }

        #region login/registration
        public IActionResult Login()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> Login(LoginModel model)
        {
            if (!ModelState.IsValid)
                return View(model);
            var result = await _accountService.LoginAsync(model);
            if (result.Code == ResponseStatusCode.OK)
            {
                var user = await _accountService.FindByEmailAsync(model.Email);
                var userRole = await _accountService.GetUserRole(user);
                var claims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Name, user.UserName),
                        new Claim("Email", user.Email),
                        new Claim(ClaimTypes.Role, userRole),
                    };

                var claimsIdentity = new ClaimsIdentity(
                    claims, CookieAuthenticationDefaults.AuthenticationScheme);

                var authProperties = new AuthenticationProperties
                {
                    AllowRefresh = true,  // Allowing refresh of the authentication session
                    ExpiresUtc = DateTimeOffset.UtcNow.AddMinutes(30), // Setting the expiration time to 30 minutes from now
                    IsPersistent = true, // Persisting the authentication session across multiple requests
                    IssuedUtc = DateTimeOffset.UtcNow, // Setting the issuance time to the current time
                    RedirectUri = "/account/login" // Setting the redirect URI
                };

                await HttpContext.SignInAsync(
                    CookieAuthenticationDefaults.AuthenticationScheme,
                    new ClaimsPrincipal(claimsIdentity),
                    authProperties);


                return RedirectToAction("Display", "Dashboard");
            }
            else
                TempData["msg"] = result.Message;
            return RedirectToAction(nameof(Login));
        }

        public IActionResult Registration()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> Registration(RegistrationModel model)
        {
            if (!ModelState.IsValid)
                return View(model);

            var result = await _accountService.CreateAsync(model);
            TempData["msg"] = result.Message;
            return RedirectToAction(nameof(Registration));

        }
      
        [Authorize]
        public async Task<IActionResult> Logout()
        {
            await _accountService.LogoutAsync();
            // Clear the existing external cookie
            await HttpContext.SignOutAsync(
                CookieAuthenticationDefaults.AuthenticationScheme);
            return RedirectToAction(nameof(Login));
        }
        #endregion

        #region forgot password
        [HttpGet]
        public IActionResult ForgotPassword()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordModel forgotPasswordModel)
        {
            if (!ModelState.IsValid)
                return View(forgotPasswordModel);

            var user = await _accountService.FindByEmailAsync(forgotPasswordModel.Email);
            if (user == null)
            {
                TempData["msg"] = "User not found";
                return View(forgotPasswordModel);
            }
            var token = await _accountService.GeneratePasswordResetTokenAsync(user);
            var callback = Url.Action(nameof(ResetPassword), "Account", new { token, email = user.Email }, Request.Scheme);
            string resetPasswordLink = $"<a href={callback}>Click here to reset your password</a>";
            await _emailSenderService.SendMail(user.Email, "Reset password token", resetPasswordLink, true);
            return RedirectToAction(nameof(ForgotPasswordConfirmation));
        }

        public IActionResult ForgotPasswordConfirmation()
        {
            return View();
        }
        [HttpGet]
        public IActionResult ResetPassword(string token, string email)
        {
            var model = new ResetPasswordModel { Token = token, Email = email };
            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ResetPassword(ResetPasswordModel resetPasswordModel)
        {
            if (!ModelState.IsValid)
                return View(resetPasswordModel);

            var user = await _accountService.FindByEmailAsync(resetPasswordModel.Email);
            if (user == null)
                RedirectToAction(nameof(ResetPasswordConfirmation));

            var resetPassResult = await _accountService.ResetPasswordAsync(user, resetPasswordModel.Token, resetPasswordModel.Password);
            if (!resetPassResult.Succeeded)
            {
                foreach (var error in resetPassResult.Errors)
                {
                    ModelState.TryAddModelError(error.Code, error.Description);
                }

                return View();
            }

            return RedirectToAction(nameof(ResetPasswordConfirmation));
        }

        [HttpGet]
        public IActionResult ResetPasswordConfirmation()
        {
            return View();
        }
        #endregion
    }
}
