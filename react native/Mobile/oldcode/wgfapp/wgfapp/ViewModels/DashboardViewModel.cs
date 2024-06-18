using System;
using System.Linq;
using System.Collections.Generic;
using System.Windows.Input;
using DevExpress.XamarinForms.Core.Themes;
using wgfapp.Interfaces;
using wgfapp.Service.Interfaces;
using Xamarin.Forms;

namespace wgfapp.ViewModels
{
    public class DashboardViewModel : BaseViewModel
    {
        private readonly INavigationService _navigationService;
        private readonly IPersistanceService _persistanceService;
        private readonly IUserService _userService;

        private string _userName;
        private string _role;
        private int _unreadMessageCount;
        private int _upcomingEventsCount;
        private int _pendingExchangeCount;
        private int _newlyAddedPlaylistCount;
        private int _lastViewedPlaylistCount;
        private int _upcomingPracticesCount;

        private IList<string> _titles;
        private string _selectedTitle;

        public string UserName
        {
            get { return _userName; }
            set { SetProperty(ref _userName, value); }
        }

        public string Role
        {
            get { return _role; }
            set { SetProperty(ref _role, value); }
        }

        public int UnreadMessageCount
        {
            get { return _unreadMessageCount; }
            set { SetProperty(ref _unreadMessageCount, value); }
        }

        public int UpcomingEventsCount
        {
            get { return _upcomingEventsCount; }
            set { SetProperty(ref _upcomingEventsCount, value); }
        }

        public int PendingExchangeCount
        {
            get { return _pendingExchangeCount; }
            set { SetProperty(ref _pendingExchangeCount, value); }
        }

        public int NewlyAddedPlaylistCount
        {
            get { return _newlyAddedPlaylistCount; }
            set { SetProperty(ref _newlyAddedPlaylistCount, value); }
        }

        public int LastViewedPlaylistCount
        {
            get { return _lastViewedPlaylistCount; }
            set { SetProperty(ref _lastViewedPlaylistCount, value); }
        }

        public int UpcomingPracticesCount
        {
            get { return _upcomingPracticesCount; }
            set { SetProperty(ref _upcomingPracticesCount, value); }
        }

        public IList<string> Titles
        {
            get { return _titles; }
            set { SetProperty(ref _titles, value); }
        }

        public string SelectedTitle
        {
            get { return _selectedTitle; }
            set { SetProperty(ref _selectedTitle, value); }
        }

        public ICommand HelpCommand { get; private set; }
        public ICommand SwitchCommand { get; private set; }

        public DashboardViewModel(INavigationService navigationService, IPersistanceService persistanceService, IUserService userService)
        {
            _navigationService = navigationService;
            _persistanceService = persistanceService;
            _userService = userService;

            UserName = _persistanceService.UserInfo?.FirstName;
            Role = "Coach";
            UnreadMessageCount = 4;
            UpcomingEventsCount = 2;
            PendingExchangeCount = 3;
            NewlyAddedPlaylistCount = 3;
            LastViewedPlaylistCount = 5;
            UpcomingPracticesCount = 2;
            Titles = new List<string>() { "Title 1", "Title 2", "Title 3", "Title 4" };
            
            HelpCommand = new Command(NavigateOnHelp);
            SwitchCommand = new Command(SwitchThemes);
        }

        private async void NavigateOnHelp()
        {
            var parameters = new Dictionary<string, object>();
            parameters.Add("pageName", "Dashboard");

            await _navigationService.PushPopupAsync(Enums.PageKey.HelpPopup, parameters);
        }

        public async void OnViewAppear()
        {
            // Add a code here that need to some async call.
            var userRoles = await _userService.GetUserRoles(_persistanceService.Token);
            if (userRoles == null || _persistanceService.UserInfo == null)
                return;

            var userrole = userRoles.FirstOrDefault(x => x.RoleId == _persistanceService.UserInfo.UserRole);
            if (userrole != null)
                Role = userrole.RoleValue;
        }

        private void SwitchThemes()
        {
            string appTheme = _persistanceService.Theme;
            ICollection<ResourceDictionary> mergedDictionaries = Application.Current.Resources.MergedDictionaries;
            if (mergedDictionaries != null)
            {
                mergedDictionaries.Clear();
                switch (_persistanceService.Theme)
                {
                    case "Dark":
                        mergedDictionaries.Add(new Themes.LightTheme());
                        _persistanceService.Theme = "Light";
                        ThemeManager.ThemeName = Theme.Light;
                        break;
                    case "Light":
                    default:
                        mergedDictionaries.Add(new Themes.DarkTheme());
                        _persistanceService.Theme = "Dark";
                        ThemeManager.ThemeName = Theme.Dark;
                        break;
                }
            }
        }
    }
}
