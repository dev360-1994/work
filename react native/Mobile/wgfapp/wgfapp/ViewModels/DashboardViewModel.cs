using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows.Input;
using Acr.UserDialogs;
using wgfapp.BootstrapIcons;
using wgfapp.Common.Models;
using wgfapp.Interfaces;
using wgfapp.Messages;
using wgfapp.Service.Interfaces;
using Xamarin.Forms;
using wgfapp.Enums;

namespace wgfapp.ViewModels
{
    public class DashboardViewModel : BaseViewModel
    {
        private readonly INavigationService _navigationService;
        private readonly IPersistanceService _persistanceService;
        private readonly IUserService _userService;
        private readonly ITeamUsersService _teamUserService;
        private readonly IMessagingService _messagingService;

        private string _userName;
        private string _role;
        private string _selectedThemeName;
        private Color _selectedColor = Color.FromHex("#FF000000");

        private int _unreadMessageCount;
        private int _upcomingEventsCount;
        private int _pendingExchangeCount;
        private int _newlyAddedPlaylistCount;
        private int _lastViewedPlaylistCount;
        private int _upcomingPracticesCount;

        private bool _isVisibleMessageUnread;
        private bool _isVisibleCalendarDay;
        private bool _isVisibleCalendarWeek;
        private bool _isVisibleExchange;
        private bool _isVisiblePlaylist;

        private int _messageUnreadRow;
        private int _calendarDayRow;
        private int _calendarWeekRow;
        private int _exchangeRow;
        private int _playlistRow;


        private IList<UsersTeam> _teams;
        private UsersTeam _selectedTeam;

        private bool _isLightTheme;
        private bool _isChangeColorPopupVisible;

        private IconSource _themeIcon;

        private Team _teamInfo;

        private DashboardAlerts _dashboardAlerts;

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



        public string SelectedThemeName
        {
            get { return _selectedThemeName; }
            set { SetProperty(ref _selectedThemeName, value); }
        }

