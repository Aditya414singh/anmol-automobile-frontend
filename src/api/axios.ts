import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Prevent multiple refresh requests at the same time
let isRefreshing = false;

let refreshSubscribers: Array<
  (token: string) => void
> = [];

const subscribeToTokenRefresh = (
  callback: (token: string) => void
) => {
  refreshSubscribers.push(callback);
};

const notifyTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) =>
    callback(token)
  );

  refreshSubscribers = [];
};

const clearAuthStorage = () => {
  localStorage.removeItem("anmol-access-token");
  localStorage.removeItem("anmol-refresh-token");
};

// ==========================================
// REQUEST INTERCEPTOR
// ==========================================

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem(
      "anmol-access-token"
    );

    if (accessToken) {
      config.headers.Authorization =
        `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ==========================================
// RESPONSE INTERCEPTOR
// ==========================================

api.interceptors.response.use(
  (response) => {
    return response;
  },

  async (error: AxiosError) => {
    const originalRequest =
      error.config as
        | (InternalAxiosRequestConfig & {
            _retry?: boolean;
          })
        | undefined;

    // No request information
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Only handle 401 responses
    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    // Don't refresh the token for auth endpoints
    const requestUrl = originalRequest.url ?? "";

    if (
      requestUrl.includes("/auth/login/") ||
      requestUrl.includes("/auth/register/") ||
      requestUrl.includes("/auth/refresh-token/")
    ) {
      return Promise.reject(error);
    }

    // Prevent infinite retry loop
    if (originalRequest._retry) {
      clearAuthStorage();

      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const refreshToken = localStorage.getItem(
      "anmol-refresh-token"
    );

    if (!refreshToken) {
      clearAuthStorage();

      return Promise.reject(error);
    }

    // ==========================================
    // REFRESH ALREADY IN PROGRESS
    // ==========================================

    if (isRefreshing) {
      return new Promise((resolve) => {
        subscribeToTokenRefresh(
          (newAccessToken) => {
            originalRequest.headers.Authorization =
              `Bearer ${newAccessToken}`;

            resolve(api(originalRequest));
          }
        );
      });
    }

    // ==========================================
    // START REFRESH
    // ==========================================

    isRefreshing = true;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token/`,
        {
          refresh: refreshToken,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const newAccessToken =
        response.data.data.access;

      const newRefreshToken =
        response.data.data.refresh;

      localStorage.setItem(
        "anmol-access-token",
        newAccessToken
      );

      if (newRefreshToken) {
        localStorage.setItem(
          "anmol-refresh-token",
          newRefreshToken
        );
      }

      notifyTokenRefreshed(newAccessToken);

      originalRequest.headers.Authorization =
        `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      clearAuthStorage();

      refreshSubscribers = [];

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;