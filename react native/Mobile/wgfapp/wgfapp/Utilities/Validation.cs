using System;
using System.Text.RegularExpressions;

namespace wgfapp.Utilities
{
    public class Validation
    {
        public static bool IsValidEmailAddress(string email)
        {
            if (string.IsNullOrEmpty(email))
                return false;

            const string emailRegex = @"^(?("")("".+?(?<!\\)""@)|(([0-9a-z]((\.(?!\.))|[-!#\$%&'\*\+/=\?\^`\{\}\|~\w])*)(?<=[0-9a-z])@))" +
              @"(?(\[)(\[(\d{1,3}\.){3}\d{1,3}\])|(([0-9a-z][-\w]*[0-9a-z]*\.)+[a-z0-9][\-a-z0-9]{0,22}[a-z0-9]))$";

            return Regex.IsMatch(email, emailRegex, RegexOptions.IgnoreCase, TimeSpan.FromMilliseconds(250));
        }

        public static bool IsValidMobile(string mobile)
        {
            if (string.IsNullOrEmpty(mobile))
                return false;

            const string mobileRegex = @"[0-9]{10}";
            return Regex.IsMatch(mobile, mobileRegex, RegexOptions.IgnoreCase, TimeSpan.FromMilliseconds(250));
        }

        public static bool IsValidDigit(string text)
        {
            if (string.IsNullOrEmpty(text))
                return false;

            const string textRegex = @"^[0-9]*$";
            return Regex.IsMatch(text, textRegex, RegexOptions.IgnoreCase, TimeSpan.FromMilliseconds(250));
        }

        public static bool IsValidCountryCode(string text)
        {
            if (string.IsNullOrEmpty(text))
                return false;

            const string textRegex = @"^[+]{0,1}[0-9]*$";
            return Regex.IsMatch(text, textRegex, RegexOptions.IgnoreCase, TimeSpan.FromMilliseconds(250));
        }
    }
}