        public Color SelectedColor
        {
            get { return _selectedColor; }
            set { SetProperty(ref _selectedColor, value); }
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

        public IList<UsersTeam> Teams
        {
            get { return _teams; }
            set { SetProperty(ref _teams, value); }
        }

        public UsersTeam SelectedTeam
        {
            get { return _selectedTeam; }
            set { SetProperty(ref _selectedTeam, value); }
        }

        public bool IsLightTheme
        {
            get { return _isLightTheme; }
            set { SetProperty(ref _isLightTheme, value); }
        }

        public bool IsChangeColorPopupVisible
        {
            get { return _isChangeColorPopupVisible; }
            set { SetProperty(ref _isChangeColorPopupVisible, value); }
        }

        public IconSource ThemeIcon
        {
            get { return _themeIcon; }
            set { SetProperty(ref _themeIcon, value); }
        }

        public DashboardAlerts DashboardAlerts
        {
            get { return _dashboardAlerts; }
            set { SetProperty(ref _dashboardAlerts, value); }
        }

        public Team TeamInfo
        {
            get { return _teamInfo; }
            set { SetProperty(ref _teamInfo, value); }
        }

        public bool IsVisibleMessageUnread
        {
            get { return _isVisibleMessageUnread; }
            set { SetProperty(ref _isVisibleMessageUnread, value); }
        }

        public bool IsVisibleCalendarDay
        {
            get { return _isVisibleCalendarDay; }
            set { SetProperty(ref _isVisibleCalendarDay, value); }
        }

        public bool IsVisibleCalendarWeek
        {
            get { return _isVisibleCalendarWeek; }
            set { SetProperty(ref _isVisibleCalendarWeek, value); }
        }


        public bool IsVisibleExchange
        {
            get { return _isVisibleExchange; }
            set { SetProperty(ref _isVisibleExchange, value); }
        }

        public bool IsVisiblePlaylist
        {
            get { return _isVisiblePlaylist; }
            set { SetProperty(ref _isVisiblePlaylist, value); }
        }
        public int MessageUnreadRow
        {
            get { return _messageUnreadRow; }
            set { SetProperty(ref _messageUnreadRow, value); }
        }

        public int CalendarDayRow
        {
            get { return _calendarDayRow; }
            set { SetProperty(ref _calendarDayRow, value); }
        }

        public int CalendarWeekRow
        {
            get { return _calendarWeekRow; }
            set { SetProperty(ref _calendarWeekRow, value); }
        }


        public int ExchangeRow
        {
            get { return _exchangeRow; }
            set { SetProperty(ref _exchangeRow, value); }
        }

        public int PlaylistRow
        {
            get { return _playlistRow; }
            set { SetProperty(ref _playlistRow, value); }
        }
        public ICommand HelpCommand { get; private set; }
        public ICommand SwitchCommand { get; private set; }
        public ICommand SwitchTeamCommand { get; private set; }
        public ICommand ChangeColorCommand { get; private set; }
        public ICommand CloseChangeColorCommand { get; private set; }
        public ICommand SaveColorCommand { get; private set; }

        public ICommand MessageUnreadCommand { get; private set; }
        public ICommand CalendarCommand { get; private set; }
        public ICommand ExchangeCommand { get; private set; }
        public ICommand PlaylistCommand { get; private set; }

        public DashboardViewModel(INavigationService navigationService, IPersistanceService persistanceService, IUserService userService, ITeamUsersService teamUsersService, IMessagingService messagingService)
        {
            _navigationService = navigationService;
            _persistanceService = persistanceService;
            _userService = userService;
            _teamUserService = teamUsersService;
            _messagingService = messagingService;

            UserName = _persistanceService.UserInfo?.FirstName;
            Role = "Coach";
            UnreadMessageCount = 4;
            UpcomingEventsCount = 2;
            PendingExchangeCount = 3;
            NewlyAddedPlaylistCount = 3;
            LastViewedPlaylistCount = 5;
            UpcomingPracticesCount = 2;

            HelpCommand = new Command(NavigateOnHelp);
            SwitchCommand = new Command(SwitchThemes);
            SwitchTeamCommand = new Command(SwitchTeam);
            ChangeColorCommand = new Command(ChangeColor);
            CloseChangeColorCommand = new Command(CloseChangeColorPopup);
            SaveColorCommand = new Command(SaveColor);

            MessageUnreadCommand = new Command(NavigateToMessage);
            CalendarCommand = new Command(NavigateToCalendar);
            ExchangeCommand = new Command(NavigateToExchange);
            PlaylistCommand = new Command(NavigateToPlaylist);
        }

        public async void OnViewAppear()
        {
            UserDialogs.Instance.ShowLoading("Loading...");

            //var selectedColorHex = _persistanceService.SelectedColor;

            //if (string.IsNullOrEmpty(selectedColorHex))
            //    selectedColorHex = "#000000";

            //SelectedColor = Color.FromHex(selectedColorHex);
            //SetThemeIcon();

            // Add a code here that need to some async call.
            var userRoles = await _userService.GetUserRoles(_persistanceService.Token);
            if (userRoles == null || _persistanceService.UserInfo == null)
            {
                UserDialogs.Instance.HideLoading();
                return;
            }

            var userrole = userRoles.FirstOrDefault(x => x.RoleId == _persistanceService.UserInfo.UserRole);
            if (userrole != null)
                Role = userrole.RoleValue;

            var teams = await _userService.GetUserTeams(_persistanceService.UserInfo.UserId, _persistanceService.Token);
            Teams = teams;
            SelectedTeam = Teams.FirstOrDefault(x => x.DefaultTeam == 1);




            var themeColor = "#000000";
            bool isCorrectThemeColor = false;
            var rowNumber = 3;


            //team info
            var responseTeam = await _userService.GetTeamInfo(_persistanceService.UserInfo.TeamId, _persistanceService.UserInfo.UserId, _persistanceService.Token);
            TeamInfo = responseTeam;

            //dashboards alerts
            var responseDashboardAlerts = await _userService.GetDashboardAlertsStatus(_persistanceService.UserInfo.TeamId, _persistanceService.UserInfo.UserId, _persistanceService.Token);
            DashboardAlerts = responseDashboardAlerts;

            if (DashboardAlerts.MessagesUnread > 0)
            {
                IsVisibleMessageUnread = true;
                MessageUnreadRow = rowNumber++;
            }
            else
            {
                IsVisibleMessageUnread = false;
            }

            if (DashboardAlerts.CalendarDay > 0)
            {
                IsVisibleCalendarDay = true;
                CalendarDayRow = rowNumber++;
            }
            else
            {
                IsVisibleCalendarDay = false;
            }

            if (DashboardAlerts.CalendarWeek > 0)
            {
                IsVisibleCalendarWeek = true;
                CalendarWeekRow = rowNumber++;
            }
            else
            {
                IsVisibleCalendarWeek = false;
            }

            if (DashboardAlerts.ExchangeInbox > 0)
            {
                IsVisibleExchange = true;
                ExchangeRow = rowNumber++;
            }
            else
            {
                IsVisibleExchange = false;
            }

            if (DashboardAlerts.FileUpload > 0)
            {
                IsVisiblePlaylist = true;
                PlaylistRow = rowNumber++;
            }
            else
            {
                IsVisiblePlaylist = false;
            }
            //theme color selection
            var selectedColorHex = _persistanceService.SelectedColor;


            //_persistanceService.SelectedColor = selectedColorHex;
            string[] colorArray = { "#000000", "#6330CC", "#432475", "#224A8D", "#0D87B8", "#239D59", "#C84B2B", "#C3233D" };

            foreach (string x in colorArray)
            {
                if (themeColor.Contains(x))
                {
                    isCorrectThemeColor = true;
                }
            }


            if (string.IsNullOrEmpty(selectedColorHex))
                selectedColorHex = "#000000";

            SelectedColor = Color.FromHex(selectedColorHex);
            SetThemeIcon();




            UserDialogs.Instance.HideLoading();
        }
        private async void NavigateToMessage()
        {
            await _navigationService.NavigateToAsync(PageKey.Messenger, null, false);
        }
        private async void NavigateToCalendar()
        {
            await _navigationService.NavigateToAsync(PageKey.Calendar, null, false);
        }
        private async void NavigateToExchange()
        {
            await _navigationService.NavigateToAsync(PageKey.Exchange, null, false);
        }
        private async void NavigateToPlaylist()
        {
            await _navigationService.NavigateToAsync(PageKey.Playlists, null, false);
        }
        private async void NavigateOnHelp()
        {
            var parameters = new Dictionary<string, object>();
            parameters.Add("pageName", "Dashboard");

            await _navigationService.PushPopupAsync(Enums.PageKey.HelpPopup, parameters);
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
                        break;
                    case "Light":
                    default:
                        mergedDictionaries.Add(new Themes.DarkTheme());
                        _persistanceService.Theme = "Dark";
                        break;
                }

                SetThemeIcon();
            }
        }

