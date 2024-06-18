using MVC_Identity.DTO;
using MVC_Identity.Repositories.Interface;
using System.Net;
using System.Net.Mail;

namespace MVC_Identity.Repositories.Services
{
    public class EmailSender : IEmailSender
    {
        private readonly EmailConfiguration _emailConfig;

        public EmailSender(EmailConfiguration emailConfig)
        {
            _emailConfig = emailConfig;
        }

        public async Task<bool> SendMail(string mailTo, string subject, string body, bool isHtmlBody)
        {
            try
            {
                using (var client = new SmtpClient(_emailConfig.SmtpServer))
                {
                    client.Port = _emailConfig.Port;
                    client.Credentials = new NetworkCredential(_emailConfig.Username, _emailConfig.Password);
                    client.EnableSsl = _emailConfig.EnableSsl;

                    using (var message = new MailMessage())
                    {
                        message.From = new MailAddress(_emailConfig.From);
                        message.To.Add(mailTo);
                        message.Subject = subject;
                        message.Body = body;
                        message.IsBodyHtml = isHtmlBody;

                        client.Send(message);
                    }
                }

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
    }
}
