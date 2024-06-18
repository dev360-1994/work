export class PlaylistModel {
    team: number = 0;
    playlist: number = 0;
    favourite: boolean = true;
    dateExpiry?: Date = undefined;
    group: string = "";
    name: string = "";
    view: number = 0;
    tags: string = "";
    cameras: number = 0;
    clips: number = 0;
    filter: string = "";

};

export class FavoriteStatusModel {
    playlist: number = 0;
    user?: number = 0;
    isFavorite: number = 0;
};