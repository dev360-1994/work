using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Newtonsoft.Json;
using wgfapp.Common.Interfaces;
using wgfapp.Common.Models;
using wgfapp.Service.Interfaces;

namespace wgfapp.Service.Implementation
{
    public class PlaylistClipsService : BaseAPIService, IPlaylistClipsService
    {
        private readonly IConfig _config;

        public PlaylistClipsService(IConfig config) : base(config)
        {
            _config = config;
        }

        //StatusCode - 500
        public async Task<ApiBaseResponse<string>> AddAttachment(Attachment attachment, string token, CancellationToken cancellationToken = default)
        {
            var addAttachment = await PostRequest("api/PlaylistClips/Attachment", attachment, token, null, null, cancellationToken);
            return new ApiBaseResponse<string>()
            {
                Status = addAttachment.StatusCode,
                Message = addAttachment.StatusCode != System.Net.HttpStatusCode.OK ? addAttachment.Content.ToString() : "Attachment added successfully",
            };
        }

        public async Task<Comment> AddComment(Comment comment, string token, CancellationToken cancellationToken = default)
        {
            var addcomment = await PostRequest<Comment>("api/PlaylistClips/AddComment", comment, token, cancellationToken);
            return addcomment;
        }

        //StatusCode - 400
        public async Task<ApiBaseResponse<string>> AddDefaultClip(AddDefaultClip addDefaultClip, string token, CancellationToken cancellationToken = default)
        {
            var addDefaultClipResponse = await PostRequest("api/PlaylistClips/AddDefaultClipOnPlaylist", addDefaultClip, token, null, null, cancellationToken);
            return new ApiBaseResponse<string>()
            {
                Status = addDefaultClipResponse.StatusCode,
                Message = addDefaultClipResponse.StatusCode != System.Net.HttpStatusCode.OK ? addDefaultClipResponse.Content.ToString() : "Added default clip on playlist",
            };
        }

        //StatusCode - 500
        public async Task<ApiBaseResponse<string>> AddHighlightClip(HighlightClip highlightClip, string token, CancellationToken cancellationToken = default)
        {
            var addHighlightClip = await PostRequest("api/PlaylistClips/HighlightClip", highlightClip, token, null, null, cancellationToken);
            return new ApiBaseResponse<string>()
            {
                Status = addHighlightClip.StatusCode,
                Message = addHighlightClip.StatusCode != System.Net.HttpStatusCode.OK ? addHighlightClip.Content.ToString() : "Highlight added successfully",
            };
        }

        public async Task<ApiBaseResponse<bool>> AddPlaylistTag(PlaylistClips playlistClips, string token, CancellationToken cancellationToken = default)
        {
            var addPlaylistTag = await PostRequest("api/PlaylistClips/PlaylistTag", playlistClips, null, null, token, cancellationToken);
            return new ApiBaseResponse<bool>()
            {
                Status = addPlaylistTag.StatusCode,
                Message = addPlaylistTag.StatusCode != System.Net.HttpStatusCode.OK ? addPlaylistTag.Content.ToString() : "Playlist tag added successfully",
                Data = addPlaylistTag.StatusCode == System.Net.HttpStatusCode.OK
            };
        }

        //StatusCode - 204
        public async Task<ApiBaseResponse<string>> DeleteAttachment(int attachmentId, string token, CancellationToken cancellationToken = default)
        {
            var deleteAttachment = await DeleteRequest($"api/PlaylistClips/Attachment/{attachmentId}", null, token, cancellationToken);
            return new ApiBaseResponse<string>()
            {
                Status = deleteAttachment.StatusCode,
                Message = deleteAttachment.StatusCode != System.Net.HttpStatusCode.OK ? deleteAttachment.Content.ToString() : "Attachment deleted successfully",
            };
        }

        public async Task<ApiBaseResponse<bool>> DeleteComment(Comment comments, string token, CancellationToken cancellationToken = default)
        {

            var deletecomment = await DeleteRequest($"api/PlaylistClips/DeleteComment/{comments.Id}/{comments.UserId}", null, token, cancellationToken);
            return new ApiBaseResponse<bool>()
            {
                Status = deletecomment.StatusCode,
                Message = deletecomment.StatusCode != System.Net.HttpStatusCode.OK ? deletecomment.Content.ToString() : "Comment deleted successfully",
                Data = deletecomment.StatusCode == System.Net.HttpStatusCode.OK
            };
        }

