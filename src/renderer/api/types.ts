import orderBy from 'lodash/orderBy';
import reverse from 'lodash/reverse';
import shuffle from 'lodash/shuffle';
import { z } from 'zod';
import { ServerFeatures } from './features-types';
import { jfType } from './jellyfin/jellyfin-types';
import {
    JFSortOrder,
    JFAlbumListSort,
    JFSongListSort,
    JFAlbumArtistListSort,
    JFArtistListSort,
    JFPlaylistListSort,
    JFGenreListSort,
} from './jellyfin.types';
import { ndType } from './navidrome/navidrome-types';
import {
    NDSortOrder,
    NDOrder,
    NDAlbumListSort,
    NDAlbumArtistListSort,
    NDPlaylistListSort,
    NDSongListSort,
    NDUserListSort,
    NDGenreListSort,
} from './navidrome.types';

export enum LibraryItem {
    ALBUM = 'album',
    ALBUM_ARTIST = 'albumArtist',
    ARTIST = 'artist',
    GENRE = 'genre',
    PLAYLIST = 'playlist',
    SONG = 'song',
}

export type AnyLibraryItem = Album | AlbumArtist | Artist | Playlist | Song | QueueSong;

export type AnyLibraryItems =
    | Album[]
    | AlbumArtist[]
    | Artist[]
    | Playlist[]
    | Song[]
    | QueueSong[];

export enum SortOrder {
    ASC = 'ASC',
    DESC = 'DESC',
}

export type User = {
    createdAt: string | null;
    email: string | null;
    id: string;
    isAdmin: boolean | null;
    lastLoginAt: string | null;
    name: string;
    updatedAt: string | null;
};

export type ServerListItem = {
    credential: string;
    features?: ServerFeatures;
    id: string;
    name: string;
    ndCredential?: string;
    savePassword?: boolean;
    type: ServerType;
    url: string;
    userId: string | null;
    username: string;
    version?: string;
};

export enum ServerType {
    JELLYFIN = 'jellyfin',
    NAVIDROME = 'navidrome',
    SUBSONIC = 'subsonic',
}

export type QueueSong = Song & {
    uniqueId: string;
};

type SortOrderMap = {
    jellyfin: Record<SortOrder, JFSortOrder>;
    navidrome: Record<SortOrder, NDSortOrder>;
    subsonic: Record<SortOrder, undefined>;
};

export const sortOrderMap: SortOrderMap = {
    jellyfin: {
        ASC: JFSortOrder.ASC,
        DESC: JFSortOrder.DESC,
    },
    navidrome: {
        ASC: NDSortOrder.ASC,
        DESC: NDSortOrder.DESC,
    },
    subsonic: {
        ASC: undefined,
        DESC: undefined,
    },
};

export enum ExternalSource {
    LASTFM = 'LASTFM',
    MUSICBRAINZ = 'MUSICBRAINZ',
    SPOTIFY = 'SPOTIFY',
    THEAUDIODB = 'THEAUDIODB',
}

export enum ExternalType {
    ID = 'ID',
    LINK = 'LINK',
}

export enum ImageType {
    BACKDROP = 'BACKDROP',
    LOGO = 'LOGO',
    PRIMARY = 'PRIMARY',
    SCREENSHOT = 'SCREENSHOT',
}

export type EndpointDetails = {
    server: ServerListItem;
};

export interface BasePaginatedResponse<T> {
    error?: string | any;
    items: T;
    startIndex: number;
    totalRecordCount: number | null;
}

export type AuthenticationResponse = {
    credential: string;
    ndCredential?: string;
    userId: string | null;
    username: string;
};

export type Genre = {
    albumCount?: number;
    id: string;
    imageUrl: string | null;
    itemType: LibraryItem.GENRE;
    name: string;
    songCount?: number;
};

export type Album = {
    albumArtist: string;
    albumArtists: RelatedArtist[];
    artists: RelatedArtist[];
    backdropImageUrl: string | null;
    comment: string | null;
    createdAt: string;
    duration: number | null;
    genres: Genre[];
    id: string;
    imagePlaceholderUrl: string | null;
    imageUrl: string | null;
    isCompilation: boolean | null;
    itemType: LibraryItem.ALBUM;
    lastPlayedAt: string | null;
    mbzId: string | null;
    name: string;
    originalDate: string | null;
    participants: Record<string, RelatedArtist[]> | null;
    playCount: number | null;
    releaseDate: string | null;
    releaseYear: number | null;
    serverId: string;
    serverType: ServerType;
    size: number | null;
    songCount: number | null;
    songs?: Song[];
    uniqueId: string;
    updatedAt: string;
    userFavorite: boolean;
    userRating: number | null;
} & { songs?: Song[] };

export type GainInfo = {
    album?: number;
    track?: number;
};

export type Song = {
    album: string | null;
    albumArtists: RelatedArtist[];
    albumId: string;
    artistName: string;
    artists: RelatedArtist[];
    bitRate: number;
    bpm: number | null;
    channels: number | null;
    comment: string | null;
    compilation: boolean | null;
    container: string | null;
    createdAt: string;
    discNumber: number;
    discSubtitle: string | null;
    duration: number;
    gain: GainInfo | null;
    genres: Genre[];
    id: string;
    imagePlaceholderUrl: string | null;
    imageUrl: string | null;
    itemType: LibraryItem.SONG;
    lastPlayedAt: string | null;
    lyrics: string | null;
    name: string;
    participants: Record<string, RelatedArtist[]> | null;
    path: string | null;
    peak: GainInfo | null;
    playCount: number;
    playlistItemId?: string;
    releaseDate: string | null;
    releaseYear: string | null;
    serverId: string;
    serverType: ServerType;
    size: number;
    streamUrl: string;
    trackNumber: number;
    uniqueId: string;
    updatedAt: string;
    userFavorite: boolean;
    userRating: number | null;
};

