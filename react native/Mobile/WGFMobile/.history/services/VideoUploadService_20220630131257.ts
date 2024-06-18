import { post, get, videoPost } from "./common/http";
import { BASE_URL } from "../const";

const url = 

export const uploadVideo = (url: string, data = {}, videoId: string) => videoPost(`${BASE_URL}/api/Account/GetToken`, data, "", true);


