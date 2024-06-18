using Acr.UserDialogs;
using Android.App;
using Android.Content;
using Android.Content.PM;
using Android.OS;
using Android.Runtime;
using MediaManager;
using Plugin.CurrentActivity;
using Plugin.Permissions;
using Rg.Plugins.Popup.Contracts;
using Rg.Plugins.Popup.Services;
using wgfapp.Common;
using wgfapp.Droid.Dependencies;
using wgfapp.Service;
using Xamarin.Forms.PlatformConfiguration.AndroidSpecific;

namespace wgfapp.Droid
{
    [Activity(Label = "WGF", Theme = "@style/MainTheme", ConfigurationChanges = ConfigChanges.ScreenSize | ConfigChanges.Orientation | ConfigChanges.UiMode | ConfigChanges.ScreenLayout | ConfigChanges.SmallestScreenSize)]
    public class MainActivity : global::Xamarin.Forms.Platform.Android.FormsAppCompatActivity
    {
        protected override void OnCreate(Bundle savedInstanceState)
        {
            TabLayoutResource = Android.Resource.Layout.Tabbar;
            ToolbarResource = Android.Resource.Layout.Toolbar;
            CrossCurrentActivity.Current.Init(this, savedInstanceState);
            base.OnCreate(savedInstanceState);
            Rg.Plugins.Popup.Popup.Init(this);
            UserDialogs.Init(this);
            Xamarin.Essentials.Platform.Init(this, savedInstanceState);
            global::Xamarin.Forms.Forms.Init(this, savedInstanceState);
            global::Plugin.Media.CrossMedia.Current.Initialize();

            WireupDependency();

            var application = (Xamarin.Forms.Application)ContainerManager.Container.Resolve(typeof(App), typeof(App).GetType().ToString());
            LoadApplication(application);

            App.Current.On<Xamarin.Forms.PlatformConfiguration.Android>().UseWindowSoftInputModeAdjust(WindowSoftInputModeAdjust.Resize | WindowSoftInputModeAdjust.Pan);
        }

        public override void OnBackPressed()
        {
            IPopupNavigation popupNavigation = PopupNavigation.Instance;
            if (popupNavigation.PopupStack.Count > 0)
            {
                if (Rg.Plugins.Popup.Popup.SendBackPressed(base.OnBackPressed))
                {
                    popupNavigation.PopAsync();
                }
                else
                {
                    popupNavigation.PopAllAsync();
                }
            }
            else
            {
                base.OnBackPressed();
            }
        }

        public override void OnRequestPermissionsResult(int requestCode, string[] permissions, [GeneratedEnum] Permission[] grantResults)
        {
            Xamarin.Essentials.Platform.OnRequestPermissionsResult(requestCode, permissions, grantResults);
            PermissionsImplementation.Current.OnRequestPermissionsResult(requestCode, permissions, grantResults);
            base.OnRequestPermissionsResult(requestCode, permissions, grantResults);
        }

        private void WireupDependency()
        {
            // Wire up dependencies of core classes
            ContainerManager.Initialize();
            CommonBootstrapper.Initialize(ContainerManager.Container);
            ServiceBootstrapper.Initialize(ContainerManager.Container);
            FormsBootstrapper.Initialize(ContainerManager.Container);
            DroidBootstrapper.Initialize(ContainerManager.Container);
        }

        protected override void OnActivityResult(int requestCode, Result resultCode, Intent data)
        {
            base.OnActivityResult(requestCode, resultCode, data);
            MultiMediaPickerService.SharedInstance.OnActivityResult(requestCode, resultCode, data);
        }
    }
}
