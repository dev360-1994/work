import { post, get } from "./common/http";
import { BASE_URL } from "../const";


export const uploadVideo = (data: any) => post(`${BASE_URL}/api/Account/GetToken`, data, "", true);