        public async Task<ApiBaseResponse<string>> DeleteDrawing(Drawing drawing, string token, CancellationToken cancellationToken = default)
        {
            var deleteDrawingResponse = await DeleteRequest($"api/PlaylistClips/Drawing/{drawing.TeamId}/{drawing.UserId}/{drawing.Id}", null, token, cancellationToken);
            return new ApiBaseResponse<string>()
            {
                Status = deleteDrawingResponse.StatusCode,
                Message = deleteDrawingResponse.StatusCode != System.Net.HttpStatusCode.OK ? deleteDrawingResponse.Content.ToString() : "Drawing deleted successfully",
            };
        }

        //StatusCode - 204
        public async Task<ApiBaseResponse<string>> DeletePlaylist(PlaylistClips playlistClips, string token, CancellationToken cancellationToken = default)
        {
            var deletePlaylist = await DeleteRequest($"api/PlaylistClips/Playlist/{playlistClips.UserId}/{playlistClips.PcId}", null, token, cancellationToken);
            return new ApiBaseResponse<string>()
            {
                Status = deletePlaylist.StatusCode,
                Message = deletePlaylist.StatusCode != System.Net.HttpStatusCode.OK ? deletePlaylist.Content.ToString() : "Playlist deleted successfully",
            };
        }

        public async Task<ApiBaseResponse<bool>> DeletePlaylistTag(PlaylistClips playlistClips, string token, CancellationToken cancellationToken = default)
        {
            var deletePlaylistTag = await DeleteRequest($"api/PlaylistClips/PlaylistTag/{playlistClips.TeamId}/{playlistClips.UserId}/{playlistClips.PcId}", null, token, cancellationToken);
            return new ApiBaseResponse<bool>()
            {
                Status = deletePlaylistTag.StatusCode,
                Message = deletePlaylistTag.StatusCode != System.Net.HttpStatusCode.OK ? deletePlaylistTag.Content.ToString() : "Playlist tag deleted successfully",
                Data = deletePlaylistTag.StatusCode == System.Net.HttpStatusCode.OK
            };
        }

        public async Task<ApiBaseResponse<Guid?>> GetClipGuid(int clipId, string token, CancellationToken cancellationToken = default)
        {
            var clipGuid = await GetRequest($"api/PlaylistClips/GetClipGuid/{clipId}", token, null, cancellationToken);
            try
            {
                ErrorResponse errorResponse = JsonConvert.DeserializeObject<ErrorResponse>(clipGuid.Content);
                return new ApiBaseResponse<Guid?>() { Status = System.Net.HttpStatusCode.NoContent, Message = errorResponse.Message, Data = null };
            }
            catch (JsonSerializationException ex)
            {
                return new ApiBaseResponse<Guid?>() { Status = clipGuid.StatusCode, Message = "Clip guid get successfully", Data = new Guid(clipGuid.Content) };
            }
            catch (Exception ex)
            {
                return new ApiBaseResponse<Guid?>() { Status = System.Net.HttpStatusCode.NoContent, Message = "There are no clip guid found", Data = null };
            }
        }

        public async Task<IList<Comment>> GetComments(int clipId, string token, CancellationToken cancellationToken = default)
        {
            var getComments = await GetRequest<IList<Comment>>($"api/PlaylistClips/Comments/{clipId}", token, null, cancellationToken);
            return getComments;
        }

        //StatusCode - 204
        public async Task<ApiBaseResponse<Drawing>> GetDrawing(int clipGuid, string token, CancellationToken cancellationToken = default)
        {
            var getDrawing = await GetRequest($"api/PlaylistClips/Drawing/{clipGuid}", token, null, cancellationToken);
            try
            {
                ErrorResponse errorResponse = JsonConvert.DeserializeObject<ErrorResponse>(getDrawing.Content);
                return new ApiBaseResponse<Drawing>() { Status = System.Net.HttpStatusCode.NoContent, Message = errorResponse.Message, Data = null };
            }
            catch (JsonSerializationException ex)
            {
                return new ApiBaseResponse<Drawing>() { Status = getDrawing.StatusCode, Message = "Drawing get successfully", Data = JsonConvert.DeserializeObject<Drawing>(getDrawing.Content) };
            }
            catch (Exception ex)
            {
                return new ApiBaseResponse<Drawing>() { Status = System.Net.HttpStatusCode.NoContent, Message = "There are no drawing found", Data = null };
            }
        }

