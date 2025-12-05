import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../config";
import { CreateService, Service, UpdateService } from "../types/service";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});
const ACCESS_KEY = "unified_access";

api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem(ACCESS_KEY);
    if (token) {
        config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
        } as any;
    }
    return config;
});

export const serviceApi = {
    getServices: () => api.get<Service[]>("/service").then(r => r.data),
    getService: (id: number) => api.get<Service>(`/service/${id}`).then(r => r.data),
    createService: (data: CreateService) => api.post<Service>("/service", data).then(r => r.data),
    updateService: (id: number, data: UpdateService) => api.put<Service>(`/service/${id}`, data).then(r => r.data),
    deleteService: (id: number) => api.delete(`/service/${id}`).then(r => r.data),

    uploadImage: (data: any, id: number) => api.post(`/service/image/${id}`, data).then(r => r.data),
    deleteImage: (id: number) => api.put(`/service/image/${id}`).then(r => r.data),

};