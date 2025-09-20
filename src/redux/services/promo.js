/* React-specific entry point that automatically generates
   hooks corresponding to the defined endpoints */
   import { createSlice } from "@reduxjs/toolkit";
   import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
   
   const API_URL = import.meta.env.VITE_API_URL;
   const initialState = {
     data: null,
   };
   
   export const promotionsApi = createApi({
     reducerPath: "promotions",
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
       getPromotion: builder.query({
         // The URL for the request is '/fakeApi/posts'
         query: () => "/promotions?populate=*&pagination[start]=0&pagination[limit]=1000",
       }),
       postPromotion: builder.mutation({
         // The URL for the request is '/fakeApi/posts'
         query: (data) => ({
           url: "/promotions",
           method: "POST",
           body: data,
         }),
       }),
   
          getPromotionByArtist: builder.query({
         // The URL for the request is '/fakeApi/posts'
         query: (artisteid) => "promotions?populate=*&filters[song][artist][id][$eq]=" + artisteid,
       }),
   
       deletePromotion: builder.mutation({
         // The URL for the request is '/fakeApi/posts'
         query: (id) => ({
           url: "/promotion/" + id,
           method: "DELETE",
         }),
       }),
     }),
   });
   
   
   
   const PromotionsSlice = createSlice({
     name: "Promotion",
     initialState,
     reducers: {
       setPromotion:  (state, action) => {
           
         state.promotion = action.payload.promotion
       },
     
     },
   });
   
   export const {
     useGetPromotionQuery,
     usePostPromotionMutation,
     useDeletePromotionMutation,
     useGetPromotionByArtistQuery,
   } = promotionsApi;
   
   export const { setPromotion } = PromotionsSlice.actions;
   
   export default PromotionsSlice.reducer;
   