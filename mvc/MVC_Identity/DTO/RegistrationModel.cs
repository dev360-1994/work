using System.ComponentModel.DataAnnotations;

namespace MVC_Identity.DTO
{
    public class RegistrationModel
    {
        public string? Id { get; set; }

        [Required]
        public string Name { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        public string UserName { get; set; }
        [Required]
        [RegularExpression(@"^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W).{7,}$", ErrorMessage = "Minimum length 7 and must contain 1 Uppercase letter, 1 Lowercase letter, 1 special character, 1 digit")]
        public string Password { get; set; }
        [Required]
        [Compare("Password")]
        public string PasswordConfirm { get; set; }

        [Required]
        public string Role { get; set; }
        public string? PhoneNumber { get; set; }
    }

    public class UserUpdateModel
    {
        public string? Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string UserName { get; set; }
        [Required]
        public string Role { get; set; }
        public string? PhoneNumber { get; set; }
    }
    public class ForgotPasswordModel
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
    public class ResetPasswordModel
    {
        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
        public string ConfirmPassword { get; set; }

        public string Email { get; set; }
        public string Token { get; set; }
    }
}
