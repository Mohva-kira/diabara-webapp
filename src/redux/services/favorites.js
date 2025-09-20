/* React-specific entry point that automatically generates
   hooks corresponding to the defined endpoints */
   import { createSlice } from "@reduxjs/toolkit";
   import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
   
   const API_URL = import.meta.env.VITE_API_URL;
   const initialState = {
     data: null,
   };
   
   export const favoritesApi = createApi({
     reducerPath: "favorites",
     baseQuery: fetchBaseQuery({
       baseUrl: API_URL,
       prepareHeaders: (headers, { getState }) => {
         const storageUser = JSON.parse(localStorage.getItem("auth"));
         const token = getState().auth.auth.token
           ? getState().auth.auth.token
           : storageUser?.jwt;
         // console.log("tok", token);
         if (token) {
           headers.set("authorization", `Bearer ${token}`);
         }
   
         headers.set("Content-Type", "Application/json");
         headers.set("Accept", "Application/json");
   
         return headers;
       },
     }),
   
     endpoints: (builder) => ({
       // The `getPosts` endpoint is a "query" operation that returns data
       getFavorites: builder.query({
         // The URL for the request is '/fakeApi/posts'
         query: () => "/favorites?populate=*&pagination[start]=0&pagination[limit]=1000",
       }),
       getFavoritesByUser: builder.query({
        // The URL for the request is '/fakeApi/posts'
        query: (id) => "/favorites?populate=*&pagination[start]=0&pagination[limit]=1000&filters[user][id][$eq]"+id,
      }),
       postFavorites: builder.mutation({
         // The URL for the request is '/fakeApi/posts'
         query: (data) => ({
           url: "/favorites",
           method: "POST",
           body: data,
         }),
       }),
   
          getFavoritesByArtist: builder.query({
         // The URL for the request is '/fakeApi/posts'
         query: (artisteid) => "favorites?populate=*&filters[song][artist][id][$eq]=" + artisteid,
       }),
   
       deleteFavorites: builder.mutation({
         // The URL for the request is '/fakeApi/posts'
         query: (id) => ({
           url: "/favorites/" + id,
           method: "DELETE",
         }),
       }),
     }),
   });
   
   
   
   const FavoritesSlice = createSlice({
     name: "Favorites",
     initialState,
     reducers: {
       setFavorites:  (state, action) => {
           
         state.favorites = action.payload.favorites
       },
     
     },
   });
   
   export const {
     useGetFavoritesQuery,
     useGetFavoritesByUserQuery,
     usePostFavoritesMutation,
     useDeleteFavoritesMutation,
     useGetFavoritesByArtistQuery,
   } = favoritesApi;
   
   export const { setFavorites } = FavoritesSlice.actions;
   
   export default FavoritesSlice.reducer;
   