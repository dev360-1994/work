import { post, get } from "./common/http";
import { BASE_URL } from "../const";


export const upload = (data: any) => post(`${BASE_URL}/api/Account/GetToken`, data, "", true);


