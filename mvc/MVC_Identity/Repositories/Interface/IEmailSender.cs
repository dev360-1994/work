using MVC_Identity.DTO;

namespace MVC_Identity.Repositories.Interface
{
    public interface IEmailSender
    {
        Task <bool> SendMail(string mailTo, string subject, string body, bool isHtmlBody);
    }
}
