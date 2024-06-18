using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Input;
using wgfapp.Common.Models;
using wgfapp.Interfaces;
using wgfapp.Service.Interfaces;
using Xamarin.Forms;

namespace wgfapp.ViewModels
{
    public class HistoryViewModel : BaseViewModel
    {
        private readonly INavigationService _navigationService;
        private readonly IUserService _userProfileService;
        private readonly IPersistanceService _persistanceService;

        public ICommand HelpCommand { get; private set; }
        public ICommand SearchCommand { get; private set; }

        private IList<UserHistory> _statisticslists;
        public IList<UserHistory> Statisticslists
        {
            get { return _statisticslists; }
            set { SetProperty(ref _statisticslists, value); }
        }

        private IList<UserHistory> _copyStatisticslists;
        public IList<UserHistory> CopyStatisticslists
        {
            get { return _copyStatisticslists; }
            set { SetProperty(ref _copyStatisticslists, value); }
        }

        public HistoryViewModel(INavigationService navigationService, IPersistanceService persistanceService, IUserService userProfileService)
        {
            _navigationService = navigationService;
            _persistanceService = persistanceService;
            _userProfileService = userProfileService;
            HelpCommand = new Command(NavigateOnHelp);
            SearchCommand = new Command<string>(SearchData);
        }

        public async Task OnViewAppearAsync()
        {
            try
            {
                Acr.UserDialogs.UserDialogs.Instance.ShowLoading("Fetching user history...");

                BaseUserInfo baseUserInfo = new BaseUserInfo()
                {
                    TeamId = _persistanceService.UserInfo.TeamId,
                    UserId = _persistanceService.UserInfo.UserId,
                };

                var userHistory = await _userProfileService.GetUserHistory(baseUserInfo, _persistanceService.Token);
                Acr.UserDialogs.UserDialogs.Instance.HideLoading();
                if (userHistory != null && userHistory.Count > 0)
                {
                    Statisticslists = new List<UserHistory>();
                    CopyStatisticslists = new List<UserHistory>();
                    Statisticslists = userHistory;
                    CopyStatisticslists = userHistory;
                }
            }
            catch (Exception ex)
            {
                Acr.UserDialogs.UserDialogs.Instance.HideLoading();
                System.Diagnostics.Debug.WriteLine($"Error occurred : {ex.Message}");
            }
        }

        private async void NavigateOnHelp()
        {
            var parameters = new Dictionary<string, object>();
            parameters.Add("pageName", "History");

            await _navigationService.PushPopupAsync(Enums.PageKey.HelpPopup, parameters);
        }

        private void SearchData(string searchText)
        {
            if (string.IsNullOrWhiteSpace(searchText))
                Statisticslists = CopyStatisticslists;
            else
            {
                var filterData = CopyStatisticslists.Where(x => new[] { x.FullName.ToLower(), x.TeamName.ToLower(), x.ActivityId.ToString(), x.Category, x.Command.ToLower(), x.Details.ToLower(), x.CreatedDate.ToString() }.Any(s => s.Contains(searchText.ToLower()))).ToList();
                if (filterData != null)
                    Statisticslists = new List<UserHistory>(filterData);
                else
                    Statisticslists = new List<UserHistory>();
            }
        }
    }
}
