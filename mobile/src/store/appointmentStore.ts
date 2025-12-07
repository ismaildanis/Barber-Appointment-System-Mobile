import { create } from "zustand";

type AppointmentState = {
  barberId: number | null;
  setBarberId: (id: number | null) => void;
};

export const useAppointmentStore = create<AppointmentState>((set) => ({
  barberId: null,
  setBarberId: (id: number | null) => set({ barberId: id }),
}));
