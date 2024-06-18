using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Threading.Tasks;
using System.Windows.Input;
using wgfapp.Interfaces;
using wgfapp.Models;
using wgfapp.Views;
using Xamarin.Forms;

namespace wgfapp.ViewModels
{
    public class MenusGroupViewModel : BaseViewModel
    {
        private readonly INavigationService _navigationService;
        private readonly IPersistanceService _persistanceService;

        private GroupedMenu _oldSubMenus;
        private ObservableCollection<GroupedMenu> items;
        private SubMenu _selectedSubMenu;

        public ObservableCollection<GroupedMenu> Items
        {
            get => items;
            set => SetProperty(ref items, value);
        }

        public SubMenu SelectedSubMenu
        {
            get { return _selectedSubMenu; }
            set { SetProperty(ref _selectedSubMenu, value); }
        }

        public ICommand MenuItemSelectedCommand { get; private set; }
        public ICommand LoadMenusCommand { get; private set; }
        public ICommand RefreshItemsCommand { get; private set; }

        public MenusGroupViewModel(INavigationService navigationService, IPersistanceService persistanceService)
        {
            _navigationService = navigationService;
            _persistanceService = persistanceService;

            Items = new ObservableCollection<GroupedMenu>();

            MenuItemSelectedCommand = new Command(MenuItemSelected);
            LoadMenusCommand = new Command(ExecuteLoadItemsCommand);
            RefreshItemsCommand = new Command<GroupedMenu>(ExecuteRefreshItemsCommand);
        }

        public void OnViewAppear()
        {
            LoadMenuItems();
        }

        private void MenuItemSelected()
        {
            if (SelectedSubMenu == null)
                return;

            System.Diagnostics.Debug.WriteLine($"Menu Item Selected : {SelectedSubMenu}");
            if(SelectedSubMenu.PageKey == Enums.PageKey.Logout)
            {
                _persistanceService.UserEmail = string.Empty;
                _persistanceService.Password = string.Empty;
                _persistanceService.IsLoggedIn = false;

                _navigationService.NavigateToFirstScreenAsync();
            }
            else
            {
                _navigationService.NavigateAsDetailPageOfMasterPage(SelectedSubMenu.PageKey);
            }

            SelectedSubMenu = null;
        }

        private void ExecuteLoadItemsCommand()
        {
            LoadMenuItems();
        }

        private void ExecuteRefreshItemsCommand(GroupedMenu item)
        {
            if (_oldSubMenus == item)
            {
                // click twice on the same item will hide it
                item.Expanded = !item.Expanded;
            }
            else
            {
                if (_oldSubMenus != null)
                {
                    // hide previous selected item
                    _oldSubMenus.Expanded = false;
                }

                // show selected item
                item.Expanded = true;
            }

            _oldSubMenus = item;
        }

        private void LoadMenuItems()
        {
            if (IsBusy)
                return;

            IsBusy = true;
            Items.Clear();
            List<SubMenu> homeMenu = new List<SubMenu>()
            {
                new SubMenu("Dashboard", 1, typeof(MainPage), "", Enums.PageKey.Dashboard),
                new SubMenu("Connect", 1, typeof(Connect), "", Enums.PageKey.Connect),
                new SubMenu("Logout", 2, typeof(Login), "", Enums.PageKey.Logout)
            };

            List<SubMenu> filmMenu = new List<SubMenu>()
            {
                new SubMenu("View", 1, typeof(Playlists), "", Enums.PageKey.Playlists),//ViewFilm
                new SubMenu("Live Stream", 1, typeof(LiveStream), "", Enums.PageKey.LiveStream),
                new SubMenu("Upload", 1, typeof(Upload), "", Enums.PageKey.Upload),
                new SubMenu("Exchange", 1, typeof(FilmExchange), "", Enums.PageKey.FilmExchange),
                new SubMenu("Edit Video", 1, typeof(FilmExchange), "", Enums.PageKey.FilmExchange)
            };

            List<SubMenu> appMenu = new List<SubMenu>()
            {
                new SubMenu("Calendar", 1, typeof(Calendar), "", Enums.PageKey.Calendar),
                new SubMenu("Messenger", 1, typeof(Messenger), "", Enums.PageKey.Messenger),
                new SubMenu("Highlights", 1, typeof(Highlights), "", Enums.PageKey.HightLights),
                new SubMenu("Playbook", 1, typeof(Playbook), "", Enums.PageKey.Playbook),
                new SubMenu("Practice Plans", 1, typeof(Practice), "", Enums.PageKey.Practice),
                new SubMenu("Statistics", 1, typeof(Statistics), "", Enums.PageKey.Statistics),
                new SubMenu("Documents", 1, typeof(Documents), "", Enums.PageKey.Documents),
                new SubMenu("Photos", 1, typeof(Photos), "", Enums.PageKey.Photos)
            };

            List<SubMenu> settingsMenu = new List<SubMenu>()
            {
                new SubMenu("Profile", 1, typeof(Profiles), "", Enums.PageKey.Profile),
                new SubMenu("Users", 1, typeof(Users), " ", Enums.PageKey.Users),
                new SubMenu("Security", 1, typeof(Security), "", Enums.PageKey.Security),
                new SubMenu("History", 1, typeof(History), "", Enums.PageKey.History),
                new SubMenu("Recycle Bin", 2, typeof(RecyleBin), "", Enums.PageKey.RecycleBin),
                new SubMenu("Payment", 2, typeof(Payment), "", Enums.PageKey.Payment)
            };

            List<SubMenu> helpMenu = new List<SubMenu>()
            {
                new SubMenu("Learning Videos", 1, typeof(LearningVideos), "", Enums.PageKey.LearningVideos),
                new SubMenu("Documentation", 1, typeof(Documentation), "", Enums.PageKey.Documentation),
                new SubMenu("FAQ", 1, typeof(Faq), "", Enums.PageKey.Faq),
                new SubMenu("Contact Us", 1, typeof(ContactUs), "", Enums.PageKey.ContactUs)
            };

            // Set Menu
            List<Models.Menu> items = new List<Models.Menu>()
            {
                new Models.Menu("Home", homeMenu),
                new Models.Menu("Film", filmMenu),
                new Models.Menu("Apps", appMenu),
                new Models.Menu("Settings", settingsMenu),
                new Models.Menu("Help", helpMenu)
            };

            IsBusy = false;
            IsEmpty = items == null || items.Count == 0;

            // Set Grouped
            foreach (var menu in items)
                Items.Add(new GroupedMenu(menu));
        }
    }
}
