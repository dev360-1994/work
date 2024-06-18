using System.Collections.Generic;
using System.ComponentModel;
using System.Threading;
using System.Threading.Tasks;
using wgfapp.Common.Interfaces;
using wgfapp.Common.Models;
using wgfapp.Service.Interfaces;

namespace wgfapp.Service.Implementation
{
    public class PlaylistService : BaseAPIService, IPlaylistService
    {
        private readonly IConfig _config;

        public PlaylistService(IConfig config) : base(config)
        {
            _config = config;
        }

        public async Task<FilmTeamPlaylist> GetPlaylistById(int playlistId, string token, CancellationToken cancellationToken = default)
        {
            var getPlaylistById = await GetRequest<FilmTeamPlaylist>($"api/PlaylistClips/PlaylistInfo/{playlistId}", token, null, cancellationToken);
            return getPlaylistById;
        }

        public async Task<BindingList<Clip>> GetPlaylistClipsViewById(int playlistId, int playlistView, string token, CancellationToken cancellationToken = default)
        {
            var getPlaylistClipsViewById = await GetRequest<BindingList<Clip>>($"/api/PlaylistClips/GetPlayListClips/{playlistId}/{playlistView}", token, null, cancellationToken);
            return getPlaylistClipsViewById;
        }


        public async Task<IEnumerable<FilmTeamPlaylist>> GetTeamPlaylists(int teamId, int userId, string view, string token, CancellationToken cancellationToken = default)
        {
            var getTeamPlaylists = await GetRequest<IEnumerable<FilmTeamPlaylist>>($"api/PlaylistClips/TeamsPlayList/{teamId}/{userId}/{view}", token, null, cancellationToken);
            return getTeamPlaylists;
        }


        public async Task<Playlist> AddUpdatePlaylist(Playlist playlist, string token, CancellationToken cancellationToken = default)
        {
            var addUpdatePlaylist = await PutRequest<Playlist>($"api/PlaylistClips/{playlist}", token, null, cancellationToken);
            return addUpdatePlaylist;
        }

        public async Task<bool> AddClipsToPlaylisty(int playlistId, IEnumerable<int> clipIdList, string token, CancellationToken cancellationToken = default)
        {
            var addClipsToPlaylisty = await PutRequest<bool>($"api/PlaylistClips/PlaylistClip/{playlistId}", token, null, cancellationToken);
            return addClipsToPlaylisty;
        }

        public async Task<string> GetClipGUID(int clipId, string token, CancellationToken cancellationToken = default)
        {
            var getClipGUID = await GetRequest<string>($"api/PlaylistClips/GetClipGuid/{clipId}", token, null, cancellationToken);
            return getClipGUID;
        }

        public async Task<IEnumerable<ClipComment>> GetClipCommentsByClipId(int clipId, string token, CancellationToken cancellationToken = default)
        {
            var getClipCommentsByClipId = await GetRequest<IEnumerable<ClipComment>>($"api/User/TeamInfo/{clipId}", token, null, cancellationToken);
            return getClipCommentsByClipId;
        }

        public async Task<ClipComment> AddUpdateClipComment(ClipComment clipComment, string token, CancellationToken cancellationToken = default)
        {
            var addUpdateClipComment = await PutRequest<ClipComment>($"api/PlaylistClips/{clipComment}", token, null, cancellationToken);
            return addUpdateClipComment;
        }
        public async Task<bool> DeleteClipComment(int commentId, int userId, string token, CancellationToken cancellationToken = default)
        {
            var deleteClipComment = await PutRequest<bool>($"/api/PlaylistClips/DeleteComment/{commentId}/{userId}", token, null, cancellationToken);
            return deleteClipComment;
        }

        public async Task<IEnumerable<ClipDrawing>> GetClipDrawingByClipId(int clipId, string token, CancellationToken cancellationToken = default)
        {
            var getClipDrawingByClipId = await GetRequest<IEnumerable<ClipDrawing>>($"api/PlaylistClips/Drawing/{clipId}", token, null, cancellationToken);
            return getClipDrawingByClipId;
        }

        public async Task<ClipDrawing> AddUpdateClipDrawing(ClipDrawing clipDrawing, string token, CancellationToken cancellationToken = default)
        {
            var addUpdateClipDrawing = await PutRequest<ClipDrawing>($"api/PlaylistClips/{clipDrawing}", token, null, cancellationToken);
            return addUpdateClipDrawing;
        }

        public async Task<bool> DeleteClipDrawing(int teamId, int drawingId, int userId, string token, CancellationToken cancellationToken = default)
        {
            var deleteClipDrawing = await PutRequest<bool>($"api/PlaylistClips/Drawing/{teamId}/{userId}/{drawingId}", token, null, cancellationToken);
            return deleteClipDrawing;
        }
        public async Task<ClipOperationAccess> GetOperationAccess(int teamId, int userRole, string token, CancellationToken cancellationToken = default)
        {
            var getOperationAccess = await GetRequest<ClipOperationAccess>($"api/PlaylistClips/OperationAccess/{teamId}/{userRole}", token, null, cancellationToken);
            return getOperationAccess;
        }

        public async Task<IEnumerable<ClipAttachment>> GetClipAttachmentByClipId(int clipId, string token, CancellationToken cancellationToken = default)
        {
            var getClipAttachmentByClipId = await GetRequest<IEnumerable<ClipAttachment>>($"/api/PlaylistClips/Attachment/{clipId}", token, null, cancellationToken);
            return getClipAttachmentByClipId;
        }
        public async Task<ClipAttachment> AddUpdateClipAttachment(ClipAttachment clipAttachment, string token, CancellationToken cancellationToken = default)
        {
            var addUpdateClipAttachment = await PutRequest<ClipAttachment>($"/api/PlaylistClips/{clipAttachment}", token, null, cancellationToken);
            return addUpdateClipAttachment;
        }