export type AlbumArtist = {
    albumCount: number | null;
    backgroundImageUrl: string | null;
    biography: string | null;
    duration: number | null;
    genres: Genre[];
    id: string;
    imageUrl: string | null;
    itemType: LibraryItem.ALBUM_ARTIST;
    lastPlayedAt: string | null;
    mbz: string | null;
    name: string;
    playCount: number | null;
    serverId: string;
    serverType: ServerType;
    similarArtists: RelatedArtist[] | null;
    songCount: number | null;
    userFavorite: boolean;
    userRating: number | null;
};

export type RelatedAlbumArtist = {
    id: string;
    name: string;
};

export type Artist = {
    biography: string | null;
    createdAt: string;
    id: string;
    itemType: LibraryItem.ARTIST;
    name: string;
    remoteCreatedAt: string | null;
    serverFolderId: string;
    serverId: string;
    serverType: ServerType;
    updatedAt: string;
};

export type RelatedArtist = {
    id: string;
    imageUrl: string | null;
    name: string;
};

export type MusicFolder = {
    id: string;
    name: string;
};

export type Playlist = {
    description: string | null;
    duration: number | null;
    genres: Genre[];
    id: string;
    imagePlaceholderUrl: string | null;
    imageUrl: string | null;
    itemType: LibraryItem.PLAYLIST;
    name: string;
    owner: string | null;
    ownerId: string | null;
    public: boolean | null;
    rules?: Record<string, any> | null;
    serverId: string;
    serverType: ServerType;
    size: number | null;
    songCount: number | null;
    sync?: boolean | null;
};

export type GenresResponse = Genre[];

export type MusicFoldersResponse = MusicFolder[];

export type ListSortOrder = NDOrder | JFSortOrder;

type BaseEndpointArgs = {
    apiClientProps: {
        server: ServerListItem | null;
        signal?: AbortSignal;
    };
};

export interface BaseQuery<T> {
    sortBy: T;
    sortOrder: SortOrder;
}

// Genre List
export type GenreListResponse = BasePaginatedResponse<Genre[]> | null | undefined;

export type GenreListArgs = { query: GenreListQuery } & BaseEndpointArgs;

export enum GenreListSort {
    NAME = 'name',
}

export interface GenreListQuery extends BaseQuery<GenreListSort> {
    _custom?: {
        jellyfin?: null;
        navidrome?: null;
    };
    limit?: number;
    musicFolderId?: string;
    searchTerm?: string;
    startIndex: number;
}

type GenreListSortMap = {
    jellyfin: Record<GenreListSort, JFGenreListSort | undefined>;
    navidrome: Record<GenreListSort, NDGenreListSort | undefined>;
    subsonic: Record<UserListSort, undefined>;
};

export const genreListSortMap: GenreListSortMap = {
    jellyfin: {
        name: JFGenreListSort.NAME,
    },
    navidrome: {
        name: NDGenreListSort.NAME,
    },
    subsonic: {
        name: undefined,
    },
};

// Album List
export type AlbumListResponse = BasePaginatedResponse<Album[]> | null | undefined;

export enum AlbumListSort {
    ALBUM_ARTIST = 'albumArtist',
    ARTIST = 'artist',
    COMMUNITY_RATING = 'communityRating',
    CRITIC_RATING = 'criticRating',
    DURATION = 'duration',
    FAVORITED = 'favorited',
    NAME = 'name',
    PLAY_COUNT = 'playCount',
    RANDOM = 'random',
    RATING = 'rating',
    RECENTLY_ADDED = 'recentlyAdded',
    RECENTLY_PLAYED = 'recentlyPlayed',
    RELEASE_DATE = 'releaseDate',
    SONG_COUNT = 'songCount',
    YEAR = 'year',
}

export interface AlbumListQuery extends BaseQuery<AlbumListSort> {
    _custom?: {
        jellyfin?: Partial<z.infer<typeof jfType._parameters.albumList>>;
        navidrome?: Partial<z.infer<typeof ndType._parameters.albumList>>;
    };
    artistIds?: string[];
    compilation?: boolean;
    favorite?: boolean;
    genres?: string[];
    limit?: number;
    maxYear?: number;
    minYear?: number;
    musicFolderId?: string;
    searchTerm?: string;
    startIndex: number;
}

export type AlbumListArgs = { query: AlbumListQuery } & BaseEndpointArgs;

type AlbumListSortMap = {
    jellyfin: Record<AlbumListSort, JFAlbumListSort | undefined>;
    navidrome: Record<AlbumListSort, NDAlbumListSort | undefined>;
    subsonic: Record<AlbumListSort, undefined>;
};

