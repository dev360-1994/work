using LaserTraderApi.Dtos;
using LaserTraderApi.Services.AuthService;
using Microsoft.AspNetCore.Mvc;

namespace LaserTraderApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(ILogger<AuthController> logger, IAuthService authService)
        {
            _logger = logger;
            _authService = authService;
        }

        [HttpPost, Route("login")]
        public ActionResult<AuthenticateResponse> Login([FromBody] AuthenticateRequest request)
        {
            var response = _authService.Authenticate(request);
            if (response.StatusCode == 404)
            {
                return NotFound(new { Message = response.ErrorMessage });
            }
            else if (response.StatusCode == 401)
            {
                return Unauthorized(new { Message = response.ErrorMessage });
            }
            else
            {
                return Ok(response.AuthenticateResponse);
            }
        }

        [HttpPost]
        [Route("refresh")]
        public ActionResult<AuthenticateResponse> Refresh(TokenApiModel request)
        {
            var response = _authService.GetNewAccessToken(request);

            if (response.StatusCode == 401)
            {
                return Unauthorized(new { Message = response.ErrorMessage });
            }
            else
            {
                return Ok(response.AuthenticateResponse);
            }
        }

    }
}