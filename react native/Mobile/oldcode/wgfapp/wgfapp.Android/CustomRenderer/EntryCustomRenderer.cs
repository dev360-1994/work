using Android.Content;
using Android.Graphics.Drawables;
using Android.Views;
using wgfapp.Droid.CustomRenderer;
using wgfapp.Extention;
using Xamarin.Forms;
using Xamarin.Forms.Platform.Android;

[assembly: Xamarin.Forms.ExportRenderer(typeof(Entry), typeof(EntryCustomRenderer))]
[assembly: Xamarin.Forms.ExportRenderer(typeof(ExtEntry), typeof(ExtEntryCustomRenderer))]
namespace wgfapp.Droid.CustomRenderer
{
    public class EntryCustomRenderer : EntryRenderer
    {
        public EntryCustomRenderer(Context context) : base(context)
        {

        }

        protected override void OnElementChanged(ElementChangedEventArgs<Xamarin.Forms.Entry> e)
        {
            base.OnElementChanged(e);
            GradientDrawable gd = new GradientDrawable();
            gd.SetCornerRadius(2);
            gd.SetStroke(1, Color.FromHex("#777777").ToAndroid());
            gd.SetColor(Color.White.ToAndroid());
            this.Control.Background = gd;
            this.Control.Gravity = GravityFlags.CenterVertical;
            this.Control.SetPadding(20, 0, 20, 0);
        }
    }

    public class ExtEntryCustomRenderer : EntryRenderer
    {
        public ExtEntryCustomRenderer(Context context) : base(context)
        {

        }

        protected override void OnElementChanged(ElementChangedEventArgs<Xamarin.Forms.Entry> e)
        {
            base.OnElementChanged(e);
            GradientDrawable gd = new GradientDrawable();
            gd.SetCornerRadius(0);
            gd.SetStroke(0, Color.Transparent.ToAndroid());
            gd.SetColor(Color.Transparent.ToAndroid());
            this.Control.Background = gd;
            this.Control.Gravity = GravityFlags.CenterVertical;
            this.Control.SetPadding(20, 0, 20, 0);
        }
    }
}