export const albumListSortMap: AlbumListSortMap = {
    jellyfin: {
        albumArtist: JFAlbumListSort.ALBUM_ARTIST,
        artist: undefined,
        communityRating: JFAlbumListSort.COMMUNITY_RATING,
        criticRating: JFAlbumListSort.CRITIC_RATING,
        duration: undefined,
        favorited: undefined,
        name: JFAlbumListSort.NAME,
        playCount: JFAlbumListSort.PLAY_COUNT,
        random: JFAlbumListSort.RANDOM,
        rating: undefined,
        recentlyAdded: JFAlbumListSort.RECENTLY_ADDED,
        recentlyPlayed: undefined,
        releaseDate: JFAlbumListSort.RELEASE_DATE,
        songCount: undefined,
        year: undefined,
    },
    navidrome: {
        albumArtist: NDAlbumListSort.ALBUM_ARTIST,
        artist: NDAlbumListSort.ARTIST,
        communityRating: undefined,
        criticRating: undefined,
        duration: NDAlbumListSort.DURATION,
        favorited: NDAlbumListSort.STARRED,
        name: NDAlbumListSort.NAME,
        playCount: NDAlbumListSort.PLAY_COUNT,
        random: NDAlbumListSort.RANDOM,
        rating: NDAlbumListSort.RATING,
        recentlyAdded: NDAlbumListSort.RECENTLY_ADDED,
        recentlyPlayed: NDAlbumListSort.PLAY_DATE,
        // Recent versions of Navidrome support release date, but fallback to year for now
        releaseDate: NDAlbumListSort.YEAR,
        songCount: NDAlbumListSort.SONG_COUNT,
        year: NDAlbumListSort.YEAR,
    },
    subsonic: {
        albumArtist: undefined,
        artist: undefined,
        communityRating: undefined,
        criticRating: undefined,
        duration: undefined,
        favorited: undefined,
        name: undefined,
        playCount: undefined,
        random: undefined,
        rating: undefined,
        recentlyAdded: undefined,
        recentlyPlayed: undefined,
        releaseDate: undefined,
        songCount: undefined,
        year: undefined,
    },
};

// Album Detail
export type AlbumDetailResponse = Album | null | undefined;

export type AlbumDetailQuery = { id: string };

export type AlbumDetailArgs = { query: AlbumDetailQuery } & BaseEndpointArgs;

// Song List
export type SongListResponse = BasePaginatedResponse<Song[]> | null | undefined;

export enum SongListSort {
    ALBUM = 'album',
    ALBUM_ARTIST = 'albumArtist',
    ARTIST = 'artist',
    BPM = 'bpm',
    CHANNELS = 'channels',
    COMMENT = 'comment',
    DURATION = 'duration',
    FAVORITED = 'favorited',
    GENRE = 'genre',
    ID = 'id',
    NAME = 'name',
    PLAY_COUNT = 'playCount',
    RANDOM = 'random',
    RATING = 'rating',
    RECENTLY_ADDED = 'recentlyAdded',
    RECENTLY_PLAYED = 'recentlyPlayed',
    RELEASE_DATE = 'releaseDate',
    YEAR = 'year',
}

export interface SongListQuery extends BaseQuery<SongListSort> {
    _custom?: {
        jellyfin?: Partial<z.infer<typeof jfType._parameters.songList>>;
        navidrome?: Partial<z.infer<typeof ndType._parameters.songList>>;
    };
    albumIds?: string[];
    artistIds?: string[];
    favorite?: boolean;
    genreIds?: string[];
    imageSize?: number;
    limit?: number;
    maxYear?: number;
    minYear?: number;
    musicFolderId?: string;
    searchTerm?: string;
    startIndex: number;
}

export type SongListArgs = { query: SongListQuery } & BaseEndpointArgs;

type SongListSortMap = {
    jellyfin: Record<SongListSort, JFSongListSort | undefined>;
    navidrome: Record<SongListSort, NDSongListSort | undefined>;
    subsonic: Record<SongListSort, undefined>;
};

export const songListSortMap: SongListSortMap = {
    jellyfin: {
        album: JFSongListSort.ALBUM,
        albumArtist: JFSongListSort.ALBUM_ARTIST,
        artist: JFSongListSort.ARTIST,
        bpm: undefined,
        channels: undefined,
        comment: undefined,
        duration: JFSongListSort.DURATION,
        favorited: undefined,
        genre: undefined,
        id: undefined,
        name: JFSongListSort.NAME,
        playCount: JFSongListSort.PLAY_COUNT,
        random: JFSongListSort.RANDOM,
        rating: undefined,
        recentlyAdded: JFSongListSort.RECENTLY_ADDED,
        recentlyPlayed: JFSongListSort.RECENTLY_PLAYED,
        releaseDate: JFSongListSort.RELEASE_DATE,
        year: undefined,
    },
    navidrome: {
        album: NDSongListSort.ALBUM_SONGS,
        albumArtist: NDSongListSort.ALBUM_ARTIST,
        artist: NDSongListSort.ARTIST,
        bpm: NDSongListSort.BPM,
        channels: NDSongListSort.CHANNELS,
        comment: NDSongListSort.COMMENT,
        duration: NDSongListSort.DURATION,
        favorited: NDSongListSort.FAVORITED,
        genre: NDSongListSort.GENRE,
        id: NDSongListSort.ID,
        name: NDSongListSort.TITLE,
        playCount: NDSongListSort.PLAY_COUNT,
        random: NDSongListSort.RANDOM,
        rating: NDSongListSort.RATING,
        recentlyAdded: NDSongListSort.RECENTLY_ADDED,
        recentlyPlayed: NDSongListSort.PLAY_DATE,
        releaseDate: undefined,
        year: NDSongListSort.YEAR,
    },
    subsonic: {
        album: undefined,
        albumArtist: undefined,
        artist: undefined,
        bpm: undefined,
        channels: undefined,
        comment: undefined,
        duration: undefined,
        favorited: undefined,
        genre: undefined,
        id: undefined,
        name: undefined,
        playCount: undefined,
        random: undefined,
        rating: undefined,
        recentlyAdded: undefined,
        recentlyPlayed: undefined,
        releaseDate: undefined,
        year: undefined,
    },
};

