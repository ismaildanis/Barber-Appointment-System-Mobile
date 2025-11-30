import axios, { AxiosError, AxiosRequestConfig } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../config";
import {
  Customer,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "../types/customerAuth";

const ACCESS_KEY = "customer_access";
const REFRESH_KEY = "customer_refresh";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
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
let pendingQueue: Array<(token: string | null) => void> = [];

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    original._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push((token) => {
          if (!token) return reject(error);
          original.headers = { ...original.headers, Authorization: `Bearer ${token}` };
          resolve(api(original));
        });
      });
    }

    isRefreshing = true;
    try {
      const refreshToken = await AsyncStorage.getItem(REFRESH_KEY);
      if (!refreshToken) throw error;

      const resp = await axios.post<{ accessToken: string; refreshToken: string }>(
        `${API_URL}/auth/refresh`,
        null,
        { headers: { Authorization: `Bearer ${refreshToken}` } }
      );

      await AsyncStorage.setItem(ACCESS_KEY, resp.data.accessToken);
      await AsyncStorage.setItem(REFRESH_KEY, resp.data.refreshToken);

      pendingQueue.forEach((cb) => cb(resp.data.accessToken));
      pendingQueue = [];
      original.headers = {
        ...original.headers,
        Authorization: `Bearer ${resp.data.accessToken}`,
      };
      return api(original);
    } catch (err) {
      pendingQueue.forEach((cb) => cb(null));
      pendingQueue = [];
      await AsyncStorage.multiRemove([ACCESS_KEY, REFRESH_KEY]);
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export const customerAuthApi = {
  login: async (data: LoginRequest) => {
    const res = await api.post<LoginResponse>("/unified-auth/login", data);
    await AsyncStorage.setItem(ACCESS_KEY, res.data.accessToken);
    await AsyncStorage.setItem(REFRESH_KEY, res.data.refreshToken);
    return res.data;
  },
  register: (data: RegisterRequest) => api.post<RegisterResponse>("/auth/register", data).then(r => r.data),
  me: () => api.get<Customer>("/auth/me").then(r => r.data),
  logout: async () => {
    await api.post("/auth/logout");
    await AsyncStorage.multiRemove([ACCESS_KEY, REFRESH_KEY]);
  },
};
