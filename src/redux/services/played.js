/* React-specific entry point that automatically generates
   hooks corresponding to the defined endpoints */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

export const playedApi = createApi({
  reducerPath: "diabaraTvPlayedsApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json")
    headers.set('Authorization', `${API_KEY}`)

  },
  endpoints: (builder) => ({
    // The `getPosts` endpoint is a "query" operation that returns data
    getPlayeds: builder.query({
      // The URL for the request is '/fakeApi/posts'
      query: () => "/playeds?populate=*&pagination[pageSize]=1000",
    }),
    getPlayedsByUUID: builder.query({
      // The URL for the request is '/fakeApi/posts'
     query: (uuid) =>
  `/playeds?populate[song][populate]=*&populate[visitor][populate]=*&filters[visitor][uuid][$eq]=${uuid}&sort=createdAt:desc`,
    }),
    getPlayedsBySearch: builder.query({
      // The URL for the request is '/fakeApi/posts'
      query: (searchTerm) => "all.php?search=" + searchTerm,
    }),

    addPlayed: builder.mutation({
      // The URL for the request is '/fakeApi/posts'
      query: (data) => ({
        url: '/playeds',
        body: { data },
        method: 'POST',

      })
    }),

    updatePlayed: builder.mutation({
      // The URL for the request is '/fakeApi/posts'
      query: (data) => ({
        url: '/playeds/' + data.id,
        body: { data },
        method: 'PUT',

      })
    }),


  }),
});

export const {
  useGetPlayedsQuery,
  useGetPlayedsByUUIDQuery,
  useGetPlayedsBySearchQuery,
  useAddPlayedMutation,
  useUpdatePlayedMutation,

} = playedApi;


import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  played: [],
};

const playedsSlice = createSlice({
  name: 'playeds',
  initialState,
  reducers: {
    setPlayeds: (state, action) => {
      console.error('active', action.payload)
      localStorage.setItem('genre', JSON.stringify(action.payload))
      state.played = action.payload;


    },

  },
});

export const { setplayeds } = playedsSlice.actions;

export default playedsSlice.reducer;
