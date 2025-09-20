import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = import.meta.env.VITE_API_URL;
console.log('api', API_URL);
const API_KEY = import.meta.env.VITE_API_KEY;

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().user?.token;
    
    headers.set("Content-Type", "application/json");
    headers.set("Accept", "application/json");
    
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  // Si le token est expiré, déconnecter l'utilisateur
  if (result.error && result.error.status === 401) {
    // Import dynamique pour éviter les dépendances circulaires
    const { logOut } = await import('../features/userSlice');
    api.dispatch(logOut());
  }

  return result;
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User'],
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({ 
        url: "/auth/local", 
        body: data, 
        method: "POST" 
      }),
      invalidatesTags: ['User'],
    }),

    register: builder.mutation({
      query: (data) => ({ 
        url: "/auth/local/register", 
        body: data, 
        method: "POST" 
      }),
      invalidatesTags: ['User'],
    }),

    getMe: builder.query({
      query: () => ({
        url: "/users/me",
        params: { populate: '*' }
      }),
      providesTags: ['User'],
    }),
    
    updateProfile: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useLoginMutation, 
  useRegisterMutation, 
  useGetMeQuery,
  useUpdateProfileMutation,
} = authApi;