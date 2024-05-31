export enum AppRoute {
    ACTION_REQUIRED = '/action-required',
    EXPLORE = '/explore',
    FAKE_LIBRARY_ALBUM_DETAILS = '/library/albums/dummy/:albumId',
    HOME = '/',
    LIBRARY_ALBUMS = '/library/albums',
    LIBRARY_ALBUMS_DETAIL = '/library/albums/:albumId',
    LIBRARY_ALBUM_ARTISTS = '/library/album-artists',
    LIBRARY_ALBUM_ARTISTS_DETAIL = '/library/album-artists/:albumArtistId',
    LIBRARY_ALBUM_ARTISTS_DETAIL_DISCOGRAPHY = '/library/album-artists/:albumArtistId/discography',
    LIBRARY_ALBUM_ARTISTS_DETAIL_SONGS = '/library/album-artists/:albumArtistId/songs',
    LIBRARY_ALBUM_ARTISTS_DETAIL_TOP_SONGS = '/library/album-artists/:albumArtistId/top-songs',
    LIBRARY_ARTISTS = '/library/artists',
    LIBRARY_ARTISTS_DETAIL = '/library/artists/:artistId',
    LIBRARY_FOLDERS = '/library/folders',
    LIBRARY_GENRES = '/library/genres',
    LIBRARY_GENRES_ALBUMS = '/library/genres/:genreId/albums',
    LIBRARY_GENRES_SONGS = '/library/genres/:genreId/songs',
    LIBRARY_SONGS = '/library/songs',
    NOW_PLAYING = '/now-playing',
    PLAYING = '/playing',
    PLAYLISTS = '/playlists',
    PLAYLISTS_DETAIL = '/playlists/:playlistId',
    PLAYLISTS_DETAIL_SONGS = '/playlists/:playlistId/songs',
    SEARCH = '/search/:itemType',
    SERVERS = '/servers',
    SETTINGS = '/settings',
}