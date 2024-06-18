import { UserInfoModel } from './UserInfoModel';

export class SessionInfoModel {
  token: string = "";
  tokenExpiryTime: string = "";
  isThemeDark: boolean = false;
  userInfo: UserInfoModel = new UserInfoModel();
};
