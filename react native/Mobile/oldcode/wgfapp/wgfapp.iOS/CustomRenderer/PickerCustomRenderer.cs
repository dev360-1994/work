using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using wgfapp.iOS.CustomRenderer;
using CoreGraphics;
using Foundation;
using UIKit;
using Xamarin.Forms;
using Xamarin.Forms.Platform.iOS;

[assembly: ExportRenderer(typeof(Picker), typeof(PickerCustomRenderer))]

namespace wgfapp.iOS.CustomRenderer
{
    public class PickerCustomRenderer : PickerRenderer
    {
        protected override void OnElementChanged(ElementChangedEventArgs<Picker> e)
        {
            try
            {
                base.OnElementChanged(e);
                if (Control != null)
                {
                    Control.Layer.BorderWidth = 0;
                    Control.Layer.CornerRadius = 0;
                    Control.Layer.BorderColor = Xamarin.Forms.Color.FromHex("#777777").ToCGColor();
                    Control.BorderStyle = UITextBorderStyle.None;
                    Control.BackgroundColor = UIColor.White;
                    Control.VerticalAlignment = UIControlContentVerticalAlignment.Center;
                    Control.LeftView = new UIView(new CGRect(0, 0, 15, 0));
                    Control.LeftViewMode = UITextFieldViewMode.Always;
                    Control.RightView = new UIView(new CGRect(0, 0, 15, 0));
                    Control.RightViewMode = UITextFieldViewMode.Always;
                }
            }
            catch (Exception ex)
            {
            }
        }
    }

}