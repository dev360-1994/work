import { post, postFilm, videoPost } from "./common/http";
import { BASE_URL } from "../const";

export const GoogleDriveTransfer = async (data = {}) => {
    return await post(`https://3769-103-99-202-239.in.ngrok.io/api/UploadFilm/GoogleDriveTransfer`, data);
}