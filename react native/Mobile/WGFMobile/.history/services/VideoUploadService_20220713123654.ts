import { post, postFilm, videoPost } from "./common/http";
import { BASE_URL } from "../const";


export const uploadVideo = async (data = {}, videoId: string, extension: string) => {
    return videoPost(`${BASE_URL}/api/UploadFilm/UploadRecordedVideo`, data, videoId, extension);
}


///api/PlaylistClips/Film

export const createNewFilm = async () => {
    return postFilm(`${BASE_URL}/api/PlaylistClips/Film`);
}

