import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../config";
import { CreateHolidayRequest, HolidayDate } from "../types/holiday";
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

export const holidayApi = {
    getHolidays: async () => await api.get<HolidayDate[]>("/holiday").then(r => r.data),
    createHoliday: async (data: CreateHolidayRequest) => await api.post<HolidayDate>("/holiday", data).then(r => r.data),
    deleteHoliday: async (id: number) => await api.delete(`/holiday/${id}`).then(r => r.data),
};
