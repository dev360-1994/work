import { get, put, deleteAsync, post } from "./common/http";
import { BASE_URL } from "../const";


export const getClipGuid = (params: any) => get(`${BASE_URL}/api/PlaylistClips/GetClipGuid/` + params, null);

export const getComments = (params: any) => get(`${BASE_URL}/api/PlaylistClips/Comments/` + params, null);

export const getDrawing = (params: any) => get(`${BASE_URL}/api/PlaylistClips/Drawing/` + params, null);

export const getFilms = (params: any) => get(`${BASE_URL}/api/PlaylistClips/Film/` + params, null);

export const getOperationAccess = (params: any) => get(`${BASE_URL}/api/PlaylistClips/OperationAccess/` + params, null);

export const getPlaylistClips = (params: any) => get(`${BASE_URL}/api/PlaylistClips/GetPlayListClips/` + params, null);

export const getPlayListInfo = (params: any) => get(`${BASE_URL}/api/PlaylistClips/PlayListInfo/` + params, null);

export const getTeamPlaylist = (params: any) => get(`${BASE_URL}/api/PlaylistClips/TeamsPlayList/` + params, null);

export const SelectAttachment = (params: any) => get(`${BASE_URL}/api/PlaylistClips/Attachment/` + params, null);

export const UpdatePlaylistClip = (params: any) => put(`${BASE_URL}/api/PlaylistClips/PlaylistClip`, params);

export const DeletePlaylistClip = (userId: any, playlistClipId: any) => deleteAsync(`${BASE_URL}/api/PlaylistClips/Playlist/${userId}/${playlistClipId}`);

export const DownloadPlaylist = (params: any) => post(`${BASE_URL}/api/PlaylistClips/PlaylistDownload`, params);

export const getFlimGuidId = (playlistid: any, userId: any) => get(`${BASE_URL}/api/PlaylistClips/NewPlaylistGuid/${playlistid}/${userId}`, null);