// Song Detail
export type SongDetailResponse = Song | null | undefined;

export type SongDetailQuery = { id: string };

export type SongDetailArgs = { query: SongDetailQuery } & BaseEndpointArgs;

// Album Artist List
export type AlbumArtistListResponse = BasePaginatedResponse<AlbumArtist[]> | null | undefined;

export enum AlbumArtistListSort {
    ALBUM = 'album',
    ALBUM_COUNT = 'albumCount',
    DURATION = 'duration',
    FAVORITED = 'favorited',
    NAME = 'name',
    PLAY_COUNT = 'playCount',
    RANDOM = 'random',
    RATING = 'rating',
    RECENTLY_ADDED = 'recentlyAdded',
    RELEASE_DATE = 'releaseDate',
    SONG_COUNT = 'songCount',
}

export interface AlbumArtistListQuery extends BaseQuery<AlbumArtistListSort> {
    _custom?: {
        jellyfin?: Partial<z.infer<typeof jfType._parameters.albumArtistList>>;
        navidrome?: Partial<z.infer<typeof ndType._parameters.albumArtistList>>;
    };
    limit?: number;
    musicFolderId?: string;
    searchTerm?: string;
    startIndex: number;
}

export type AlbumArtistListArgs = { query: AlbumArtistListQuery } & BaseEndpointArgs;

type AlbumArtistListSortMap = {
    jellyfin: Record<AlbumArtistListSort, JFAlbumArtistListSort | undefined>;
    navidrome: Record<AlbumArtistListSort, NDAlbumArtistListSort | undefined>;
    subsonic: Record<AlbumArtistListSort, undefined>;
};

export const albumArtistListSortMap: AlbumArtistListSortMap = {
    jellyfin: {
        album: JFAlbumArtistListSort.ALBUM,
        albumCount: undefined,
        duration: JFAlbumArtistListSort.DURATION,
        favorited: undefined,
        name: JFAlbumArtistListSort.NAME,
        playCount: undefined,
        random: JFAlbumArtistListSort.RANDOM,
        rating: undefined,
        recentlyAdded: JFAlbumArtistListSort.RECENTLY_ADDED,
        releaseDate: undefined,
        songCount: undefined,
    },
    navidrome: {
        album: undefined,
        albumCount: NDAlbumArtistListSort.ALBUM_COUNT,
        duration: undefined,
        favorited: NDAlbumArtistListSort.FAVORITED,
        name: NDAlbumArtistListSort.NAME,
        playCount: NDAlbumArtistListSort.PLAY_COUNT,
        random: undefined,
        rating: NDAlbumArtistListSort.RATING,
        recentlyAdded: undefined,
        releaseDate: undefined,
        songCount: NDAlbumArtistListSort.SONG_COUNT,
    },
    subsonic: {
        album: undefined,
        albumCount: undefined,
        duration: undefined,
        favorited: undefined,
        name: undefined,
        playCount: undefined,
        random: undefined,
        rating: undefined,
        recentlyAdded: undefined,
        releaseDate: undefined,
        songCount: undefined,
    },
};

// Album Artist Detail

export type AlbumArtistDetailResponse = AlbumArtist | null;

export type AlbumArtistDetailQuery = { id: string };

export type AlbumArtistDetailArgs = { query: AlbumArtistDetailQuery } & BaseEndpointArgs;

// Artist List
export type ArtistListResponse = BasePaginatedResponse<Artist[]> | null | undefined;

export enum ArtistListSort {
    ALBUM = 'album',
    ALBUM_COUNT = 'albumCount',
    DURATION = 'duration',
    FAVORITED = 'favorited',
    NAME = 'name',
    PLAY_COUNT = 'playCount',
    RANDOM = 'random',
    RATING = 'rating',
    RECENTLY_ADDED = 'recentlyAdded',
    RELEASE_DATE = 'releaseDate',
    SONG_COUNT = 'songCount',
}

export interface ArtistListQuery extends BaseQuery<ArtistListSort> {
    _custom?: {
        jellyfin?: Partial<z.infer<typeof jfType._parameters.albumArtistList>>;
        navidrome?: Partial<z.infer<typeof ndType._parameters.albumArtistList>>;
    };
    limit?: number;
    musicFolderId?: string;
    startIndex: number;
}

export type ArtistListArgs = { query: ArtistListQuery } & BaseEndpointArgs;

type ArtistListSortMap = {
    jellyfin: Record<ArtistListSort, JFArtistListSort | undefined>;
    navidrome: Record<ArtistListSort, undefined>;
    subsonic: Record<ArtistListSort, undefined>;
};

