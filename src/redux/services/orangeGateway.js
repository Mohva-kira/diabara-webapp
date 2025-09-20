/* React-specific entry point that automatically generates
   hooks corresponding to the defined endpoints */
   import { createSlice } from "@reduxjs/toolkit";
   import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
   
   const API_TOKEN_URL = import.meta.env.VITE_ORANGE_API_TOKEN_URL;
   const API_CONSUMER_KEY = import.meta.env.VITE_ORANGE_CONSUMER_KEY;
   const API_WEB_URL = import.meta.env.VITE_ORANGE_API_WEB_URL;

   const initialState = {
     data: null,
   };
   
   export const orangeApi = createApi({
     reducerPath: "orange",
     baseQuery: fetchBaseQuery({
       baseUrl: API_URL,
       prepareHeaders: (headers, { getState }) => {
         const storageUser = JSON.parse(localStorage.getItem("auth"));
         const token = getState().auth.auth.token
           ? getState().auth.auth.token
           : storageUser?.jwt;
         // console.log("tok", token);
         if (token) {
           headers.set("authorization", `Bearer ${API_CONSUMER_KEY}`);
         }
   
         headers.set("Content-Type", "Application/json");
         headers.set("Accept", "Application/json");
   
         return headers;
       },
     }),
   
     endpoints: (builder) => ({
       // The `getPosts` endpoint is a "query" operation that returns data
       getOrange: builder.query({
         // The URL for the request is '/fakeApi/posts'
         query: () => "/orange?populate=*&pagination[start]=0&pagination[limit]=1000",
       }),
       postOrange: builder.mutation({
         // The URL for the request is '/fakeApi/posts'
         query: (data) => ({
           url: "/orange",
           method: "POST",
           body: data,
         }),
       }),
   
          getOrangeByArtist: builder.query({
         // The URL for the request is '/fakeApi/posts'
         query: (artisteid) => "orange?populate=*&filters[song][artist][id][$eq]=" + artisteid,
       }),
   
       deleteOrange: builder.mutation({
         // The URL for the request is '/fakeApi/posts'
         query: (id) => ({
           url: "/Orange/" + id,
           method: "DELETE",
         }),
       }),
     }),
   });
   
   
   
   const orangeSlice = createSlice({
     name: "Orange",
     initialState,
     reducers: {
       setOrange:  (state, action) => {
           
         state.Orange = action.payload.Orange
       },
     
     },
   });
   
   export const {
     useGetOrangeQuery,
     usePostOrangeMutation,
     useDeleteOrangeMutation,
     useGetOrangeByArtistQuery,
   } = orangeApi;
   
   export const { setOrange } = orangeSlice.actions;
   
   export default orangeSlice.reducer;
   