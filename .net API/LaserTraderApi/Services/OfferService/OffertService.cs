using LaserTraderApi.Dtos;
using LaserTraderApi.Models;
using Microsoft.EntityFrameworkCore;
using System;

namespace LaserTraderApi.Services
{
    public class OfferService : IOfferService
    {
        private readonly AppDbContext _dbContext;
        public OfferService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        
        public async Task<Offer> CreateOffer(Offer offer)
        {
            _dbContext.Offers.Add(offer);
            await _dbContext.SaveChangesAsync();
            return offer;
        }
       
        public async Task<WatchList> CreateWatchList(WatchList watchList)
        {
            _dbContext.WatchLists.Add(watchList);
            await _dbContext.SaveChangesAsync();
            return watchList;
        }

        public async Task<WatchListProduct> CreateWatchListProduct(WatchListProduct watchListProduct)
        {
            _dbContext.WatchListProducts.Add(watchListProduct);
            await _dbContext.SaveChangesAsync();
            return watchListProduct;
        }

        public async Task<WatchListProductOption> CreateWatchListProductOption(WatchListProductOption watchListProductOption)
        {
            _dbContext.WatchListProductOptions.Add(watchListProductOption);
            await _dbContext.SaveChangesAsync();
            return watchListProductOption;
        }


        public async Task<bool> Unwatch(UnwatchRequest request)
        {
            var watchlist = await _dbContext.WatchLists.Where(x => x.ProductId == request.ProductId && x.ContactId == request.ContactId).FirstOrDefaultAsync();
            if (watchlist != null)
            {
                watchlist.Active = false;
                return true;
            }
            else
            {
                return false;
            }
        }

        public async Task<Offer> UpdateOffer(Offer offer)
        {
            _dbContext.Offers.Update(offer);
            await _dbContext.SaveChangesAsync();
            return offer;
        }
       
        public async Task<bool> DeleteWatchListProductOption(WatchListProductOption watchListProductOption)
        {
            _dbContext.WatchListProductOptions.Remove(watchListProductOption);
            await _dbContext.SaveChangesAsync();
            return true;
        }

        public async Task<WatchList> UpdateWatchList(int watchListId, int productId)
        {
            var watchList = await _dbContext.WatchLists.FindAsync(watchListId);
            if (watchList != null)
            {
                watchList.ProductId = productId;
                watchList.UpdatedAt = DateTime.Now;

                _dbContext.WatchLists.Update(watchList);
                await _dbContext.SaveChangesAsync();
            }
            return watchList;
        }

        public async Task<WatchListProduct> UpdateWatchListProduct(int watchListId, int productId)
        {
            var watchListProduct = await _dbContext.WatchListProducts.Where(x => x.WatchListId == watchListId).FirstOrDefaultAsync();
            if (watchListProduct != null)
            {
                watchListProduct.ProductId = productId;
                _dbContext.WatchListProducts.Update(watchListProduct);
                await _dbContext.SaveChangesAsync();
            }
            return watchListProduct;
        }

        public async Task<List<WatchListProductOption>> UpdateWatchListProductOption(int watchListId, string[] productOptionIds)
        {
            var existingWatchListProductOptions = await _dbContext.WatchListProductOptions.Where(x => x.WatchListId == watchListId).ToListAsync();

            foreach (string watchlistProductOptionId in productOptionIds)
            {
                int productOptionId = int.Parse(watchlistProductOptionId);

                if (existingWatchListProductOptions != null && existingWatchListProductOptions.Any(x => x.ProductOptionId == productOptionId))
                    continue;
                //adding new ProductOptionId in watchlist if any
                await CreateWatchListProductOption(new WatchListProductOption
                {
                    ProductOptionId = productOptionId,
                    WatchListId = watchListId,
                });
            }
            //removing 
            foreach (var item in existingWatchListProductOptions)
            {
                if (!productOptionIds.Contains(item.ProductOptionId.ToString()))
                    await DeleteWatchListProductOption(item);
            }

            return existingWatchListProductOptions;
        }
    }
}
