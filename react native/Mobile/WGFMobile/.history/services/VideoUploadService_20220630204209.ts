import { videoPost } from "./common/http";
import { BASE_URL } from "../const";


export const uploadVideo = (data = {}, videoId: string, extension: string) => {
    
}
    return videoPost(`${BASE_URL}/api/UploadFilm/UploadRecordedVideo`, data, videoId, extension);

