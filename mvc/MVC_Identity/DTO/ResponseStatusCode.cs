namespace MVC_Identity.DTO
{
    public class ResponseStatusCode
    {
        public const int OK = 200;
        public const int Accepted = 202;
        public const int DataNotFound = 204;
        public const int UserNotFound = 205;
        public const int InvalidPassword = 206;
        public const int EmailNotFound = 207;
        public const int OperationFailure = 208;
        public const int AlreadyExists = 302;
        public const int NotModified = 304;
        public const int BadRequest = 400;
        public const int Unauthorized = 401;
        public const int NotFound = 404;
        public const int InternalServerError = 500;
    }
}
