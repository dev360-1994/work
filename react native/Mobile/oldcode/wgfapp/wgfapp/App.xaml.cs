using System;
using DevExpress.XamarinForms.Core.Themes;
using DLToolkit.Forms.Controls;
using wgfapp.Common.Interfaces;
using wgfapp.Helper;
using wgfapp.Interfaces;
using wgfapp.Service;
using wgfapp.Service.Interfaces;
using Xamarin.Essentials;
using Xamarin.Forms;

namespace wgfapp
{
    public partial class App : Application
    {
        private readonly StorageHelper _storageHelper;
        private readonly INavigationService _navigationService;
        private readonly IPersistanceService _persistanceService;
        private readonly IAuthenticationService _authencticationService;
        private readonly IAccountService _accountService;
        private readonly IConfig _config;

        public App(INavigationService navigationService, IPersistanceService persistanceService, IAuthenticationService authenticationService, IAccountService accountService, IConfig config)
        {
            _navigationService = navigationService;
            _persistanceService = persistanceService;
            _authencticationService = authenticationService;
            _accountService = accountService;
            _config = config;
            InitializeComponent();
            FlowListView.Init();
            Device.SetFlags(new string[] { "Expander_Experimental", "Brush_Experimental", "Shapes_Experimental", "CollectionView_Experimental" });
        }

        protected async override void OnStart()
        {
            await _navigationService.NavigateToFirstScreenAsync();

            string theme = _persistanceService.Theme;
            if (theme == "Dark")
            {
                Resources.MergedDictionaries.Add(new Themes.DarkTheme());
                ThemeManager.ThemeName = Theme.Dark;
            }
            else if (theme == "Light")
            {
                Resources.MergedDictionaries.Add(new Themes.LightTheme());
                ThemeManager.ThemeName = Theme.Light;
            }
            else
            {
                _persistanceService.Theme = "Light";
                Resources.MergedDictionaries.Add(new Themes.LightTheme());
                ThemeManager.ThemeName = Theme.Light;
            }

            var authenticationResponse = await _authencticationService.Authenticate(new Common.Models.AuthenticationModel() { ClientId = _config.ClientId, ClientSecret = _config.ClientSecret });
            if (authenticationResponse != null && !string.IsNullOrEmpty(authenticationResponse.Token))
                _persistanceService.Token = authenticationResponse.Token;

            string deviceName = Device.RuntimePlatform;
            var versionResponse = await _accountService.GetVersion(deviceName, _persistanceService.Token);
            if (versionResponse != null)
            {
                decimal apiBuildVersion = Convert.ToDecimal(versionResponse.VersionCode);
                decimal apiVersion = Convert.ToDecimal(versionResponse.VersionName);
                decimal appVersion = Convert.ToDecimal(VersionTracking.CurrentVersion);
                decimal appBuildVersion = Convert.ToDecimal(VersionTracking.CurrentBuild);

                if (apiVersion > appVersion || apiBuildVersion > appBuildVersion)
                    await App.Current.MainPage.DisplayAlert("Version Update Available", "WGF application needs to update.", "Yes", "No");
            }


            //var serverTimeResponse = await _accountService.GetServerTime(_persistanceService.Token);
            //if (serverTimeResponse != null)
            //{
               
            //}
        }

        protected override void OnSleep()
        {
        }

        protected override void OnResume()
        {
        }
    }
}
