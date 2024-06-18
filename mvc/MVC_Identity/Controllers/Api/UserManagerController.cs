using Microsoft.AspNetCore.Mvc;
using MVC_Identity.DTO;
using MVC_Identity.Repositories.Interface;


namespace MVC_Identity.Controllers.Api
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [ApiController]
    public class UserManagerController : ControllerBase
    {
        private readonly IAccountService _service;
        public UserManagerController(IAccountService service)
        {
            _service = service;
        }

        public JsonResult GetAll()
        {
            var usersList = _service.GetAll();
            return new JsonResult(usersList);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] RegistrationModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            var result = await _service.CreateAsync(model);
            if (result.Code == ResponseStatusCode.OK)
                return new JsonResult(new { success = true, message = result.Message });
            return new JsonResult(new { success = false, message = result.Message });
        }


        [HttpPut]
        public async Task<IActionResult> Update([FromBody] UserUpdateModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            var result = await _service.UpdateAsync(model);
            if (result.Code == ResponseStatusCode.OK)
                return new JsonResult(new { success = true, message = result.Message });
            return new JsonResult(new { success = false, message = result.Message });
        }

        [HttpDelete("{userId}")]
        public async Task<IActionResult> Delete([FromRoute] string userId)
        {
            if (string.IsNullOrEmpty(userId))
                return BadRequest();

            var result = await _service.DeleteAsync(userId);
            if (result.Code == ResponseStatusCode.OK)
                return new JsonResult(new { success = true, message = result.Message });
            return new JsonResult(new { success = false, message = result.Message });
        }
    }
}
