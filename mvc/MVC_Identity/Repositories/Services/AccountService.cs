using Microsoft.AspNetCore.Identity;
using MVC_Identity.Domain;
using MVC_Identity.DTO;
using MVC_Identity.Repositories.Interface;
using System.Security.Claims;

namespace MVC_Identity.Repositories.Services
{
    public class AccountService : IAccountService
    {
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public AccountService(SignInManager<ApplicationUser> signInManager, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _roleManager = roleManager;
        }
        public async Task<Status> CreateAsync(RegistrationModel model)
        {
            var response = new Status();
            var userExists = await _userManager.FindByNameAsync(model.UserName);
            if (userExists != null)
            {
                response.Code = ResponseStatusCode.BadRequest;
                response.Message = "User Already Exists";
                return response;
            }
            ApplicationUser user = new ApplicationUser
            {
                SecurityStamp = Guid.NewGuid().ToString(),
                Name = model.Name,
                Email = model.Email,
                UserName = model.UserName,
                EmailConfirmed = true,
                PhoneNumber = model.PhoneNumber,
            };
            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
            {
                response.Code = ResponseStatusCode.BadRequest;
                response.Message = "User creation failed";
                return response;
            }
            //role management 
            if (!await _roleManager.RoleExistsAsync(model.Role))
                await _roleManager.CreateAsync(new IdentityRole(model.Role));

            if (await _roleManager.RoleExistsAsync(model.Role))
            {
                await _userManager.AddToRoleAsync(user, model.Role);
            }

            response.Code = ResponseStatusCode.OK;
            response.Message = "User has been registered successfully";
            return response;

        }

        public async Task<Status> UpdateAsync(UserUpdateModel model)
        {
            var response = new Status();
            var userDetails = await _userManager.FindByIdAsync(model.Id);
            if (userDetails == null)
            {
                response.Code = ResponseStatusCode.BadRequest;
                response.Message = "User doesn't Exists";
                return response;
            }
                userDetails.Name = model.Name;
                userDetails.UserName = model.UserName;
                userDetails.PhoneNumber = model.PhoneNumber;
             
            var result = await _userManager.UpdateAsync(userDetails);
            if (!result.Succeeded)
            {
                response.Code = ResponseStatusCode.BadRequest;
                response.Message = "User updation failed";
                return response;
            }
            //role management 
            if (!await _roleManager.RoleExistsAsync(model.Role))
                await _roleManager.CreateAsync(new IdentityRole(model.Role));

            if (await _roleManager.RoleExistsAsync(model.Role))
            {
                await _userManager.AddToRoleAsync(userDetails, model.Role);
            }

            response.Code = ResponseStatusCode.OK;
            response.Message = "User has been updated successfully";
            return response;

        }


        public async Task<Status> LoginAsync(LoginModel model)
        {
            var response = new Status();
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
            {
                response.Code = ResponseStatusCode.UserNotFound;
                response.Message = "Invalid username";
                return response;
            }
            // validate password

            if (!await _userManager.CheckPasswordAsync(user, model.Password))
            {
                response.Code = ResponseStatusCode.InvalidPassword;
                response.Message = "Invalid password";
                return response;
            }

            var signInResult = await _signInManager.PasswordSignInAsync(user, model.Password, false, true);
            if (signInResult.Succeeded)
            {
                // Add Roles
                var userRoles = await _userManager.GetRolesAsync(user);
                var authClaims = new List<Claim> { new Claim(ClaimTypes.Name, user.UserName) };
                foreach (var role in userRoles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, role.ToString()));
                }
                response.Code = ResponseStatusCode.OK;
                response.Message = "Logged in successfully";
                return response;
            }
            else if (signInResult.IsLockedOut)
            {
                response.Code = ResponseStatusCode.BadRequest;
                response.Message = "User locked out";
                return response;
            }
            else
            {
                response.Code = ResponseStatusCode.InternalServerError;
                response.Message = "Error on logging in";
                return response;
            }
        }

        public async Task LogoutAsync()
        {
            await _signInManager.SignOutAsync();
        }

        public List<ApplicationUser> GetAll()
        {
            return _userManager.Users.ToList();
        }
        public async Task<ApplicationUser> GetAsync(string userId)
        {
            return await _userManager.FindByIdAsync(userId);
        }
        public async Task<ApplicationUser> FindByEmailAsync(string emailAddress)
        {
            return await _userManager.FindByEmailAsync(emailAddress);
        }
        public async Task<string> GeneratePasswordResetTokenAsync(ApplicationUser user)
        {
            return await _userManager.GeneratePasswordResetTokenAsync(user);
        }
        public async Task<string> GetUserRole(ApplicationUser user)
        {
            var userRoles = await _userManager.GetRolesAsync(user);
            return userRoles != null ? userRoles.FirstOrDefault(): string.Empty;
        }

        public async Task<Status> DeleteAsync(string userId)
        {
            var response = new Status();
            var user = await _userManager.FindByIdAsync(userId);
            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                response.Code = ResponseStatusCode.BadRequest;
                response.Message = "User deletion failed";
                return response;
            }
            response.Code = ResponseStatusCode.OK;
            response.Message = "User deleted successfully";
            return response;
        }

        public async Task<IdentityResult> ResetPasswordAsync(ApplicationUser user, string token, string newPassword)
        {
            return await _userManager.ResetPasswordAsync(user, token, newPassword);
        }
    }
}
