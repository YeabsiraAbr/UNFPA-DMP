import { api, setTokens, clearTokens } from "./api-client";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ChangePasswordRequest,
  FirstTimeChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  SuccessResponse,
  User,
} from "./types";

export const authService = {
  async login(data: LoginRequest): Promise<LoginResponse> {
    const res = await api.post<LoginResponse>("/auth/login", {
      body: data,
      noAuth: true,
    });
    setTokens(res.accessToken, res.refreshToken);
    return res;
  },

  async register(data: RegisterRequest): Promise<{ success: boolean; user: User }> {
    return api.post("/auth/register", { body: data, noAuth: true });
  },

  async refresh(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const res = await api.post<RefreshTokenResponse>("/auth/refresh", {
      body: data,
      noAuth: true,
    });
    setTokens(res.accessToken, res.refreshToken);
    return res;
  },

  async logout(refreshToken: string): Promise<SuccessResponse> {
    const res = await api.post<SuccessResponse>("/auth/logout", {
      body: { refreshToken },
      noAuth: true,
    });
    clearTokens();
    return res;
  },

  async changePassword(data: ChangePasswordRequest): Promise<SuccessResponse> {
    return api.post("/auth/change-password", { body: data });
  },

  async firstTimeChangePassword(data: FirstTimeChangePasswordRequest): Promise<SuccessResponse> {
    return api.post("/auth/first-time-change-password", {
      body: data,
      noAuth: true,
    });
  },

  async forgotPassword(data: ForgotPasswordRequest): Promise<SuccessResponse> {
    return api.post("/auth/forgot-password", { body: data, noAuth: true });
  },

  async resetPassword(data: ResetPasswordRequest): Promise<SuccessResponse> {
    return api.post("/auth/reset-password", { body: data, noAuth: true });
  },
};
