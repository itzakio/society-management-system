import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./features/auth/authSlice";
import bookingReducer from "./features/bookingSlice";
import profileEditReducer from "./features/profile/profileEditSlice";
import notificationReducer from "./features/notification/notificationSlice";
import { baseApi } from "./api/baseApi";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    booking: bookingReducer,
    profileEdit: profileEditReducer,
    notification: notificationReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["profileEdit/setImage", "profileEdit/setPreview"],
        ignoredPaths: ["profileEdit.image"],
      },
    }).concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
