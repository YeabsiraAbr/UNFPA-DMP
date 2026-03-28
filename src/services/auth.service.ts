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
    const raw = await api.post<Record<string, unknown>>("/auth/login", {
      body: data,
      noAuth: true,
    });
    const res = (raw.data ?? raw) as LoginResponse;
    setTokens(res.accessToken, res.refreshToken);
    return res;
  },

  async register(data: RegisterRequest): Promise<{ success: boolean; user: User }> {
    const raw = await api.post<Record<string, unknown>>("/auth/register", { body: data, noAuth: true });
    const user = (raw.data ?? raw.user ?? raw) as User;
    return { success: true, user };
  },

  async refresh(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const raw = await api.post<Record<string, unknown>>("/auth/refresh", {
      body: data,
      noAuth: true,
    });
    const res = (raw.data ?? raw) as RefreshTokenResponse;
    setTokens(res.accessToken, res.refreshToken);
    return res;
  },

  async logout(refreshToken: string): Promise<SuccessResponse> {
    await api.post("/auth/logout", {
      body: { refreshToken },
      noAuth: true,
    });
    clearTokens();
    return { success: true };
  },

  async changePassword(data: ChangePasswordRequest): Promise<SuccessResponse> {
    await api.post("/auth/change-password", { body: data });
    return { success: true };
  },

  async firstTimeChangePassword(data: FirstTimeChangePasswordRequest): Promise<SuccessResponse> {
    await api.post("/auth/first-time-change-password", {
      body: data,
      noAuth: true,
    });
    return { success: true };
  },

  async forgotPassword(data: ForgotPasswordRequest): Promise<SuccessResponse> {
    await api.post("/auth/forgot-password", { body: data, noAuth: true });
    return { success: true };
  },

  async resetPassword(data: ResetPasswordRequest): Promise<SuccessResponse> {
    await api.post("/auth/reset-password", { body: data, noAuth: true });
    return { success: true };
  },
};
