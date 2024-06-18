using System.ComponentModel.DataAnnotations;

namespace LaserTraderApi.Dtos
{
    public class AuthenticateRequest
    {
        [Required]
        public string Username { get; set; }

        [Required]
        public string Password { get; set; }
    }

    public class TokenApiModel
    {
        [Required]
        public string? AccessToken { get; set; }
        [Required]
        public string? RefreshToken { get; set; }
    }

    public class AuthenticateResponse
    {
        public string Token { get; set; }

        public string RefreshToken { get; set; }
    }

    public class AuthResult
    {
        public int StatusCode { get; set; }
        public string ErrorMessage { get; set; }

        public AuthenticateResponse AuthenticateResponse { get; set; }
    }
}