        public async Task<IList<PlaylistFilms>> GetFilms(int filmId, string token, CancellationToken cancellationToken = default)
        {
            var getFilms = await GetRequest<IList<PlaylistFilms>>($"api/PlaylistClips/Film/{filmId}", token, null, cancellationToken);
            return getFilms;
        }

        public async Task<ApiBaseResponse<OperationAccess>> GetOperationAccess(RequestOperationAccess requestOperationAccess, string token, CancellationToken cancellationToken = default)
        {
            var getOperationAccess = await GetRequest($"api/PlaylistClips/OperationAccess/{requestOperationAccess.TeamId}/{requestOperationAccess.UserRole}", token, null, cancellationToken);
            try
            {
                return new ApiBaseResponse<OperationAccess>() { Status = getOperationAccess.StatusCode, Message = "Operation access get successfully", Data = JsonConvert.DeserializeObject<OperationAccess>(getOperationAccess.Content) };
            }
            catch (JsonSerializationException ex)
            {
                ErrorResponse errorResponse = JsonConvert.DeserializeObject<ErrorResponse>(getOperationAccess.Content);
                return new ApiBaseResponse<OperationAccess>() { Status = System.Net.HttpStatusCode.NoContent, Message = errorResponse.Message, Data = null };
            }
            catch (Exception ex)
            {
                return new ApiBaseResponse<OperationAccess>() { Status = System.Net.HttpStatusCode.NoContent, Message = "There are no operation access found", Data = null };
            }
        }

        public async Task<IList<PlaylistClips>> GetPlaylistClips(PlaylistClips playlistClips, string token, CancellationToken cancellationToken = default)
        {
            var getPlaylistClips = await GetRequest<IList<PlaylistClips>>($"api/PlaylistClips/GetPlayListClips/{playlistClips.PlaylistId}/{playlistClips.PlayListView}", token, null, cancellationToken);
            return getPlaylistClips;
        }

        public async Task<PlaylistInfo> GetPlayListInfo(int playlistClips, string token, CancellationToken cancellationToken = default)
        {
            var getPlaylistInfo = await GetRequest<PlaylistInfo>($"api/PlaylistClips/PlayListInfo/{playlistClips}", token, null, cancellationToken);
            return getPlaylistInfo;
        }

        public async Task<IList<TeamPlayList>> GetTeamPlaylist(int teamId, string token, CancellationToken cancellationToken = default)
        {
            var teamPlaylist = await GetRequest<IList<TeamPlayList>>($"api/PlaylistClips/TeamsPlayList/{teamId}", token, null, cancellationToken);
            return teamPlaylist;
        }

        public async Task<Drawing> PostDrawing(Drawing drawing, string token, CancellationToken cancellationToken = default)
        {
            var addedDrawing = await PostRequest<Drawing>("api/PlaylistClips/Drawing", drawing, token, cancellationToken);
            return addedDrawing;
        }


        //StatusCode - 204
        public async Task<ApiBaseResponse<Attachment>> SelectAttachment(int clipGuid, string token, CancellationToken cancellationToken = default)
        {
            var selectAttachment = await GetRequest($"api/PlaylistClips/Attachment/{clipGuid}", token, null, cancellationToken);
            try
            {
                ErrorResponse errorResponse = JsonConvert.DeserializeObject<ErrorResponse>(selectAttachment.Content);
                return new ApiBaseResponse<Attachment>() { Status = System.Net.HttpStatusCode.NoContent, Message = errorResponse.Message, Data = null };
            }
            catch (JsonSerializationException ex)
            {
                return new ApiBaseResponse<Attachment>() { Status = selectAttachment.StatusCode, Message = "Attachment get successfully", Data = JsonConvert.DeserializeObject<Attachment>(selectAttachment.Content) };
            }
            catch (Exception ex)
            {
                return new ApiBaseResponse<Attachment>() { Status = System.Net.HttpStatusCode.NoContent, Message = "There is no attachment found", Data = null };
            }
        }

