using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Android.App;
using Android.Content;
using Android.Graphics;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using wgfapp.Droid.CustomRenderer;
using Xamarin.Forms.Platform.Android;

[assembly: Xamarin.Forms.ExportRenderer(typeof(Xamarin.Forms.Button), typeof(ButtonCustomRenderer))]

namespace wgfapp.Droid.CustomRenderer
{
#pragma warning disable CS0618 // Type or member is obsolete

    public class ButtonCustomRenderer : ButtonRenderer
    {
        protected override void OnElementChanged(ElementChangedEventArgs<Xamarin.Forms.Button> e)
        {
            base.OnElementChanged(e);
            this.Control.SetAllCaps(false);
        }
    }
}