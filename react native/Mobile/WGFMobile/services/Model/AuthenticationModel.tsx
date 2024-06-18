export class AuthenticationModel {
  clientId: string = "";
  clientSecret: string = "";
};

export class AuthenticationModelResponse {
  access_Token: string = "";
  tokenType: string = "";
  expires_In: number= 0;
};