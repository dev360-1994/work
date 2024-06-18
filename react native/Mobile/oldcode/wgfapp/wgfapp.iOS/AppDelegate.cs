using System;
using System.Collections.Generic;
using System.Linq;
using Foundation;
using MediaManager;
using UIKit;
using wgfapp.Common;
using wgfapp.Service;
using Xamarin.Forms;

namespace wgfapp.iOS
{
    // The UIApplicationDelegate for the application. This class is responsible for launching the 
    // User Interface of the application, as well as listening (and optionally responding) to 
    // application events from iOS.
    [Register("AppDelegate")]
    public partial class AppDelegate : global::Xamarin.Forms.Platform.iOS.FormsApplicationDelegate
    {
        //
        // This method is invoked when the application has loaded and is ready to run. In this 
        // method you should instantiate the window, load the UI into it and then make the window
        // visible.
        //
        // You have 17 seconds to return from this method, or iOS will terminate your application.
        //
        public override bool FinishedLaunching(UIApplication app, NSDictionary options)
        {
            global::Xamarin.Forms.Forms.Init();
            DevExpress.XamarinForms.Editors.Editors.Init();
            DevExpress.XamarinForms.Scheduler.Scheduler.Init();
            DevExpress.XamarinForms.DataGrid.DataGrid.Init();
            DevExpress.XamarinForms.Editors.Editors.Init();
            Rg.Plugins.Popup.Popup.Init();
            CrossMediaManager.Current.Init();
            TEditor.iOS.TEditoriOS.Initialize();
            WireupDependency();

            var application = (Xamarin.Forms.Application)ContainerManager.Container.Resolve(typeof(App), typeof(App).GetType().ToString());
            LoadApplication(application);

            return base.FinishedLaunching(app, options);
        }

        private void WireupDependency()
        {
            // Wire up dependencies of core classes
            ContainerManager.Initialize();
            CommonBootstrapper.Initialize(ContainerManager.Container);
            ServiceBootstrapper.Initialize(ContainerManager.Container);
            FormsBootstrapper.Initialize(ContainerManager.Container);
            iOSBootstrapper.Initialize(ContainerManager.Container);
        }
    }
}
