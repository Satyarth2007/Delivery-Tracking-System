import apiClient from "./apiClient.js";

export const authApi = {
  registerCompany: (payload) => apiClient.post("/auth/register", payload),
  verifyOwner: (payload) => apiClient.post("/auth/verify-owner", payload),
  resendOtp: (payload) => apiClient.post("/auth/resend-otp", payload),
  login: (payload) => apiClient.post("/auth/login", payload),
  logout: () => apiClient.post("/auth/logout"),
  forgotPassword: (payload) => apiClient.post("/auth/forgot-password", payload),
  resetPassword: (payload) => apiClient.post("/auth/reset-password", payload),
};