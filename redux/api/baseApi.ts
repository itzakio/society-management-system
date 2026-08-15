import { getAccessToken } from "@/lib/cookies";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "baseApi",

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
    credentials: "include",

    prepareHeaders: (headers) => {
      if (typeof window !== "undefined") {
        // const token = localStorage.getItem("accessToken");
        const token = getAccessToken();

        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }

      return headers;
    },
  }),

  tagTypes: ["Auth", "User", "Exhibition", "Booking", "Stand", "Dashboard", "Notification"],

  endpoints: () => ({}),
});
