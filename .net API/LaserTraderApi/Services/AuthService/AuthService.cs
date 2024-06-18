using LaserTraderApi.Dtos;
using LaserTraderApi.Models;
using LaserTraderApi.Services.TokenService;
using Microsoft.Extensions.Options;
using System;
using System.Security.Claims;

namespace LaserTraderApi.Services.AuthService
{
    public class AuthService: IAuthService
    {
        private readonly AppDbContext _dbContext;
        private readonly ITokenService _tokenService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly AppSettings _appSettings;

        public AuthService(AppDbContext dBContext, ITokenService tokenService, IHttpContextAccessor httpContextAccessor, IOptions<AppSettings> options)
        {
            _dbContext = dBContext;
            _tokenService = tokenService;
            _httpContextAccessor = httpContextAccessor;
            _appSettings = options.Value;
        }
        public AuthResult Authenticate(AuthenticateRequest request)
        {
            var user = _dbContext.Users.SingleOrDefault(x => x.Username == request.Username);
            if (user == null)
            {
                return new AuthResult
                {
                    StatusCode = 404,
                    ErrorMessage = "Username does not exists"
                };
            }
            else if (user.Password != request.Password)
            {
                return new AuthResult
                {
                    StatusCode = 401,
                    ErrorMessage = "Username and password is incorrect"
                };
            }
            else
            {
                var claims = new List<Claim>
                {
                    new Claim("userId", user.UserId.ToString()),
                };
                var accessToken = _tokenService.GenerateAccessToken(claims);
                var refreshToken = _tokenService.GenerateRefreshToken();

                // save refreshToken and expiryTime
                user.RefreshToken = refreshToken;
                user.RefreshTokenExpiryTime = DateTime.Now.AddDays(_appSettings.JwtRefreshExpireDays);
                _dbContext.SaveChanges();

                return new AuthResult
                {
                    StatusCode = 200,
                    AuthenticateResponse = new AuthenticateResponse
                    {
                        Token = accessToken,
                        RefreshToken = refreshToken
                    }
                };
            }
        }

        public AuthResult GetNewAccessToken(TokenApiModel request)
        {
            string accessToken = request.AccessToken;
            string refreshToken = request.RefreshToken;

            var principal = _tokenService.GetPrincipalFromExpiredToken(accessToken);
            var userId = Int32.Parse(principal.Claims.First(x => x.Type == "userId").Value);

            var user = _dbContext.Users.SingleOrDefault(u => u.UserId == userId);

            if (user == null || user.RefreshToken != refreshToken || user.RefreshTokenExpiryTime <= DateTime.Now)
                return new AuthResult
                {
                    StatusCode = 401,
                    ErrorMessage = "Invalid RefreshToken is provided"
                };

            var newAccessToken = _tokenService.GenerateAccessToken(principal.Claims);
            var newRefreshToken = _tokenService.GenerateRefreshToken();

            user.RefreshToken = newRefreshToken;
            user.RefreshTokenExpiryTime = DateTime.Now.AddDays(_appSettings.JwtRefreshExpireDays);
            _dbContext.SaveChanges();

            return new AuthResult
            {
                StatusCode = 200,
                AuthenticateResponse = new AuthenticateResponse
                {
                    Token = accessToken,
                    RefreshToken = refreshToken
                }
            };
        }

    }
}
