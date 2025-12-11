import { create } from "zustand";

type HourState = {
  selectedHour?: string;
  setSelectedHour: (hour: any) => void;
};

export const useHourStore = create<HourState>((set) => ({
  selectedHour: undefined,
  setSelectedHour: (hour: any) => set({ selectedHour: hour }),
}));
