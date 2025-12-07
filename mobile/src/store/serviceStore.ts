import { create } from "zustand";

type ServiceState = {
    serviceIds: number[];
    setServiceIds: (ids: number[]) => void;
    toggleService: (id: number) => void;
}

export const useServiceStore = create<ServiceState>((set) => ({
  serviceIds: [] as number[],
  setServiceIds: (ids) => set({ serviceIds: ids }),
  toggleService: (id) =>
    set((state) => ({
      serviceIds: state.serviceIds.includes(id)
        ? state.serviceIds.filter((x) => x !== id)
        : [...state.serviceIds, id],
    })),
}));