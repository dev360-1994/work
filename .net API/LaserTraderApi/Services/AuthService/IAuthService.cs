using LaserTraderApi.Dtos;

namespace LaserTraderApi.Services.AuthService
{
    public interface IAuthService
    {
        AuthResult Authenticate(AuthenticateRequest request);
        AuthResult GetNewAccessToken(TokenApiModel request);
    }
}
