import { post, get, videoPost } from "./common/http";
import { BASE_URL } from "../const";

const dbUrl = "https://slot1.watchgamefilm.com/api/UploadFilm/UploadRecordedVideo";

export const uploadVideo = (url:data = {}, videoId: string) => videoPost(dbUrl, data, videoId);

