import { API_URLS } from "@/constants/API_URLS";
import { PAGE_URLS } from "@/constants/PAGE_URLS";
import { useAuthStore } from "@/store/useAuthStore";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 1000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const authStore = useAuthStore.getState();
  if (authStore.accessToken) {
    config.headers.Authorization = `Bearer ${authStore.accessToken}`;
  }
  return config;
});

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let refreshPromise: Promise<string> | null = null;

export function refreshAccessToken(): Promise<string> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = axiosInstance
    .post<{ accessToken: string }>(API_URLS.REFRESH_TOKEN)
    .then((res) => {
      const authStore = useAuthStore.getState();
      authStore.setAccessToken(res.data.accessToken);
      return res.data.accessToken;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryableConfig | undefined;
    const isAuthRoute = original?.url?.includes("/auth/");

    if (
      error.response?.status !== 401 ||
      !original ||
      original._retry ||
      isAuthRoute
    ) {
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      await refreshAccessToken();
      return axiosInstance(original);
    } catch {
      const authStore = useAuthStore.getState();
      authStore.logout();
      if (typeof window !== "undefined") {
        window.location.href = PAGE_URLS.LOGIN;
      }
      return Promise.reject(error);
    }
  },
);

export default axiosInstance;
