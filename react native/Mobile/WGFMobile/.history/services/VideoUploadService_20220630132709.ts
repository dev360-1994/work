import { videoPost } from "./common/http";
import { BASE_URL } from "../const";


export const uploadVideo = (url: string, data = {}, videoId: string) =>
    videoPost(`${BASE_URL}/api/UploadFilm/UploadRecordedVideo`, data, "", );


