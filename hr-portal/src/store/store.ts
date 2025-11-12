import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./authSlice";
import { authApi } from "./authApi";
import employeeReducer from "./employeeSlice";
import { employeeApi } from "./employeeApi";

const persistConfig = {
  key: "auth", 
  storage,
  whitelist: ["accessToken", "user"],
};
const rootReducer = combineReducers({
  auth: persistReducer(persistConfig, authReducer), 
  employee: employeeReducer,
  [authApi.reducerPath]: authApi.reducer,
  [employeeApi.reducerPath]: employeeApi.reducer,
});
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware,employeeApi.middleware), 
});
export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>; 
export type AppDispatch = typeof store.dispatch;           