        private async void SwitchTeam()
        {
            System.Diagnostics.Debug.WriteLine($"Switch Teams : {SelectedTeam?.TeamName}");
            if (SelectedTeam == null || _persistanceService.UserInfo == null || _persistanceService.UserInfo.TeamId == SelectedTeam.TeamId)
                return;

            try
            {
                UserDialogs.Instance.ShowLoading("Switching Team...");
                var switchTeamResponse = await _teamUserService.SwithTeam(_persistanceService.UserInfo.UserId, SelectedTeam.TeamId, _persistanceService.Token);
                UserDialogs.Instance.HideLoading();
                if (switchTeamResponse == null)
                {
                    UserDialogs.Instance.Alert("Some error occurred while switching team, Please try again.", "Switch Team", "Ok");
                    return;
                }

                UserInfo userInfo = _persistanceService.UserInfo;
                userInfo.TeamGuid = switchTeamResponse.TeamGuid.ToString();
                userInfo.TeamId = switchTeamResponse.TeamId;
                string teamName = Teams.FirstOrDefault(x => x.TeamId == switchTeamResponse.TeamId)?.TeamName;
                userInfo.TeamName = teamName;

                _persistanceService.UserInfo = userInfo;
                _messagingService.Send<TeamSwitchedMessage>(new TeamSwitchedMessage(switchTeamResponse.TeamId, switchTeamResponse.TeamGuid, teamName));
                UserDialogs.Instance.Alert("Team Switched Successfully.", "Switch Team", "Ok");
            }
            catch (Exception ex)
            {
                UserDialogs.Instance.HideLoading();
                System.Diagnostics.Debug.WriteLine($"Exception : {ex.Message}");
            }

        }

        private void ChangeColor()
        {
            IsChangeColorPopupVisible = true;
        }

        private void CloseChangeColorPopup()
        {
            IsChangeColorPopupVisible = false;
        }

        private void SaveColor()
        {
            _persistanceService.SelectedColor = SelectedColor.ToHex();
            IsChangeColorPopupVisible = false;
            App.SetNavigationBarColor();
            System.Diagnostics.Debug.WriteLine($"Selected Color : {SelectedColor.ToHex()}");
        }

        private void SetThemeIcon()
        {
            string appTheme = _persistanceService.Theme;
            switch (appTheme)
            {
                case "Dark":
                    ThemeIcon = new IconSource() { Icon = Icon.Sun, Color = Color.White, Size = 18 };
                    SelectedThemeName = "Light";
                    break;
                case "Light":
                default:
                    ThemeIcon = new IconSource() { Icon = Icon.MoonStars, Color = Color.Black, Size = 18 };
                    SelectedThemeName = "Dark";
                    break;
            }
        }
    }
}
