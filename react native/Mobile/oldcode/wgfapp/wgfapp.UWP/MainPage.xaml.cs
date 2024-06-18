using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices.WindowsRuntime;
using wgfapp.Common;
using Windows.Foundation;
using Windows.Foundation.Collections;
using Windows.UI.Xaml;
using Windows.UI.Xaml.Controls;
using Windows.UI.Xaml.Controls.Primitives;
using Windows.UI.Xaml.Data;
using Windows.UI.Xaml.Input;
using Windows.UI.Xaml.Media;
using Windows.UI.Xaml.Navigation;

namespace wgfapp.UWP
{
    public sealed partial class MainPage
    {
        public MainPage()
        {
            this.InitializeComponent();
            MediaManager.CrossMediaManager.Current.Init();
            var application = (Xamarin.Forms.Application)ContainerManager.Container.Resolve(typeof(App), typeof(App).GetType().ToString());
            //LoadApplication(new wgfapp.App());
            LoadApplication(application);
        }
    }
}
