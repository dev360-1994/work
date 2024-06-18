import React from 'react';

export const PlaylistContext = React.createContext({
    playlistId: 0,
    view: 0,
    clipId: 0,
    order: 1
});