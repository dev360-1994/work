namespace LaserTraderApi.Dtos
{
    public class AppSettings
    {
        public string JwtSecretKey { get; set; } = string.Empty;
        public string JwtIssuer { get; set; } = string.Empty;
        public string JwtAudience { get; set; } = string.Empty;

        public int JwtExpireMinutes { get; set; }
        public int JwtRefreshExpireDays { get; set; }

        public string SendGridApiKey { get; set; } = string.Empty;
        public string SenderEmail { get; set; } = string.Empty;
        public string ToEmail { get; set; } = string.Empty;
        public string WebUrl { get; set; } = string.Empty;
    }
}