export const artistListSortMap: ArtistListSortMap = {
    jellyfin: {
        album: JFArtistListSort.ALBUM,
        albumCount: undefined,
        duration: JFArtistListSort.DURATION,
        favorited: undefined,
        name: JFArtistListSort.NAME,
        playCount: undefined,
        random: JFArtistListSort.RANDOM,
        rating: undefined,
        recentlyAdded: JFArtistListSort.RECENTLY_ADDED,
        releaseDate: undefined,
        songCount: undefined,
    },
    navidrome: {
        album: undefined,
        albumCount: undefined,
        duration: undefined,
        favorited: undefined,
        name: undefined,
        playCount: undefined,
        random: undefined,
        rating: undefined,
        recentlyAdded: undefined,
        releaseDate: undefined,
        songCount: undefined,
    },
    subsonic: {
        album: undefined,
        albumCount: undefined,
        duration: undefined,
        favorited: undefined,
        name: undefined,
        playCount: undefined,
        random: undefined,
        rating: undefined,
        recentlyAdded: undefined,
        releaseDate: undefined,
        songCount: undefined,
    },
};

// Artist Detail

// Favorite
export type FavoriteResponse = null | undefined;

export type FavoriteQuery = {
    id: string[];
    type: LibraryItem;
};

export type FavoriteArgs = { query: FavoriteQuery; serverId?: string } & BaseEndpointArgs;

// Rating
export type RatingResponse = null | undefined;

export type RatingQuery = {
    item: AnyLibraryItems;
    rating: number;
};

export type SetRatingArgs = { query: RatingQuery; serverId?: string } & BaseEndpointArgs;

// Sharing
export type ShareItemResponse = { id: string } | undefined;

export type ShareItemBody = {
    description: string;
    downloadable: boolean;
    expires: number;
    resourceIds: string;
    resourceType: string;
};

export type ShareItemArgs = { body: ShareItemBody; serverId?: string } & BaseEndpointArgs;

// Add to playlist
export type AddToPlaylistResponse = null | undefined;

export type AddToPlaylistQuery = {
    id: string;
};

export type AddToPlaylistBody = {
    songId: string[];
};

export type AddToPlaylistArgs = {
    body: AddToPlaylistBody;
    query: AddToPlaylistQuery;
    serverId?: string;
} & BaseEndpointArgs;

// Remove from playlist
export type RemoveFromPlaylistResponse = null | undefined;

export type RemoveFromPlaylistQuery = {
    id: string;
    songId: string[];
};

export type RemoveFromPlaylistArgs = {
    query: RemoveFromPlaylistQuery;
    serverId?: string;
} & BaseEndpointArgs;

// Create Playlist
export type CreatePlaylistResponse = { id: string } | undefined;

export type CreatePlaylistBody = {
    _custom?: {
        navidrome?: {
            owner?: string;
            ownerId?: string;
            rules?: Record<string, any>;
            sync?: boolean;
        };
    };
    comment?: string;
    name: string;
    public?: boolean;
};

export type CreatePlaylistArgs = { body: CreatePlaylistBody; serverId?: string } & BaseEndpointArgs;

// Update Playlist
export type UpdatePlaylistResponse = null | undefined;

export type UpdatePlaylistQuery = {
    id: string;
};

export type UpdatePlaylistBody = {
    _custom?: {
        navidrome?: {
            owner?: string;
            ownerId?: string;
            rules?: Record<string, any>;
            sync?: boolean;
        };
    };
    comment?: string;
    genres?: Genre[];
    name: string;
    public?: boolean;
};

export type UpdatePlaylistArgs = {
    body: UpdatePlaylistBody;
    query: UpdatePlaylistQuery;
    serverId?: string;
} & BaseEndpointArgs;

// Delete Playlist
export type DeletePlaylistResponse = null | undefined;

export type DeletePlaylistQuery = { id: string };

export type DeletePlaylistArgs = {
    query: DeletePlaylistQuery;
    serverId?: string;
} & BaseEndpointArgs;

// Playlist List
export type PlaylistListResponse = BasePaginatedResponse<Playlist[]> | null | undefined;

export enum PlaylistListSort {
    DURATION = 'duration',
    NAME = 'name',
    OWNER = 'owner',
    PUBLIC = 'public',
    SONG_COUNT = 'songCount',
    UPDATED_AT = 'updatedAt',
}

export interface PlaylistListQuery extends BaseQuery<PlaylistListSort> {
    _custom?: {
        jellyfin?: Partial<z.infer<typeof jfType._parameters.playlistList>>;
        navidrome?: Partial<z.infer<typeof ndType._parameters.playlistList>>;
    };
    limit?: number;
    searchTerm?: string;
    startIndex: number;
}

export type PlaylistListArgs = { query: PlaylistListQuery } & BaseEndpointArgs;

type PlaylistListSortMap = {
    jellyfin: Record<PlaylistListSort, JFPlaylistListSort | undefined>;
    navidrome: Record<PlaylistListSort, NDPlaylistListSort | undefined>;
    subsonic: Record<PlaylistListSort, undefined>;
};

export const playlistListSortMap: PlaylistListSortMap = {
    jellyfin: {
        duration: JFPlaylistListSort.DURATION,
        name: JFPlaylistListSort.NAME,
        owner: undefined,
        public: undefined,
        songCount: JFPlaylistListSort.SONG_COUNT,
        updatedAt: undefined,
    },
    navidrome: {
        duration: NDPlaylistListSort.DURATION,
        name: NDPlaylistListSort.NAME,
        owner: NDPlaylistListSort.OWNER,
        public: NDPlaylistListSort.PUBLIC,
        songCount: NDPlaylistListSort.SONG_COUNT,
        updatedAt: NDPlaylistListSort.UPDATED_AT,
    },
    subsonic: {
        duration: undefined,
        name: undefined,
        owner: undefined,
        public: undefined,
        songCount: undefined,
        updatedAt: undefined,
    },
};

