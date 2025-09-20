 /* React-specific entry point that automatically generates
   hooks corresponding to the defined endpoints */
import { createSlice } from "@reduxjs/toolkit";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = import.meta.env.VITE_DL_SERVER;
const initialState = {
  data: null,
};

export const dlApi = createApi({
  reducerPath: "dlService",
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
    getDl: builder.query({
      // The URL for the request is '/fakeApi/posts'
      query: () => "/?populate=*&pagination[start]=0&pagination[limit]=1000",
    }),
    postDl: builder.mutation({
      // The URL for the request is '/fakeApi/posts'
      query: ( data) => ({
        url: "/"+data.id,
        method: "POST",
        body: data,
      }),
    }),

    deleteDl: builder.mutation({
      // The URL for the request is '/fakeApi/posts'
      query: (id) => ({
        url: "/dl/" + id,
        method: "DELETE",
      }),
    }),
  }),
});



const DlSlice = createSlice({
  name: "Dl_service",
  initialState,
  reducers: {
    setDl:  (state, action) => {
        
      state.data = action.payload
    },
  
  },
});

export const {
  useGetDlQuery,
  usePostDlMutation,
  useDeleteDlMutation,
} = dlApi;

export const { setDl } = DlSlice.actions;

export default DlSlice.reducer;
