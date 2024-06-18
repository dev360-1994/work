using System;
using Xamarin.Forms;

namespace wgfapp
{
    public class BindableToolbarItem : ToolbarItem
    {
        public static readonly BindableProperty IsVisibleProperty = BindableProperty.Create(nameof(IsVisible), typeof(bool), typeof(BindableToolbarItem), true, BindingMode.TwoWay, propertyChanged: OnIsVisibleChanged);

        public bool IsVisible
        {
            get { return (bool)GetValue(IsVisibleProperty); }
            set { SetValue(IsVisibleProperty, value); }
        }

        private static void OnIsVisibleChanged(BindableObject bindable, object oldvalue, object newvalue)
        {
            var item = bindable as BindableToolbarItem;

            if (item == null || item.Parent == null)
                return;

            ContentPage contentPage = item.Parent as ContentPage;
            var toolbarItems = contentPage.ToolbarItems;

            if (item.IsVisible && !toolbarItems.Contains(item))
            {
                Device.BeginInvokeOnMainThread(() =>
                {
                    System.Diagnostics.Debug.WriteLine("Removing toolbar item..");
                    toolbarItems.Add(item);
                });
            }
            else if (!item.IsVisible && toolbarItems.Contains(item))
            {
                Device.BeginInvokeOnMainThread(() =>
                {
                    System.Diagnostics.Debug.WriteLine("Removing toolbar item..");
                    toolbarItems.Remove(item);
                });
            }
        }
    }
}
