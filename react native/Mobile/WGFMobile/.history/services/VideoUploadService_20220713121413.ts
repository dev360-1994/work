import { post, postFilm, videoPost } from "./common/http";
import { BASE_URL } from "../const";


export const uploadVideo = async (data = {}, videoId: string, extension: string) => {
    return videoPost(`${BASE_URL}/api/UploadFilm/UploadRecordedVideo`, data, videoId, extension);
}


///api/PlaylistClips/Film

export const createNewFilm = async (data = {
    "Angle": 1,
    "Audio": 2,
    "Date": "2022-07-14",
    "Group": "Practice",
    "Tags": "Test",
    "TeamId": 5277,
    "Title": "Test77",
    "UserId": 134901
}) => {
    return postFilm(`${BASE_URL}/api/PlaylistClips/Film`, data);
}

