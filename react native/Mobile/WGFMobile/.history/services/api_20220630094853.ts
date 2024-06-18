import axios from "axios";

const url = 'https://slot1.watchgamefilm.com/api/UploadFilm/UploadRecordedVideo';

export const uploadVideo = async (data: any) => {

    return await axios.post(url, data);
}