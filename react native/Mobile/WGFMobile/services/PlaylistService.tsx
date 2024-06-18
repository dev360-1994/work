import {  get, put } from "./common/http";
import { BASE_URL } from "../const";


export const updatePlaylistFavoriteStatus = (data: any) => put(`${BASE_URL}/api/PlaylistClips/AddToFavorite`, data);

export const getPlaylistById = (params: any) => get(`${BASE_URL}/api/PlaylistClips/PlaylistInfo/` + params, null);

export const getPlaylistClipsViewById = (params: any) => get(`${BASE_URL}/api/PlaylistClips/GetPlayListClips/` + params, null);

export const getTeamPlaylists = (params: any) => get(`${BASE_URL}/api/PlaylistClips/TeamsPlayList/` + params, null);

export const getClipGUID = (params: any) => get(`${BASE_URL}/api/PlaylistClips/GetClipGuid/` + params, null);

export const getClipCommentsByClipId = (params: any) => get(`${BASE_URL}/api/PlaylistClips/GetClipGuid/` + params, null);

export const getClipDrawingByClipId = (params: any) => get(`${BASE_URL}/api/PlaylistClips/Drawing/` + params, null);

export const getOperationAccess = (params: any) => get(`${BASE_URL}/api/PlaylistClips/OperationAccess/` + params, null);

export const getClipAttachmentByClipId = (params: any) => get(`${BASE_URL}/api/PlaylistClips/Attachment/` + params, null);

export const getAvailableUsers = (params: any) => get(`${BASE_URL}/api/PlaylistClips/AvailableUserGroup/` + params, null);

export const getUserRoster = (params: any) => get(`${BASE_URL}/api/PlaylistClips/UserRoster/` + params, null);