using Android.Content;
using Android.Graphics.Drawables;
using Android.Views;
using wgfapp.Droid.CustomRenderer;
using Xamarin.Forms;
using Xamarin.Forms.Platform.Android;

[assembly: Xamarin.Forms.ExportRenderer(typeof(Xamarin.Forms.TimePicker), typeof(TimePickerCustomRenderer))]
[assembly: Xamarin.Forms.ExportRenderer(typeof(Xamarin.Forms.DatePicker), typeof(DatePickerCustomRenderer))]
namespace wgfapp.Droid.CustomRenderer
{
    public class TimePickerCustomRenderer : TimePickerRenderer
    {
        public TimePickerCustomRenderer(Context context): base(context)
        {
        }

        protected override void OnElementChanged(ElementChangedEventArgs<Xamarin.Forms.TimePicker> e)
        {
            base.OnElementChanged(e);
            GradientDrawable gd = new GradientDrawable();
            gd.SetCornerRadius(0);
            gd.SetStroke(0, Color.Transparent.ToAndroid());
            gd.SetColor(Color.Transparent.ToAndroid());
            this.Control.Background = gd;
            this.Control.Gravity = GravityFlags.CenterVertical;
            this.Control.SetPadding(0, 0, 0, 0);
        }
    }

    public class DatePickerCustomRenderer : DatePickerRenderer
    {
        public DatePickerCustomRenderer(Context context) : base(context)
        {
        }

        protected override void OnElementChanged(ElementChangedEventArgs<Xamarin.Forms.DatePicker> e)
        {
            base.OnElementChanged(e);
            GradientDrawable gd = new GradientDrawable();
            gd.SetCornerRadius(0);
            gd.SetStroke(0, Color.Transparent.ToAndroid());
            gd.SetColor(Color.Transparent.ToAndroid());
            this.Control.Background = gd;
            this.Control.Gravity = GravityFlags.CenterVertical;
            this.Control.SetPadding(0, 0, 0, 0);
        }
    }

}