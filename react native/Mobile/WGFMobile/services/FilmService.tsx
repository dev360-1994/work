import { post, postFilm, videoPost } from "./common/http";
import { BASE_URL } from "../const";

export const GoogleDriveTransfer = async (data = {}) => {
    return await post(`${BASE_URL}/api/UploadFilm/GoogleDriveTransfer`, data);
}

export const ValidateHudlUrl = async (data: any) => {
    return await post(`${BASE_URL}/api/UploadFilm/ValidateHudlUrl`, data);
}