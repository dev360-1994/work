using LaserTraderApi.Dtos;
using LaserTraderApi.Models;
using LaserTraderApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LaserTraderApi.Controllers
{
    //[Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly IProductService _productService;
        public ProductController(IProductService productService)
        {
            _productService = productService;
        }

        [HttpGet]
        [Route("")]
        public async Task<List<Product>> GetAllProducts(string type="")
        {
            return await _productService.GetAllProducts(type);
        }

        [HttpGet]
        [Route("active")]
        public async Task<List<SimpleProduct>> GetActiveSimpleProducts()
        {
            return await _productService.GetActiveProducts();
        }

        [HttpPost]
        [Route("")]
        public async Task<ActionResult<Product>> CreateProduct([FromForm] ProductRequest request)
        {
            var product = await _productService.CreateProduct(request);
            return product == null ? NotFound() : Ok(product);
        }

        [HttpGet]
        [Route("{productId}")]
        public async Task<ActionResult<Product>> GetProduct(int productId)
        {
            var product = await _productService.GetProduct(productId);
            return product == null ? NotFound() : Ok(product);
        }

        [HttpDelete]
        [Route("{productId}")]
        public async Task<ActionResult> DeleteProduct(int productId)
        {
            var isSuccess = await _productService.DeleteProduct(productId);
            return !isSuccess ? NotFound() : Ok();
        }

        [HttpPut]
        [Route("{productId}")]
        public async Task<ActionResult<Product>> UpdateProduct(int productId, [FromForm] ProductRequest request)
        {
            var product = await _productService.UpdateProduct(productId, request);
            return product == null ? NotFound() : Ok(product);
        }
    }
}
