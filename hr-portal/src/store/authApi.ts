import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../components/axiosBaseQuery";

interface LoginRequest {
  email: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface LoginResponse {
  accessToken: string;
  user: User;
}

interface RegistrationPayload {
  username: string;
  email: string;
  password: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: axiosBaseQuery(),
  endpoints: (builder) => ({
    register: builder.mutation<User, RegistrationPayload>({
      query: (body) => ({
        url: "/users/register",
        method: "POST",
        data:body,
      }),
    }),
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: "/users/login",
        method: "POST",
        data:body,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/users/logout",
        method: "POST",
      }),
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useLogoutMutation } =
  authApi;
