import { post, get } from "./common/http";
import { BASE_URL } from "../const";


export const doAuthenticate = (data: any) => post(`${BASE_URL}/api/Account/GetToken`, data, "", true);
export const doLogin = (data: any) => post(`${BASE_URL}/api/Account/Login`, data);
export const doForgotPassword = (params: any) => get(`${BASE_URL}/api/Account/ResetPassword/` + params, null);