        //StatusCode - 500
        public async Task<ApiBaseResponse<string>> UpdateAttachment(Attachment attachment, string token, CancellationToken cancellationToken = default)
        {
            var updateAttachment = await PutRequest("api/PlaylistClips/Attachment", attachment, token, null, cancellationToken);
            return new ApiBaseResponse<string>()
            {
                Status = updateAttachment.StatusCode,
                Message = updateAttachment.StatusCode != System.Net.HttpStatusCode.OK ? updateAttachment.Content.ToString() : "Attachment updated successfully",
            };
        }

        public async Task<ApiBaseResponse<bool>> UpdateComment(Comment comments, string token, CancellationToken cancellationToken = default)
        {
            var updateComment = await PutRequest("api/PlaylistClips/UpdateComment", comments, token, null, cancellationToken);
            return new ApiBaseResponse<bool>()
            {
                Status = updateComment.StatusCode,
                Message = updateComment.StatusCode != System.Net.HttpStatusCode.OK ? updateComment.Content.ToString() : "Comment updated successfully",
                Data = updateComment.StatusCode == System.Net.HttpStatusCode.OK,
            };
        }

        public async Task<ApiBaseResponse<string>> UpdateDrawing(Drawing drawing, string token, CancellationToken cancellationToken = default)
        {
            var updateDrawing = await PutRequest("api/PlaylistClips/Drawing", drawing, token, null, cancellationToken);
            return new ApiBaseResponse<string>()
            {
                Status = updateDrawing.StatusCode,
                Message = updateDrawing.StatusCode != System.Net.HttpStatusCode.OK ? updateDrawing.Content.ToString() : "Drawing update successfully",
            };
        }

        public async Task<ApiBaseResponse<bool>> UpdateFootballPlaylistTag(PlaylistClips playlistClips, string token, CancellationToken cancellationToken = default)
        {
            var updateFootballPlaylistTag = await PutRequest("api/PlaylistClips/FootballPlaylistTag", playlistClips, token, null, cancellationToken);
            return new ApiBaseResponse<bool>()
            {
                Status = updateFootballPlaylistTag.StatusCode,
                Message = updateFootballPlaylistTag.StatusCode != System.Net.HttpStatusCode.OK ? updateFootballPlaylistTag.Content.ToString() : "Football playlist tag updated successfully",
                Data = updateFootballPlaylistTag.StatusCode == System.Net.HttpStatusCode.OK
            };
        }

        public async Task<ApiBaseResponse<bool>> UpdateMiscPlaylistTag(PlaylistClips playlistClips, string token, CancellationToken cancellationToken = default)
        {
            var updateMiscPlaylistTag = await PutRequest("api/PlaylistClips/MiscPlaylistTag", playlistClips, token, null, cancellationToken);
            return new ApiBaseResponse<bool>()
            {
                Status = updateMiscPlaylistTag.StatusCode,
                Message = updateMiscPlaylistTag.StatusCode != System.Net.HttpStatusCode.OK ? updateMiscPlaylistTag.Content.ToString() : "Music playlist tag updated successfully",
                Data = updateMiscPlaylistTag.StatusCode == System.Net.HttpStatusCode.OK
            };
        }

        //StatusCode - 204
        public async Task<ApiBaseResponse<string>> UpdateSportPlaylistTag(PlaylistClips playlistClips, string token, CancellationToken cancellationToken = default)
        {
            var updateSportPlaylistTag = await PutRequest("api/PlaylistClips/SportPlaylistTag", playlistClips, token, null, cancellationToken);
            return new ApiBaseResponse<string>()
            {
                Status = updateSportPlaylistTag.StatusCode,
                Message = updateSportPlaylistTag.StatusCode != System.Net.HttpStatusCode.OK ? updateSportPlaylistTag.Content.ToString() : "Sport playlist tag updated successfully",
            };
        }

        //StatusCode - 204
        public async Task<ApiBaseResponse<string>> UpdateVolleyballPlaylistTag(PlaylistClips playlistClips, string token, CancellationToken cancellationToken = default)
        {
            var updateVolleyballPlaylistTag = await PutRequest("api/PlaylistClips/VolleyballPlaylistTag", playlistClips, token, null, cancellationToken);
            return new ApiBaseResponse<string>()
            {
                Status = updateVolleyballPlaylistTag.StatusCode,
                Message = updateVolleyballPlaylistTag.StatusCode != System.Net.HttpStatusCode.OK ? updateVolleyballPlaylistTag.Content.ToString() : "Volleyball playlist tag updated successfully",
            };
        }
    }
}
