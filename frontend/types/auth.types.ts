export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  societyId: string | null;
}

export interface LoginRequest {
  email?: string;
  password?: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: User;
  };
}

export interface AcceptInvitationRequest {
  token: string;
  password?: string;
}

export interface AcceptInvitationResponse {
  success: boolean;
  message: string;
  data: {
    userId: string;
    email: string;
  };
}

export interface SignUpRequest {
  [key: string]: any;
}

export interface SignUpResponse {
  [key: string]: any;
}

export interface VerifyEmailRequest {
  [key: string]: any;
}

export interface ResetPasswordRequest {
  [key: string]: any;
}

export interface ResetPasswordResponse {
  [key: string]: any;
}

export interface UpdateProfileResponse {
  [key: string]: any;
}

export interface GetMeResponse {
  success: boolean;
  user: User;
}

export interface UploadAttachmentResponse {
  [key: string]: any;
}

export interface ChangePasswordResponse {
  [key: string]: any;
}
