using Android.Content;
using Android.Graphics.Drawables;
using Android.Views;
using wgfapp.Droid.CustomRenderer;
using Xamarin.Forms;
using Xamarin.Forms.Platform.Android;

[assembly: Xamarin.Forms.ExportRenderer(typeof(Picker), typeof(PickerCustomRenderer))]
namespace wgfapp.Droid.CustomRenderer
{
    public class PickerCustomRenderer : PickerRenderer
    {
        public PickerCustomRenderer(Context context) : base(context)
        {
        }

        protected override void OnElementChanged(ElementChangedEventArgs<Picker> e)
        {
            base.OnElementChanged(e);
            GradientDrawable gd = new GradientDrawable();
            gd.SetCornerRadius(10);
            gd.SetStroke(0, Color.Transparent.ToAndroid());
            gd.SetColor(Color.Transparent.ToAndroid());
            this.Control.Background = gd;
            this.Control.Gravity = GravityFlags.CenterVertical;
            this.Control.SetPadding(50, 0, 50, 0);
        }
    }
}