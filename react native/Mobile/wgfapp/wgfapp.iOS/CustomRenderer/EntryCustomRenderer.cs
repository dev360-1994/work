using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using CoreGraphics;
using Foundation;
using wgfapp.iOS.CustomRenderer;
using UIKit;
using WebKit;
using Xamarin.Forms;
using Xamarin.Forms.Platform.iOS;
using wgfapp.Extention;

[assembly: ExportRenderer(typeof(Entry), typeof(EntryCustomRenderer))]
[assembly: ExportRenderer(typeof(ExtEntry), typeof(ExtEntryCustomRenderer))]

namespace wgfapp.iOS.CustomRenderer
{
    public class EntryCustomRenderer : EntryRenderer
    {
        public EntryCustomRenderer()
        {
        }
        protected override void OnElementChanged(ElementChangedEventArgs<Entry> e)
        {
            try
            {
                base.OnElementChanged(e);
                if (Control != null)
                {
                    Control.Layer.BorderWidth = 1;
                    Control.Layer.CornerRadius = 2;
                    Control.Layer.BorderColor = Xamarin.Forms.Color.FromHex("#777777").ToCGColor();
                    Control.BorderStyle = UITextBorderStyle.RoundedRect;
                    Control.BackgroundColor = UIColor.White;
                    Control.VerticalAlignment = UIControlContentVerticalAlignment.Center;
                    //Control.LeftView = new UIView(new CGRect(20, 0, 20, 0));
                    Control.LeftView = new UIView(new CGRect(0, 0, 15, 0));
                    Control.LeftViewMode = UITextFieldViewMode.Always;
                    Control.RightView = new UIView(new CGRect(0, 0, 15, 0));
                    Control.RightViewMode = UITextFieldViewMode.Always;
                }
            }
            catch (Exception)
            {
            }
        }
    }

    public class ExtEntryCustomRenderer : EntryRenderer
    {
        protected override void OnElementChanged(ElementChangedEventArgs<Entry> e)
        {
            try
            {
                base.OnElementChanged(e);
                if (Control != null)
                {
                    Control.Layer.BorderWidth = 0;
                    Control.Layer.CornerRadius = 0;
                    Control.Layer.BorderColor = Xamarin.Forms.Color.Transparent.ToCGColor();
                    Control.BorderStyle = UITextBorderStyle.None;
                    Control.BackgroundColor = Color.Transparent.ToUIColor();
                    Control.VerticalAlignment = UIControlContentVerticalAlignment.Center;
                    //Control.LeftView = new UIView(new CGRect(20, 0, 20, 0));
                    Control.LeftView = new UIView(new CGRect(0, 0, 15, 0));
                    Control.LeftViewMode = UITextFieldViewMode.Always;
                    Control.RightView = new UIView(new CGRect(0, 0, 15, 0));
                    Control.RightViewMode = UITextFieldViewMode.Always;
                }
            }
            catch (Exception)
            {
            }
        }
    }
}