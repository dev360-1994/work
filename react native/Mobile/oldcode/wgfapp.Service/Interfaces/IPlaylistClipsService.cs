using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using wgfapp.Common.Models;

namespace wgfapp.Service.Interfaces
{
    public interface IPlaylistClipsService
    {
        Task<ApiBaseResponse<string>> AddDefaultClip(AddDefaultClip addDefaultClip, string token, CancellationToken cancellationToken = default(CancellationToken)); //StatusCode - 400
        Task<IList<PlaylistFilms>> GetFilms(int filmId, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<IList<TeamPlayList>> GetTeamPlaylist(int teamPlayList, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<IList<PlaylistClips>> GetPlaylistClips(PlaylistClips playlistClips, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<ApiBaseResponse<Guid?>> GetClipGuid(int clipGuid, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<IList<Comment>> GetComments(int clipGuid, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<Comment> AddComment(Comment comment, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<ApiBaseResponse<bool>> UpdateComment(Comment comment, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<ApiBaseResponse<bool>> DeleteComment(Comment comment, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<ApiBaseResponse<Drawing>> GetDrawing(int clipGuid, string token, CancellationToken cancellationToken = default(CancellationToken)); //StatusCode - 204
        Task<Drawing> PostDrawing(Drawing drawing, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<ApiBaseResponse<string>> UpdateDrawing(Drawing drawing, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<ApiBaseResponse<string>> DeleteDrawing(Drawing drawing, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<PlaylistInfo> GetPlayListInfo(int playlistClips, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<ApiBaseResponse<OperationAccess>> GetOperationAccess(RequestOperationAccess requestOperationAccess, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<ApiBaseResponse<Attachment>> SelectAttachment(int clipGuid, string token, CancellationToken cancellationToken = default(CancellationToken)); //StatusCode - 204
        Task<ApiBaseResponse<string>> DeleteAttachment(int attachmentId, string token, CancellationToken cancellationToken = default(CancellationToken)); //StatusCode - 204
        Task<ApiBaseResponse<string>> UpdateAttachment(Attachment attachment, string token, CancellationToken cancellationToken = default(CancellationToken)); //StatusCode - 500
        Task<ApiBaseResponse<string>> AddAttachment(Attachment attachment, string token, CancellationToken cancellationToken = default(CancellationToken)); //StatusCode - 500
        Task<ApiBaseResponse<bool>> DeletePlaylistTag(PlaylistClips playlistClips, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<ApiBaseResponse<string>> DeletePlaylist(PlaylistClips playlistClips, string token, CancellationToken cancellationToken = default(CancellationToken)); //StatusCode - 204
        Task<ApiBaseResponse<bool>> AddPlaylistTag(PlaylistClips playlistClips, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<ApiBaseResponse<bool>> UpdateMiscPlaylistTag(PlaylistClips playlistClips, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<ApiBaseResponse<bool>> UpdateFootballPlaylistTag(PlaylistClips playlistClips, string token, CancellationToken cancellationToken = default(CancellationToken));
        Task<ApiBaseResponse<string>> UpdateSportPlaylistTag(PlaylistClips playlistClips, string token, CancellationToken cancellationToken = default(CancellationToken)); //StatusCode - 204
        Task<ApiBaseResponse<string>> UpdateVolleyballPlaylistTag(PlaylistClips playlistClips, string token, CancellationToken cancellationToken = default(CancellationToken)); //StatusCode - 204
        Task<ApiBaseResponse<string>> AddHighlightClip(HighlightClip highlightClip, string token, CancellationToken cancellationToken = default(CancellationToken));//StatusCode - 500
    }
}
