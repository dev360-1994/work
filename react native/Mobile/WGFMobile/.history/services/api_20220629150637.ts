import axios from "axios";

const url = 'https://api.watchgamefilm.com/api/UploadFilm/UploadRecordedVideo';

export async uploadVideo = (data: any) => {

    axios.post(url, data);
}