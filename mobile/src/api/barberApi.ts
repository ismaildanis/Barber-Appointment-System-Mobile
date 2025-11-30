import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../config";
import { ActivityBarber, CreateBarber, Barber } from "../types/barber";

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

export const barberApi = {
    getBarbers: async () => await api.get<Barber[]>("/barber").then(r => r.data),
    getBarber: async (id: number) => await api.get<Barber>(`/barber/${id}`).then(r => r.data),
    createBarber: async (data: CreateBarber) => await api.post("/barber", data).then(r => r.data),
    updateBarberActivity: async (id: number, data: ActivityBarber) => await api.put(`/barber/${id}`, data).then(r => r.data),
    deleteBarber: async (id: number) => await api.delete(`/barber/${id}`).then(r => r.data),
};