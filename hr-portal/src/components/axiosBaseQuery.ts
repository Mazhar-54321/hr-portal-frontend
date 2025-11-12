import type { BaseQueryFn } from "@reduxjs/toolkit/query";
import axios from "axios";
import { store } from "../store/store";
import { updateAccessToken, logout } from "../store/authSlice";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

export const axiosBaseQuery =
  (): BaseQueryFn<any, unknown, unknown> =>
  async ({ url, method = "get", data }) => {
    try {
      const token = store.getState().auth.accessToken;
      const headers: any = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await api({ url, method, data, headers });
      return { data: res.data };
    } catch (error: any) {
      if (error.response?.status === 401 && !error.config._retry) {
        error.config._retry = true;
        try {
          const refreshRes = await api.post("/users/refresh"); 
          const newToken = refreshRes.data.accessToken;
          store.dispatch(updateAccessToken(newToken));
          error.config.headers["Authorization"] = `Bearer ${newToken}`;
          const retryRes = await api(error.config);
          return { data: retryRes.data };
        } catch {
          store.dispatch(logout());
          return { error: "Session expired" };
        }
      }
      return { error: error.message };
    }
  };
