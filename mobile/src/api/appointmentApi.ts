import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../config";
import { Appointment, CreateAppointmentRequest, UpdateAppointmentRequest, CreateBreakForBarber } from "../types/appointment";
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
 
export const appointmentApi = {
    //Customer
    getCustomerAppointments: async () => await  api.get<Appointment[]>("/appointment").then(r => r.data),
    getCustomerOneAppointment: async (id: number) => await api.get<Appointment>(`/appointment/${id}`).then(r => r.data),
    createAppointment: async (data: CreateAppointmentRequest, id: number) => await api.post<Appointment>(`/appointment/${id}`, data).then(r => r.data),
    updateCustomerAppointment: async (data: UpdateAppointmentRequest) => await api.put<Appointment>("/appointment", data).then(r => r.data),
    cancelCustomerAppointment: async (id: number) => await api.put(`/appointment/cancel/${id}`).then(r => r.data),
    availableHoursForAppointment: async (barberId: number, date: string) => await api.get(`/appointment/available-hours/${barberId}`, { params: { date } }).then(r => r.data),
    availableDatesForAppointment: async () => await api.get(`/appointment/available-dates`).then(r => r.data),

    //Barber
    getBarberAppointments: async () => await api.get<Appointment[]>(`/appointment/barber`).then(r => r.data),
    cancelBarberAppointment: async (id: number) => await api.post(`/appointment/barber-cancel/${id}`).then(r => r.data),
    createBreakForBarber: async (data: CreateBreakForBarber) => await api.post(`/appointment/barber-break`, data).then(r => r.data),

    //Admin
    markCanceledAppointment: async (id: number) => await api.post(`/appointment/mark-cancel/${id}`).then(r => r.data),
    markNoShowAppointment: async (id: number) => await api.post(`/appointment/mark-no-show/${id}`).then(r => r.data),
    markCompletedAppointment: async (id: number) => await api.post(`/appointment/mark-completed/${id}`).then(r => r.data),

}