// Playlist Detail
export type PlaylistDetailResponse = Playlist;

export type PlaylistDetailQuery = {
    id: string;
};

export type PlaylistDetailArgs = { query: PlaylistDetailQuery } & BaseEndpointArgs;

// Playlist Songs
export type PlaylistSongListResponse = BasePaginatedResponse<Song[]> | null | undefined;

export type PlaylistSongListQuery = {
    id: string;
    limit?: number;
    sortBy?: SongListSort;
    sortOrder?: SortOrder;
    startIndex: number;
};

export type PlaylistSongListArgs = { query: PlaylistSongListQuery } & BaseEndpointArgs;

// Music Folder List
export type MusicFolderListResponse = BasePaginatedResponse<MusicFolder[]> | null | undefined;

export type MusicFolderListQuery = null;

export type MusicFolderListArgs = BaseEndpointArgs;

// User list
// Playlist List
export type UserListResponse = BasePaginatedResponse<User[]> | null | undefined;

export enum UserListSort {
    NAME = 'name',
}

export interface UserListQuery extends BaseQuery<UserListSort> {
    _custom?: {
        navidrome?: {
            owner_id?: string;
        };
    };
    limit?: number;
    searchTerm?: string;
    startIndex: number;
}

export type UserListArgs = { query: UserListQuery } & BaseEndpointArgs;

type UserListSortMap = {
    jellyfin: Record<UserListSort, undefined>;
    navidrome: Record<UserListSort, NDUserListSort | undefined>;
    subsonic: Record<UserListSort, undefined>;
};

export const userListSortMap: UserListSortMap = {
    jellyfin: {
        name: undefined,
    },
    navidrome: {
        name: NDUserListSort.NAME,
    },
    subsonic: {
        name: undefined,
    },
};

// Top Songs List
export type TopSongListResponse = BasePaginatedResponse<Song[]> | null | undefined;

export type TopSongListQuery = {
    artist: string;
    artistId: string;
    limit?: number;
};

export type TopSongListArgs = { query: TopSongListQuery } & BaseEndpointArgs;

// Artist Info
export type ArtistInfoQuery = {
    artistId: string;
    limit: number;
    musicFolderId?: string;
};

export type ArtistInfoArgs = { query: ArtistInfoQuery } & BaseEndpointArgs;

// Scrobble
export type ScrobbleResponse = null | undefined;

export type ScrobbleArgs = {
    query: ScrobbleQuery;
    serverId?: string;
} & BaseEndpointArgs;

export type ScrobbleQuery = {
    event?: 'pause' | 'unpause' | 'timeupdate' | 'start';
    id: string;
    position?: number;
    submission: boolean;
};

export type SearchQuery = {
    albumArtistLimit?: number;
    albumArtistStartIndex?: number;
    albumLimit?: number;
    albumStartIndex?: number;
    musicFolderId?: string;
    query?: string;
    songLimit?: number;
    songStartIndex?: number;
};

export type SearchSongsQuery = {
    musicFolderId?: string;
    query?: string;
    songLimit?: number;
    songStartIndex?: number;
};

export type SearchAlbumsQuery = {
    albumLimit?: number;
    albumStartIndex?: number;
    musicFolderId?: string;
    query?: string;
};

export type SearchAlbumArtistsQuery = {
    albumArtistLimit?: number;
    albumArtistStartIndex?: number;
    musicFolderId?: string;
    query?: string;
};

export type SearchArgs = {
    query: SearchQuery;
} & BaseEndpointArgs;

export type SearchResponse = {
    albumArtists: AlbumArtist[];
    albums: Album[];
    songs: Song[];
};

export enum Played {
    All = 'all',
    Never = 'never',
    Played = 'played',
}

export type RandomSongListQuery = {
    genre?: string;
    limit?: number;
    maxYear?: number;
    minYear?: number;
    musicFolderId?: string;
    played: Played;
};

export type RandomSongListArgs = {
    query: RandomSongListQuery;
} & BaseEndpointArgs;

export type RandomSongListResponse = SongListResponse;

export type LyricsQuery = {
    songId: string;
};

export type LyricsArgs = {
    query: LyricsQuery;
} & BaseEndpointArgs;

export type SynchronizedLyricsArray = Array<[number, string]>;

export type LyricsResponse = SynchronizedLyricsArray | string;

export type InternetProviderLyricResponse = {
    artist: string;
    id: string;
    lyrics: string;
    name: string;
    source: LyricSource;
};

export type InternetProviderLyricSearchResponse = {
    artist: string;
    id: string;
    name: string;
    score?: number;
    source: LyricSource;
};

export type FullLyricsMetadata = {
    lyrics: LyricsResponse;
    remote: boolean;
    source: string;
} & Omit<InternetProviderLyricResponse, 'id' | 'lyrics' | 'source'>;

export type LyricOverride = Omit<InternetProviderLyricResponse, 'lyrics'>;

export const instanceOfCancellationError = (error: any) => {
    return 'revert' in error;
};

