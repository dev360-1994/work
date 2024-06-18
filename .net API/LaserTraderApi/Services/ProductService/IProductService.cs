using LaserTraderApi.Dtos;
using LaserTraderApi.Models;

namespace LaserTraderApi.Services
{
    public interface IProductService
    {
        Task<List<Product>> GetAllProducts(string type);
        Task<Product> CreateProduct(ProductRequest productRequest);
        Task<Product?> GetProduct(int productId);
        Task<Product?> UpdateProduct(int productId, ProductRequest productRequest);
        Task<bool> DeleteProduct(int productId);

        Task<List<SimpleProduct>> GetActiveProducts();
    }
}
