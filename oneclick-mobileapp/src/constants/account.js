const accountConstant = {
  httpStatus: {
    Ok: 200,
    Created:201,
    NotAuthenticated: 401,
    Forbidden: 403,
    NotFound:404,
    BadRequest:400,
    RequestTimeout:408,
    UnSupportedMediaType:415,
    InternalServerError:500,
    ServiceUnavailable:503
  },
  authStatus: {
    OK: 'OK',
    SUCCESS:'Success',
    MOBILE_VERIFICATION_ERROR: 'MOBILE_VERIFICATION_ERROR',
    REGISTER_MOBILE_ERROR: 'REGISTER_MOBILE_ERROR',
    CREATED:'CREATED',
    PAGE_NOT_FOUND:'PAGE_NOT_FOUND',
    INVALID_REQUEST_SYNTAX:'INVALID_REQUEST_SYNTAX',
    UNAUTHORIZED:'UNAUTHORIZED',
    INTERNAL_SERVER_ERROR:'INTERNAL_SERVER_ERROR',
    SERVICE_UNAVAILABLE:'SERVICE_UNAVAILABLE',
    STATUS:"status"
  },
  authMessage: {
    AUTHENTICATION_FAIL: 'The email address or password you entered was not recognised',
    REGISTER_MOBILE_FAIL: 'An error occurred while registering phone number',
    invalidPhoneNumber: 'Phone number is not valid',
    invalidEmail: 'Email Address is not valid',
    INVALID_REQUEST:'The server is not ready to handle the request'
  },
  authSessionStatus: {
    Success: 'success',
    cancel: 'cancel',
  },

};

export default accountConstant;