export type LyricSearchQuery = {
    album?: string;
    artist?: string;
    duration?: number;
    name?: string;
};

export type LyricGetQuery = {
    remoteSongId: string;
    remoteSource: LyricSource;
    song: Song;
};

export enum LyricSource {
    GENIUS = 'Genius',
    LRCLIB = 'lrclib.net',
    NETEASE = 'NetEase',
}

export type LyricsOverride = Omit<FullLyricsMetadata, 'lyrics'> & { id: string };

// This type from https://wicg.github.io/local-font-access/#fontdata
// NOTE: it is still experimental, so this should be updates as appropriate
export type FontData = {
    family: string;
    fullName: string;
    postscriptName: string;
    style: string;
};

export type ServerInfoArgs = BaseEndpointArgs;

export type ServerInfo = {
    features: ServerFeatures;
    id?: string;
    version: string;
};

export type StructuredLyricsArgs = {
    query: LyricsQuery;
} & BaseEndpointArgs;

export type StructuredUnsyncedLyric = {
    lyrics: string;
    synced: false;
} & Omit<FullLyricsMetadata, 'lyrics'>;

export type StructuredSyncedLyric = {
    lyrics: SynchronizedLyricsArray;
    synced: true;
} & Omit<FullLyricsMetadata, 'lyrics'>;

export type StructuredLyric = {
    lang: string;
} & (StructuredUnsyncedLyric | StructuredSyncedLyric);

export type SimilarSongsQuery = {
    albumArtistIds: string[];
    count?: number;
    songId: string;
};

export type SimilarSongsArgs = {
    query: SimilarSongsQuery;
} & BaseEndpointArgs;

export type MoveItemQuery = {
    endingIndex: number;
    playlistId: string;
    startingIndex: number;
    trackId: string;
};

export type MoveItemArgs = {
    query: MoveItemQuery;
} & BaseEndpointArgs;

export type DownloadQuery = {
    id: string;
};

export type DownloadArgs = {
    query: DownloadQuery;
} & BaseEndpointArgs;

export type TranscodingQuery = {
    base: string;
    bitrate?: number;
    format?: string;
};

export type TranscodingArgs = {
    query: TranscodingQuery;
} & BaseEndpointArgs;

export type ControllerEndpoint = {
    addToPlaylist: (args: AddToPlaylistArgs) => Promise<AddToPlaylistResponse>;
    authenticate: (
        url: string,
        body: { legacy?: boolean; password: string; username: string },
    ) => Promise<AuthenticationResponse>;
    createFavorite: (args: FavoriteArgs) => Promise<FavoriteResponse>;
    createPlaylist: (args: CreatePlaylistArgs) => Promise<CreatePlaylistResponse>;
    deleteFavorite: (args: FavoriteArgs) => Promise<FavoriteResponse>;
    deletePlaylist: (args: DeletePlaylistArgs) => Promise<DeletePlaylistResponse>;
    getAlbumArtistDetail: (args: AlbumArtistDetailArgs) => Promise<AlbumArtistDetailResponse>;
    getAlbumArtistList: (args: AlbumArtistListArgs) => Promise<AlbumArtistListResponse>;
    getAlbumArtistListCount: (args: AlbumArtistListArgs) => Promise<number>;
    getAlbumDetail: (args: AlbumDetailArgs) => Promise<AlbumDetailResponse>;
    getAlbumList: (args: AlbumListArgs) => Promise<AlbumListResponse>;
    getAlbumListCount: (args: AlbumListArgs) => Promise<number>;
    // getArtistInfo?: (args: any) => void;
    // getArtistList?: (args: ArtistListArgs) => Promise<ArtistListResponse>;
    getDownloadUrl: (args: DownloadArgs) => string;
    getGenreList: (args: GenreListArgs) => Promise<GenreListResponse>;
    getLyrics?: (args: LyricsArgs) => Promise<LyricsResponse>;
    getMusicFolderList: (args: MusicFolderListArgs) => Promise<MusicFolderListResponse>;
    getPlaylistDetail: (args: PlaylistDetailArgs) => Promise<PlaylistDetailResponse>;
    getPlaylistList: (args: PlaylistListArgs) => Promise<PlaylistListResponse>;
    getPlaylistListCount: (args: PlaylistListArgs) => Promise<number>;
    getPlaylistSongList: (args: PlaylistSongListArgs) => Promise<SongListResponse>;
    getRandomSongList: (args: RandomSongListArgs) => Promise<SongListResponse>;
    getServerInfo: (args: ServerInfoArgs) => Promise<ServerInfo>;
    getSimilarSongs: (args: SimilarSongsArgs) => Promise<Song[]>;
    getSongDetail: (args: SongDetailArgs) => Promise<SongDetailResponse>;
    getSongList: (args: SongListArgs) => Promise<SongListResponse>;
    getSongListCount: (args: SongListArgs) => Promise<number>;
    getStructuredLyrics?: (args: StructuredLyricsArgs) => Promise<StructuredLyric[]>;
    getTopSongs: (args: TopSongListArgs) => Promise<TopSongListResponse>;
    getTranscodingUrl: (args: TranscodingArgs) => string;
    getUserList?: (args: UserListArgs) => Promise<UserListResponse>;
    movePlaylistItem?: (args: MoveItemArgs) => Promise<void>;
    removeFromPlaylist: (args: RemoveFromPlaylistArgs) => Promise<RemoveFromPlaylistResponse>;
    scrobble: (args: ScrobbleArgs) => Promise<ScrobbleResponse>;
    search: (args: SearchArgs) => Promise<SearchResponse>;
    setRating?: (args: SetRatingArgs) => Promise<RatingResponse>;
    shareItem?: (args: ShareItemArgs) => Promise<ShareItemResponse>;
    updatePlaylist: (args: UpdatePlaylistArgs) => Promise<UpdatePlaylistResponse>;
};

