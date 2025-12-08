import { create } from "zustand";

type BarberState = {
  barberId: number | null;
  setBarberId: (id: number | null) => void;
};

export const useBarberStore = create<BarberState>((set) => ({
  barberId: null,
  setBarberId: (id: number | null) => set({ barberId: id }),
}));
