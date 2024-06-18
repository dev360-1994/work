import { post, postFilm, videoPost } from "./common/http";
import { BASE_URL } from "../const";


export const uploadVideo = async (data = {}) => {
    return await videoPost(`${BASE_URL}/api/UploadFilm/UploadVideo`, data);
}


///api/PlaylistClips/Film

export const createNewFilm = async (data = {}) => {
    return postFilm(`${BASE_URL}/api/PlaylistClips/Film`, data);
}

