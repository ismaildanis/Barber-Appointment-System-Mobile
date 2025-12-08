import { create } from "zustand";

type AppointmentState = {
    appointmentId: number | null;
    setAppointmentId: (id: number | null) => void;
};

export const useAppointmentStore = create<AppointmentState>((set) => ({
    appointmentId: null, 
    setAppointmentId: (id: number | null) => set({appointmentId: id})
}))