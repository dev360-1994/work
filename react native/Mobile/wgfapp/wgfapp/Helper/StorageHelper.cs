using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Xamarin.Essentials;

namespace wgfapp.Helper
{
    public class StorageHelper
    {
        public StorageHelper()
        {
        }

        public async Task SetValue(string key, string value)
        {
            try
            {
                SecureStorage.Remove(key);
                await SecureStorage.SetAsync(key, value);
            }
            catch (Exception ex)
            {
                // Possible that device doesn't support secure storage on device.
            }
        }

        public async Task<string> GetValue(string key)
        {
            try
            {
                return await SecureStorage.GetAsync(key);
            }
            catch (Exception ex)
            {
                // Possible that device doesn't support secure storage on device.
            }
            return string.Empty;
        }

        public bool Remove(string key)
        {
            try
            {
                return SecureStorage.Remove(key);
            }
            catch (Exception ex)
            {
                // Possible that device doesn't support secure storage on device.
            }
            return false;
        }
    }
}
