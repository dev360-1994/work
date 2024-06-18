// ** Auth Endpoints
const authEndpoints = {
  loginEndpoint: `${process.env.APP_SERVER_URL}/api/auth/login`,
  registerEndpoint: `${process.env.APP_SERVER_URL}/api/auth/register`,
  refreshEndpoint: `${process.env.APP_SERVER_URL}/api/auth/refreshToken`,
  logoutEndpoint: '/jwt/logout',
  tokenType: 'Bearer',
  storageTokenKeyName: 'accessToken',
};

export default authEndpoints;
