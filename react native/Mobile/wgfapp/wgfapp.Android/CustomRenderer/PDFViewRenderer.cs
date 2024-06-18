using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

using Android.App;
using Android.Content;
using Android.OS;
using Android.Runtime;
using Android.Views;
using Android.Widget;
using wgfapp.Droid.CustomRenderer;
using wgfapp.Extention;
using Xamarin.Forms;
using Xamarin.Forms.Platform.Android;

[assembly: ExportRenderer(typeof(PDFView), typeof(PDFViewRenderer))]

namespace wgfapp.Droid.CustomRenderer
{
    public class PDFViewRenderer : WebViewRenderer
    {
        public PDFViewRenderer(Context context) : base(context)
        {
        }
        protected override void OnElementChanged(ElementChangedEventArgs<WebView> e)
        {
            base.OnElementChanged(e);

            if (e.NewElement != null)
            {
                var pdfView = Element as PDFView;
                Control.Settings.AllowUniversalAccessFromFileURLs = true;
                if (pdfView.IsPDF)
                {
                    Control.Settings.JavaScriptEnabled = true;
                    var url = "https://drive.google.com/viewerng/viewer?embedded=true&url=" + pdfView.Uri;
                    Control.LoadUrl(url);
                }
                else
                {
                    Control.LoadUrl(pdfView.Uri);
                }

            }
        }
    }
}