export const sortAlbumList = (albums: Album[], sortBy: AlbumListSort, sortOrder: SortOrder) => {
    let results = albums;

    const order = sortOrder === SortOrder.ASC ? 'asc' : 'desc';

    switch (sortBy) {
        case AlbumListSort.ALBUM_ARTIST:
            results = orderBy(
                results,
                ['albumArtist', (v) => v.name.toLowerCase()],
                [order, 'asc'],
            );
            break;
        case AlbumListSort.DURATION:
            results = orderBy(results, ['duration'], [order]);
            break;
        case AlbumListSort.FAVORITED:
            results = orderBy(results, ['starred'], [order]);
            break;
        case AlbumListSort.NAME:
            results = orderBy(results, [(v) => v.name.toLowerCase()], [order]);
            break;
        case AlbumListSort.PLAY_COUNT:
            results = orderBy(results, ['playCount'], [order]);
            break;
        case AlbumListSort.RANDOM:
            results = shuffle(results);
            break;
        case AlbumListSort.RECENTLY_ADDED:
            results = orderBy(results, ['createdAt'], [order]);
            break;
        case AlbumListSort.RECENTLY_PLAYED:
            results = orderBy(results, ['lastPlayedAt'], [order]);
            break;
        case AlbumListSort.RATING:
            results = orderBy(results, ['userRating'], [order]);
            break;
        case AlbumListSort.YEAR:
            results = orderBy(results, ['releaseYear'], [order]);
            break;
        case AlbumListSort.SONG_COUNT:
            results = orderBy(results, ['songCount'], [order]);
            break;
        default:
            break;
    }

    return results;
};

export const sortSongList = (songs: QueueSong[], sortBy: SongListSort, sortOrder: SortOrder) => {
    let results = songs;

    const order = sortOrder === SortOrder.ASC ? 'asc' : 'desc';

    switch (sortBy) {
        case SongListSort.ALBUM:
            results = orderBy(
                results,
                [(v) => v.album?.toLowerCase(), 'discNumber', 'trackNumber'],
                [order, 'asc', 'asc'],
            );
            break;

        case SongListSort.ALBUM_ARTIST:
            results = orderBy(
                results,
                ['albumArtist', (v) => v.album?.toLowerCase(), 'discNumber', 'trackNumber'],
                [order, order, 'asc', 'asc'],
            );
            break;

        case SongListSort.ARTIST:
            results = orderBy(
                results,
                ['artist', (v) => v.album?.toLowerCase(), 'discNumber', 'trackNumber'],
                [order, order, 'asc', 'asc'],
            );
            break;

        case SongListSort.DURATION:
            results = orderBy(results, ['duration'], [order]);
            break;

        case SongListSort.FAVORITED:
            results = orderBy(results, ['userFavorite', (v) => v.name.toLowerCase()], [order]);
            break;

        case SongListSort.GENRE:
            results = orderBy(
                results,
                [
                    (v) => v.genres?.[0].name.toLowerCase(),
                    (v) => v.album?.toLowerCase(),
                    'discNumber',
                    'trackNumber',
                ],
                [order, order, 'asc', 'asc'],
            );
            break;

        case SongListSort.ID:
            if (order === 'desc') {
                results = reverse(results);
            }
            break;

        case SongListSort.NAME:
            results = orderBy(results, [(v) => v.name.toLowerCase()], [order]);
            break;

        case SongListSort.PLAY_COUNT:
            results = orderBy(results, ['playCount'], [order]);
            break;

        case SongListSort.RANDOM:
            results = shuffle(results);
            break;

        case SongListSort.RATING:
            results = orderBy(results, ['userRating', (v) => v.name.toLowerCase()], [order]);
            break;

        case SongListSort.RECENTLY_ADDED:
            results = orderBy(results, ['created'], [order]);
            break;

        case SongListSort.YEAR:
            results = orderBy(
                results,
                ['year', (v) => v.album?.toLowerCase(), 'discNumber', 'track'],
                [order, 'asc', 'asc', 'asc'],
            );
            break;

        default:
            break;
    }

    return results;
};

export const sortAlbumArtistList = (
    artists: AlbumArtist[],
    sortBy: AlbumArtistListSort,
    sortOrder: SortOrder,
) => {
    const order = sortOrder === SortOrder.ASC ? 'asc' : 'desc';

    let results = artists;

    switch (sortBy) {
        case AlbumArtistListSort.ALBUM_COUNT:
            results = orderBy(artists, ['albumCount', (v) => v.name.toLowerCase()], [order, 'asc']);
            break;

        case AlbumArtistListSort.NAME:
            results = orderBy(artists, [(v) => v.name.toLowerCase()], [order]);
            break;

        case AlbumArtistListSort.FAVORITED:
            results = orderBy(artists, ['starred'], [order]);
            break;

        case AlbumArtistListSort.RATING:
            results = orderBy(artists, ['userRating'], [order]);
            break;

        default:
            break;
    }

    return results;
};
