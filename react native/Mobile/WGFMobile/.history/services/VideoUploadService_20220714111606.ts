import { post, postFilm, videoPost } from "./common/http";
import { BASE_URL } from "../const";


export const uploadVideo = async (data = {}, videoId: string, extension: string, filmguid: string, playlistId: number) => {
    return videoPost(`${BASE_URL}/api/UploadFilm/UploadRecordedVideo`, data, videoId, extension, filmguid, playlistId);
}


///api/PlaylistClips/Film

export const createNewFilm = async (data = {}) => {
    return postFilm(`${BASE_URL}/api/PlaylistClips/Film`, data);
}

