import { baseApi } from "../baseApi";
import { GetUserStatsResponse } from "@/types/userStats";
import {
  GetUserListResponse,
  GetUserListQueryParams,
  CreateAdminRequest,
  CreateAdminResponse,
  GetUserByIdResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  DeleteUserResponse,
} from "@/types/userList";
import { UserAttachment, GetUserAttachmentsResponse } from "@/types/userAttachment";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserStats: builder.query<GetUserStatsResponse, void>({
      query: () => ({
        url: "/admin/user/stats",
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    getUserList: builder.query<GetUserListResponse, GetUserListQueryParams>({
      query: (params) => ({
        url: "/admin/user",
        method: "GET",
        params,
      }),
      providesTags: ["User"],
    }),
    createAdmin: builder.mutation<CreateAdminResponse, CreateAdminRequest>({
      query: (body) => ({
        url: "/admin/user",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    getUserById: builder.query<GetUserByIdResponse, string>({
      query: (userId) => ({
        url: `/admin/user/${userId}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    updateUser: builder.mutation<UpdateUserResponse, { userId: string; body: UpdateUserRequest }>({
      query: ({ userId, body }) => ({
        url: `/admin/user/${userId}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation<DeleteUserResponse, string>({
      query: (userId) => ({
        url: `/admin/user/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
    getUserAttachments: builder.query<GetUserAttachmentsResponse, { page: number; limit: number; query?: string }>({
      query: (params) => ({
        url: "/admin/user/attachments",
        method: "GET",
        params,
      }),
      providesTags: ["User"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUserStatsQuery,
  useGetUserListQuery,
  useCreateAdminMutation,
  useGetUserByIdQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetUserAttachmentsQuery,
} = userApi;
