/* React-specific entry point that automatically generates
   hooks corresponding to the defined endpoints */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { REHYDRATE } from 'redux-persist'

const API_URL = import.meta.env.VITE_API_URL;
console.log('api', API_URL)
const API_KEY = import.meta.env.VITE_API_KEY;


function isHydrateAction(action) {
  return action.type === REHYDRATE
}


export const songsApi = createApi({
  reducerPath: "diabaraTvApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json")
    headers.set('Authorization', `${API_KEY}`)

  },

  extractRehydrationInfo(action, { reducerPath }) {
    if (isHydrateAction(action)) {
      // when persisting the api reducer
      // When persisting the root reducer
      return action.payload[api.reducerPath]
    }
  },
  endpoints: (builder) => ({
    // The `getPosts` endpoint is a "query" operation that returns data
    getSongs: builder.query({
      // The URL for the request is '/fakeApi/posts'
      query: () => "/songs?populate=*&pagination[pageSize]=1000",
      async onQueryStarted(
        arg,
        {
          dispatch,
          getState,
          extra,
          requestId,
          queryFulfilled,
          getCacheEntry,
          updateCachedData,
        },
      ) {},
    }),
    getSongDetails: builder.query({
      // The URL for the request is '/fakeApi/posts'
      query: (songid) => "/songs/" + songid + "/?populate=*",
    }),
    getSongByName: builder.query({
      // The URL for the request is '/fakeApi/posts'
      query: (name) => "/songs?populate=*&filters[$or][0][name][$contains]" + name + "&filters[$or][1][artist][name][$contains]=" + name,
    }),
    
    getSongRelated: builder.query({
      // The URL for the request is '/fakeApi/posts'
      query: (artisteid) => "songs?filters[artist][id][$eq]=" + artisteid,
    }),
    getSongByArtist: builder.query({
      // The URL for the request is '/fakeApi/posts'
      query: (artisteid) => "songs?filters[artist][id][$eq]=" + artisteid,
    }),
    getSongByCountry: builder.query({
      // The URL for the request is '/fakeApi/posts'
      query: (countryCode) => "/songs?fields[0]=ville" + countryCode +"populate=*", 
    }),
    getSongsByGenre: builder.query({
      // The URL for the request is '/fakeApi/posts'
      query: (genre) => "all.php?genre=" + genre,
    }),
    getSongsBySearch: builder.query({
      // The URL for the request is '/fakeApi/posts'
      query: (searchTerm) => "all.php?search=" + searchTerm,
    }),
    addSong: builder.mutation({
      // The URL for the request is '/fakeApi/posts'
      query: (data) =>( {
        url: 'upload',
        body: data,
        method: 'POST',
         
      })
    }),
  }),
});

export const {
  useGetSongsQuery,
  useGetSongByNameQuery,
  useGetSongDetailsQuery,
  useGetSongRelatedQuery,
  useGetSongByCountryQuery,
  useGetSongsByGenreQuery,
  useGetSongsBySearchQuery,
  useAddSongMutation,
  useGetSongByArtistQuery,
} = songsApi;
