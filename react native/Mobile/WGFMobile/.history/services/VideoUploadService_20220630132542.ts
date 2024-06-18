import { post, get, videoPost } from "./common/http";
import { BASE_URL } from "../const";

const dbUrl = "https://slot1.watchgamefilm.com/api/";

export const uploadVideo = (url: string, data = {}, videoId: string) =>
    videoPost(`${BASE_URL}/api/UploadFilm/UploadRecordedVideo`, dbUrl, data, videoId);


