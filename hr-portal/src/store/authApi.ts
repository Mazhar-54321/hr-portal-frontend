import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface LoginRequest {
  email: string;
  password: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface LoginResponse {
  accessToken: string;
  user: User;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: "/users/login",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;
