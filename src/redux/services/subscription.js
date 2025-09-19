/* React-specific entry point that automatically generates
   hooks corresponding to the defined endpoints */
   import { createSlice } from "@reduxjs/toolkit";
   import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setSubs } from "../features/subscriptionSlice";
   
   const API_URL = import.meta.env.VITE_API_URL;
   const initialState = {
     data: null,
   };
   const initialStateSubs = {
    subscription: {},
  };
   export const typeSubscriptionApi = createApi({
     reducerPath: "typeSubscription",
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
       getTypeSubscription: builder.query({
         // The URL for the request is '/fakeApi/posts'
         query: () => "/type-subscriptions?populate=*&pagination[start]=0&pagination[limit]=1000",
         async (data) {
          setTypeSubscription(data)
         }
       }),
      
   
   
     }),
   });
   
   
   export const subscriptionApi = createApi({
    reducerPath: "subscription",
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
      getSubscription: builder.query({
        // The URL for the request is '/fakeApi/posts'
        query: (id) => `/subscriptions?populate=*&filters[user][id][$eq]=${id}`,
        async (data) {
         setSubs(data)
        }
      }),
      
     postSubscription: builder.mutation({
      query: (data) =>( {
        url: '/subscriptions',
        body: data,
        method: 'POST',
         
      })
     })  
  
    }),
  });
   
   const typeSubscriptionSlice = createSlice({
     name: "typeSubscription",
     initialState,
     reducers: {
      setTypeSubscription:  (state, action) => {
          
        state.TypeSubscription = action.payload.TypeSubscription
      },
     },
   });


   
   export const {
     useGetTypeSubscriptionQuery,
   } = typeSubscriptionApi;
   

   export const {
    useGetSubscriptionQuery,
    usePostSubscriptionMutation,
  } = subscriptionApi;
  
   export const { setTypeSubscription } = typeSubscriptionSlice.actions;
   
   export default (typeSubscriptionSlice.reducer);;
   

   
 