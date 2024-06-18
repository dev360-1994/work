import axios from "axios";

const url = 'https://api.watchgamefilm.com/api/UploadFilm/UploadRecordedVideo';

export const uploadVideo = async (data: any) => {

    await axios.post(url, data);
}