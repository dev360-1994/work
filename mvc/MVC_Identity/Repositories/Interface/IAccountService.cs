using Microsoft.AspNetCore.Identity;
using MVC_Identity.Domain;
using MVC_Identity.DTO;

namespace MVC_Identity.Repositories.Interface
{
    public interface IAccountService
    {
        List<ApplicationUser> GetAll();
        Task<ApplicationUser> GetAsync(string userId);
        Task<ApplicationUser> FindByEmailAsync(string emailAddress);
        Task<string> GeneratePasswordResetTokenAsync(ApplicationUser user);
        
        Task<Status> CreateAsync(RegistrationModel model);
        Task<Status> UpdateAsync(UserUpdateModel model);
        Task<Status> DeleteAsync(string userId);
        Task<string> GetUserRole(ApplicationUser user);
        Task<Status> LoginAsync(LoginModel model);
        Task LogoutAsync();

        Task<IdentityResult> ResetPasswordAsync(ApplicationUser user, string token, string newPassword);
    }
}
