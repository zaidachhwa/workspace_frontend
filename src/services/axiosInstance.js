import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// The access token expires every 15 minutes by design — this is what makes
// the 7-day refresh token actually mean something. Without this, every
// request just starts failing after 15 minutes even though a valid refresh
// token exists. Concurrent 401s share one in-flight refresh call rather than
// each firing their own — the backend rotates (invalidates) the refresh
// token on use, so a second simultaneous refresh call would otherwise fail.
let refreshPromise = null;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    const isAuthEndpoint = config?.url?.includes("/auth/");

    if (response?.status !== 401 || isAuthEndpoint || config._retriedAfterRefresh) {
      return Promise.reject(error);
    }

    config._retriedAfterRefresh = true;
    refreshPromise ??= axiosInstance.post("/auth/refresh").finally(() => {
      refreshPromise = null;
    });

    try {
      await refreshPromise;
      return axiosInstance(config);
    } catch {
      return Promise.reject(error);
    }
  }
);

export default axiosInstance;
