import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import { authApi } from "./authApi";
import employeeReducer from "./employeeSlice";
import { employeeApi } from "./employeeApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,           
    [authApi.reducerPath]: authApi.reducer,
    employee:employeeReducer,
    [employeeApi.reducerPath]:employeeApi.reducer 
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware,employeeApi.middleware), 
});

export type RootState = ReturnType<typeof store.getState>; 
export type AppDispatch = typeof store.dispatch;           