        public async Task<bool> DeleteClipAttachment(int attachmntId, int userId, string token, CancellationToken cancellationToken = default)
        {
            var deleteClipAttachment = await PutRequest<bool>($"api/PlaylistClips/Attachment/{attachmntId}/{userId}", token, null, cancellationToken);
            return deleteClipAttachment;
        }


        //public async Task<Clip> UpdateClipTags(Clip clipTags, string tagName, string token, CancellationToken cancellationToken = default)
        //{
        //    var updateClipTags = await GetRequest<Team>($"/api/PlaylistClips/{clipTags}", token, null, cancellationToken);
        //    switch (tagName)
        //    {
        //        case "misc":
        //            updateClipTags = $"{updateClipTags}/MiscPlaylistTag";
        //            break;

        //        case "football":
        //            updateClipTags = $"{updateClipTags}/FootballPlaylistTag";
        //            break;

        //        case "sport":
        //            updateClipTags = $"{updateClipTags}/SportPlaylistTag";
        //            break;

        //        case "volleyball":
        //            updateClipTags = $"{updateClipTags}/VolleyballPlaylistTag";
        //            break;

        //        default:
        //            break;

        //    }
        //    return updateClipTags;
        //    if (response == "true")
        //        return clipTags;
        //    else
        //        return null;
        //}

        public async Task<Clip> AddClipTags(Clip clipTag, string token, CancellationToken cancellationToken = default)
        {
            var addClipTags = await PutRequest<Clip>($"/api/PlaylistClips", token, null, cancellationToken);
            return addClipTags;
        }
        public async Task<bool> DeleteClipTag(int teamId, int userId, int pcId, string token, CancellationToken cancellationToken = default)
        {
            var deleteClipTag = await PutRequest<bool>($"/api/PlaylistClips/PlaylistTag/{teamId}/{userId}/{pcId}", token, null, cancellationToken);
            return deleteClipTag;
        }

        public async Task<bool> DeletePlaylist(int userId, int playListId, string token, CancellationToken cancellationToken = default)
        {
            var deletePlaylist = await PutRequest<bool>($"/api/PlaylistClips/Playlist/{userId}/{playListId}", token, null, cancellationToken);
            return deletePlaylist;
        }


        public async Task<HighlightClip> AddClipHighlight(HighlightClip highlight, string token, CancellationToken cancellationToken = default)
        {
            var addClipHighlight = await PutRequest<HighlightClip>($"/api/Highlights/{highlight}", token, null, cancellationToken);
            return addClipHighlight;
        }
        public async Task<IEnumerable<AvailableUser>> GetAvailableUsers(int teamId, string token, CancellationToken cancellationToken = default)
        {
            var getAvailableUsers = await GetRequest<IEnumerable<AvailableUser>>($"api/PlaylistClips/AvailableUserGroup/{teamId}", token, null, cancellationToken);
            return getAvailableUsers;
        }
        public async Task<IEnumerable<UserRoster>> GetUserRoster(int teamId, string token, CancellationToken cancellationToken = default)
        {
            var getUserRoster = await GetRequest<IEnumerable<UserRoster>>($"api/PlaylistClips/UserRoster/{teamId}", token, null, cancellationToken);
            return getUserRoster;
        }

        public async Task<bool> ImportPlaylistTags(TagImport tagImportModel, string token, CancellationToken cancellationToken = default)
        {
            var importPlaylistTags = await PutRequest<bool>($"api/PlaylistClips/PlaylistTagImport", token, null, cancellationToken);
            return importPlaylistTags;
        }
        public async Task<bool> DownloadPlaylist(Download playlistToDownload, string token, CancellationToken cancellationToken = default)
        {
            var downloadPlaylist = await PutRequest<bool>($"api/PlaylistClips/PlaylistDownload", token, null, cancellationToken);
            return downloadPlaylist;
        }

        public async Task<bool> UpdatePlaylistFavoriteStatus(PlaylistFavoriteStatus favoriteStatus, string token, CancellationToken cancellationToken = default)
        {
            var updatePlaylistFavoriteStatus = await PutRequest<bool>($"/api/PlaylistClips/AddToFavorite", favoriteStatus, token,  cancellationToken);
            return updatePlaylistFavoriteStatus;
        }

        
        public async Task<Clip> UpdateClipTags(Clip clipTags, string tagName, string token, CancellationToken cancellationToken = default)
        {
            var url = $"/api/PlaylistClips";
            switch (tagName)
            {
                case "misc":
                    url = $"{url}/MiscPlaylistTag";
                    break;

                case "football":
                    url = $"{url}/FootballPlaylistTag";
                    break;

                case "sport":
                    url = $"{url}/SportPlaylistTag";
                    break;

                case "volleyball":
                    url = $"{url}/VolleyballPlaylistTag";
                    break;

                default:
                    break;

            }

            var updateClipTags = await PutRequest<Clip>(url, token, null, cancellationToken);
            return updateClipTags;
        }

        public async Task<bool> DeletePlaylistClip(int playlistClipId, int userId, string token, CancellationToken cancellationToken = default)
        {
            var deletePlaylistClip = await PutRequest<bool>($"/api/PlaylistClips/Playlist/{userId}/{playlistClipId}", token, null, cancellationToken);
            return deletePlaylistClip;
        }



    }
}
