import { authedApi as api } from "../api/unifiedAuthApi";
import { ActivityBarber, CreateBarber, Barber } from "../types/barber";

export const barberApi = {
    getBarbers: async () => await api.get<Barber[]>("/barber").then(r => r.data),
    getBarber: async (id: number) => await api.get<Barber>(`/barber/${id}`).then(r => r.data),
    createBarber: async (data: CreateBarber) => await api.post("/barber", data).then(r => r.data),
    updateBarberActivity: async (id: number, data: ActivityBarber) => await api.put(`/barber/${id}`, data).then(r => r.data),
    deleteBarber: async (id: number) => await api.delete(`/barber/${id}`).then(r => r.data),

    uploadImage: (data: any) => api.post("/barber/image", data).then(r => r.data),
    deleteImage: (id: number) => api.put(`/barber/image/${id}`).then(r => r.data),
};