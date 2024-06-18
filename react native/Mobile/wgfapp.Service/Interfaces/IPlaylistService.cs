using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Threading;
using System.Threading.Tasks;
using wgfapp.Common.Models;

namespace wgfapp.Service.Interfaces
{
    public interface IPlaylistService
    {
        Task<IEnumerable<FilmTeamPlaylist>> GetTeamPlaylists(int teamId, int userId, string view, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<BindingList<Clip>> GetPlaylistClipsViewById(int playlistId, int playlistView, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<FilmTeamPlaylist> GetPlaylistById(int playlistId, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<Playlist> AddUpdatePlaylist(Playlist playlist, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<bool> AddClipsToPlaylisty(int playlistId, IEnumerable<int> clipIdList, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<string> GetClipGUID(int clipId, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<IEnumerable<ClipComment>> GetClipCommentsByClipId(int clipId, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<ClipComment> AddUpdateClipComment(ClipComment clipComment, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<bool> DeleteClipComment(int commentId, int userId, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<IEnumerable<ClipDrawing>> GetClipDrawingByClipId(int clipId, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<ClipDrawing> AddUpdateClipDrawing(ClipDrawing clipDrawing, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<bool> DeleteClipDrawing(int teamId, int drawingId, int userId, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<ClipOperationAccess> GetOperationAccess(int teamId, int userRole, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<IEnumerable<ClipAttachment>> GetClipAttachmentByClipId(int clipId, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<ClipAttachment> AddUpdateClipAttachment(ClipAttachment clipAttachment, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<bool> DeleteClipAttachment(int attachmntId, int userId, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<Clip> AddClipTags(Clip clipTag, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<bool> ImportPlaylistTags(TagImport tagImportModel, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<Clip> UpdateClipTags(Clip clipTags, string tagName, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<bool> DeletePlaylist(int userId, int playlistId, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<bool> DeleteClipTag(int teamId, int userId, int pcId, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<HighlightClip> AddClipHighlight(HighlightClip highlight, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<IEnumerable<AvailableUser>> GetAvailableUsers(int teamId, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<IEnumerable<UserRoster>> GetUserRoster(int teamId, string token, CancellationToken cancellationToken = default(CancellationToken));

        Task<bool> DownloadPlaylist(Download playlistToDownload, string token, CancellationToken cancellationToken = default(CancellationToken));

        Task<bool> UpdatePlaylistFavoriteStatus(PlaylistFavoriteStatus favoriteStatus, string token, CancellationToken cancellationToken = default(CancellationToken));
       // Task<bool> UpdatePlaylistClip(UpdatePlayList updatePlayList, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<bool> DeletePlaylistClip(int playlistClipId, int userId, string token, CancellationToken cancellationToken = default(CancellationToken));
    }
}
