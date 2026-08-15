import {
  LoginRequest,
  LoginResponse,
  SignUpRequest,
  SignUpResponse,
  VerifyEmailRequest,
  ResetPasswordRequest,
  ResetPasswordResponse,
  UpdateProfileResponse,
  GetMeResponse,
  UploadAttachmentResponse,
  ChangePasswordResponse,
} from "@/types/auth.types";
import { baseApi } from "../baseApi";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    signUp: builder.mutation<SignUpResponse, SignUpRequest>({
      query: (body) => ({
        url: "/auth/signup",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),
    signIn: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: "/auth/signin",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),

    verifyEmail: builder.mutation<LoginResponse, VerifyEmailRequest>({
      query: (data) => ({
        url: "/auth/verify-email",
        method: "POST",
        body: data,
      }),
    }),
    resendVerificationEmail: builder.mutation({
      query: (data) => ({
        url: "/auth/resend-verification-email",
        method: "POST",
        body: data,
      }),
    }),

    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation<
      ResetPasswordResponse,
      ResetPasswordRequest
    >({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["User","Auth"],
    }),
    getMe: builder.query<GetMeResponse, void>({
      query: () => "/auth/me",
      providesTags: ["User", "Auth"],
    }),
    updateProfile: builder.mutation<UpdateProfileResponse, FormData>({
      query: (formData) => ({
        url: "/auth/update",
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["User", "Auth"],
    }),
    uploadAttachment: builder.mutation<UploadAttachmentResponse, FormData>({
      query: (formData) => ({
        url: "/auth/upload",
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["User", "Auth"],
    }),
    changePassword: builder.mutation<
      ChangePasswordResponse,
      { oldPassword: string; newPassword: string }
    >({
      query: (body) => ({
        url: "/auth/change-password",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User", "Auth"],
    }),
  }),

  overrideExisting: false,
});

export const {
  useSignUpMutation,
  useSignInMutation,
  useVerifyEmailMutation,
  useResendVerificationEmailMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLogoutMutation,
  useGetMeQuery,
  useUpdateProfileMutation,
  useUploadAttachmentMutation,
  useChangePasswordMutation,
} = authApi;
