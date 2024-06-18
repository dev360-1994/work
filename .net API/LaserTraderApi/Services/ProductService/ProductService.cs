using LaserTraderApi.Dtos;
using LaserTraderApi.Models;
using Microsoft.EntityFrameworkCore;

namespace LaserTraderApi.Services
{
    public class ProductService : IProductService
    {
        private readonly AppDbContext _dbContext;
        public ProductService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task<List<Product>> GetAllProducts(string type)
        {
            if (type == "inactive")
            {
                return await _dbContext.Products.Where(x => x.Active == false).ToListAsync();
            }
            else if (type == "active")
            {
                return await _dbContext.Products.Where(x => x.Active).ToListAsync();
            }
            else
            {
                return await _dbContext.Products.ToListAsync();
            }
            
        }
        public async Task<Product> CreateProduct(ProductRequest productRequest)
        {
            string productImage = null;
            if (productRequest.ProductImageFile  != null)
            {
                await UploadProductImage(productRequest.ProductImageFile);
                productImage = productRequest.ProductImageFile.FileName;
            }
            Product product = new()
            {
                Active = productRequest.Active,
                Type = productRequest.Type,
                Approved = productRequest.Approved,
                AskingPrice = productRequest.AskingPrice,
                Company = productRequest.Company,
                Description = productRequest.Description,
                EnergyOutput = productRequest.EnergyOutput,
                HighPrice = productRequest.HighPrice,
                MetaDescription = productRequest.MetaDescription,
                MetaKeywords = productRequest.MetaKeywords,
                MetaTitle = productRequest.MetaTitle,
                ProductImage = productImage,
                ProductName = productRequest.ProductName,
                ProductOptions = productRequest.ProductOptions,
                PulseLength = productRequest.PulseLength,
                VideoLink = productRequest.VideoLink,
                WaveLength = productRequest.WaveLength,
                InsertBy = productRequest.InsertBy,
                CreatedAt = DateTime.Now,
                UpdatedAt = DateTime.Now,
            };

            _dbContext.Products.Add(product);
            await _dbContext.SaveChangesAsync();
            return product;
        }

        private async Task UploadProductImage(IFormFile imgFile)
        {
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "products", imgFile.FileName);
            Directory.CreateDirectory(Path.GetDirectoryName(filePath));
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await imgFile.CopyToAsync(stream);
            }
        }
        public async Task<Product?> UpdateProduct(int productId, ProductRequest productRequest)
        {
            var product = await _dbContext.Products.FindAsync(productId);
            if (product != null)
            {
                string productImage = null;
                if (productRequest.ProductImageFile != null)
                {
                    await UploadProductImage(productRequest.ProductImageFile);
                    productImage = productRequest.ProductImageFile.FileName;
                }

                product.Active = productRequest.Active;
                product.Type = productRequest.Type;
                product.Description = productRequest.Description;
                product.EnergyOutput = productRequest.EnergyOutput;
                product.HighPrice = productRequest.HighPrice;
                product.MetaDescription = productRequest.MetaDescription;
                product.MetaKeywords = productRequest.MetaKeywords;
                product.MetaTitle = productRequest.MetaTitle;
                if (productImage != null)
                {
                    product.ProductImage = productImage;
                }
                
                product.ProductName = productRequest.ProductName;
                product.ProductOptions = productRequest.ProductOptions;
                product.PulseLength = productRequest.PulseLength;
                product.VideoLink = productRequest.VideoLink;
                product.Approved = productRequest.Approved;
                product.AskingPrice = productRequest.AskingPrice;
                product.WaveLength = productRequest.WaveLength;
                
                product.UpdatedAt = DateTime.Now;
                await _dbContext.SaveChangesAsync();
                return product;
            }
            else
            {
                return null;
            }
        }

        public async Task<Product?> GetProduct(int productId)
        {
            return await _dbContext.Products.FindAsync(productId);
        }

        public async Task<bool> DeleteProduct(int productId)
        {
            var product = await _dbContext.Products.FindAsync(productId);
            if (product != null)
            {
                _dbContext.Products.Remove(product);
                await _dbContext.SaveChangesAsync();
                return true;
            }
            else
            {
                return false;
            }
        }

        public async Task<List<SimpleProduct>> GetActiveProducts()
        {
            return await _dbContext.Products.Where(x => x.Active).Select(x => new SimpleProduct
            {
                ProductId = x.ProductId,
                Company = x.Company ?? "",
                ProductName = x.ProductName,
                AskingPrice = x.AskingPrice,
                Type = x.Type ?? "",
                WaveLength = x.WaveLength ?? "",
            }).ToListAsync();
        }
    }
}
