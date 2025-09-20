import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { REHYDRATE } from 'redux-persist';

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

// Helper pour vérifier l'action de réhydratation
function isHydrateAction(action) {
  return action.type === REHYDRATE;
}

// Configuration de base améliorée
const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, { getState }) => {
    headers.set("Content-Type", "application/json");
    headers.set('Authorization', `Bearer ${API_KEY}`);
    return headers;
  },
});

// Wrapper pour gérer les erreurs et retry
const baseQueryWithRetry = async (args, api, extraOptions) => {
  let result = await baseQueryWithAuth(args, api, extraOptions);
  
  // Retry une fois en cas d'erreur réseau
  if (result.error && result.error.status === 'FETCH_ERROR') {
    await new Promise(resolve => setTimeout(resolve, 1000));
    result = await baseQueryWithAuth(args, api, extraOptions);
  }
  
  return result;
};

export const songsApi = createApi({
  reducerPath: "diabaraTvApi",
  baseQuery: baseQueryWithRetry,
  tagTypes: ['Song', 'Artist', 'Playlist', 'Search'],
  
  extractRehydrationInfo(action, { reducerPath }) {
    if (isHydrateAction(action)) {
      return action.payload?.[reducerPath];
    }
  },
  
  endpoints: (builder) => ({
    // Endpoint principal avec pagination et filtres
    getSongs: builder.query({
      query: ({ page = 1, pageSize = 20, genre, country, sortBy = 'createdAt:desc' } = {}) => {
        const params = {
          populate: '*',
          'pagination[page]': page,
          'pagination[pageSize]': pageSize,
          'sort[0]': sortBy,
        };

        if (genre) params['filters[genre][$eq]'] = genre;
        if (country) params['filters[country][$eq]'] = country;

        return {
          url: '/songs',
          params,
        };
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: 'Song', id })),
              { type: 'Song', id: 'LIST' },
            ]
          : [{ type: 'Song', id: 'LIST' }],
      keepUnusedDataFor: 300, // 5 minutes de cache
    }),

    // Détails d'une chanson
    getSongDetails: builder.query({
      query: (songId) => ({
        url: `/songs/${songId}`,
        params: { populate: '*' },
      }),
      providesTags: (result, error, songId) => [{ type: 'Song', id: songId }],
      keepUnusedDataFor: 600, // 10 minutes de cache pour les détails
    }),

    // Recherche optimisée
    searchSongs: builder.query({
      query: (searchTerm) => {
        if (!searchTerm || searchTerm.length < 2) {
          return { url: '/songs', params: { 'pagination[pageSize]': 0 } };
        }

        return {
          url: '/songs',
          params: {
            populate: '*',
            'filters[$or][0][name][$containsi]': searchTerm,
            'filters[$or][1][artist][name][$containsi]': searchTerm,
            'filters[$or][2][album][$containsi]': searchTerm,
            'pagination[pageSize]': 50,
          },
        };
      },
      providesTags: ['Search'],
      keepUnusedDataFor: 60, // Cache court pour les recherches
    }),

    // Chansons par artiste (correction du nom pour correspondre aux imports)
    getSongsByArtist: builder.query({
      query: (artistId) => ({
        url: '/songs',
        params: {
          populate: '*',
          'filters[artist][id][$eq]': artistId,
          'pagination[pageSize]': 100,
        },
      }),
      providesTags: (result, error, artistId) => [
        { type: 'Artist', id: artistId },
        { type: 'Song', id: 'LIST' },
      ],
    }),

    // Alias pour compatibilité avec l'ancien nom
    getSongByArtist: builder.query({
      query: (artistId) => ({
        url: '/songs',
        params: {
          populate: '*',
          'filters[artist][id][$eq]': artistId,
          'pagination[pageSize]': 100,
        },
      }),
      providesTags: (result, error, artistId) => [
        { type: 'Artist', id: artistId },
        { type: 'Song', id: 'LIST' },
      ],
    }),

    // Recherche par nom (pour compatibilité)
    getSongByName: builder.query({
      query: (songName) => ({
        url: '/songs',
        params: {
          populate: '*',
          'filters[name][$containsi]': songName,
          'pagination[pageSize]': 50,
        },
      }),
      providesTags: ['Search'],
      keepUnusedDataFor: 60,
    }),

    // Recherche générale (alias pour searchSongs)
    getSongsBySearch: builder.query({
      query: (searchTerm) => {
        if (!searchTerm || searchTerm.length < 2) {
          return { url: '/songs', params: { 'pagination[pageSize]': 0 } };
        }

        return {
          url: '/songs',
          params: {
            populate: '*',
            'filters[$or][0][name][$containsi]': searchTerm,
            'filters[$or][1][artist][name][$containsi]': searchTerm,
            'filters[$or][2][album][$containsi]': searchTerm,
            'pagination[pageSize]': 50,
          },
        };
      },
      providesTags: ['Search'],
      keepUnusedDataFor: 60,
    }),

    // Chansons par genre
    getSongsByGenre: builder.query({
      query: (genre) => ({
        url: '/songs',
        params: {
          populate: '*',
          'filters[genre][$eq]': genre,
          'pagination[pageSize]': 100,
        },
      }),
      providesTags: ['Song'],
    }),

    // Upload de chanson
    addSong: builder.mutation({
      query: (formData) => ({
        url: '/upload',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: [{ type: 'Song', id: 'LIST' }],
    }),

    // Recommandations personnalisées
    getRecommendations: builder.query({
      query: (userId) => ({
        url: '/songs/recommendations',
        params: {
          populate: '*',
          userId,
          'pagination[pageSize]': 20,
        },
      }),
      keepUnusedDataFor: 180, // 3 minutes pour les recommandations
    }),
  }),
});

// Export des hooks générés (avec tous les nouveaux endpoints)
export const {
  useGetSongsQuery,
  useLazyGetSongsQuery,
  useGetSongDetailsQuery,
  useSearchSongsQuery,
  useLazySearchSongsQuery,
  useGetSongsByArtistQuery,
  useGetSongByArtistQuery, // Nouveau
  useGetSongByNameQuery,   // Nouveau
  useGetSongsBySearchQuery, // Nouveau
  useGetSongsByGenreQuery,
  useAddSongMutation,
  useGetRecommendationsQuery,
} = songsApi;