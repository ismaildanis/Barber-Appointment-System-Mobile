import { authedApi as api } from "../api/unifiedAuthApi";
import { CreateHolidayRequest, HolidayDate } from "../types/holiday";

export const holidayApi = {
    getHolidays: async () => await api.get<HolidayDate[]>("/holiday").then(r => r.data),
    createHoliday: async (data: CreateHolidayRequest) => await api.post<HolidayDate>("/holiday", data).then(r => r.data),
    deleteHoliday: async (id: number) => await api.delete(`/holiday/${id}`).then(r => r.data),
};
