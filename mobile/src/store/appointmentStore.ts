import { create } from "zustand";

type AppointmentState = {
  barberId: number | null;
  setBarberId: (id: number | null) => void;
};

export const useAppointmentStore = create<AppointmentState>((set: any) => ({
  barberId: null,
  setBarberId: (id : any) => set({ barberId: id }),
}));
