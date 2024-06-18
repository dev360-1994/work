import { post, get } from "./common/http";
import { BASE_URL } from "../const";


export const uploadVideo = (url: string, data = {}, videoId: string) => video(`${BASE_URL}/api/Account/GetToken`, data, "", true);


