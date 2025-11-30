import axios, { AxiosError, AxiosRequestConfig } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../config";

const ACCESS_KEY = "unified_access";
const REFRESH_KEY = "unified_refresh";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

api.interceptors.request.use(async (config) => {

    const token = await AsyncStorage.getItem(ACCESS_KEY)
    if(token) {
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
        } as any
        
    }
    return config
});

let isRefreshing = false;
let queue: Array<(t: string | null) => void> = [];

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status !== 401 || original._retry) return Promise.reject(error);
    original._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push((t) => {
          if (!t) return reject(error);
          original.headers = { ...original.headers, Authorization: `Bearer ${t}` };
          resolve(api(original));
        });
      });
    }

    isRefreshing = true;
    try {
      const refreshToken = await AsyncStorage.getItem(REFRESH_KEY);
      if (!refreshToken) throw error;

      const resp = await axios.post<{ accessToken: string; refreshToken: string }>(
        `${API_URL}/unified-auth/refresh`,
        { refreshToken } // body’de gönderiyoruz
      );

      await AsyncStorage.setItem(ACCESS_KEY, resp.data.accessToken);
      await AsyncStorage.setItem(REFRESH_KEY, resp.data.refreshToken);

      queue.forEach((cb) => cb(resp.data.accessToken));
      queue = [];
      original.headers = { ...original.headers, Authorization: `Bearer ${resp.data.accessToken}` };
      return api(original);
    } catch (err) {
      queue.forEach((cb) => cb(null));
      queue = [];
      await AsyncStorage.multiRemove([ACCESS_KEY, REFRESH_KEY]);
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export const unifiedAuthApi = {
  login: async (data: any) => {
    const res = await api.post("/unified-auth/login", data);
    await AsyncStorage.setItem(ACCESS_KEY, res.data.accessToken);
    await AsyncStorage.setItem(REFRESH_KEY, res.data.refreshToken);
    return res.data; 
  },
  me: () => api.get("/unified-auth/me").then((r) => r.data),
  logout: async () => {
    await api.post("/unified-auth/logout");
    await AsyncStorage.multiRemove([ACCESS_KEY, REFRESH_KEY]);
  },
};
