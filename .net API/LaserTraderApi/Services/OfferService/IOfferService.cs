using LaserTraderApi.Dtos;
using LaserTraderApi.Models;

namespace LaserTraderApi.Services
{
    public interface IOfferService
    {
        Task<Offer> CreateOffer(Offer offer);
        Task<WatchList> CreateWatchList(WatchList watchList);
        Task<WatchListProduct> CreateWatchListProduct(WatchListProduct watchListProduct);
        Task<WatchListProductOption> CreateWatchListProductOption(WatchListProductOption watchListProductOption);
        Task<bool> Unwatch(UnwatchRequest request);

        Task<Offer> UpdateOffer(Offer offer);
        Task<bool> DeleteWatchListProductOption(WatchListProductOption watchListProductOption);
        Task<WatchList> UpdateWatchList(int watchListId, int productId);
        Task<WatchListProduct> UpdateWatchListProduct(int watchListId, int productId);
        Task<List<WatchListProductOption>> UpdateWatchListProductOption(int watchListId, string[] productOptionIds);
    }
}
