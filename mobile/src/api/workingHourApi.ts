import { authedApi as api } from "./unifiedAuthApi";
import { WorkingHour, WorkingHourCreate, WorkingHourUpdate } from "../types/workingHour";

export const workingHourApi = {
    get: () => api.get<WorkingHour[]>("/working-hours").then((r) => r.data),
    create: (data: WorkingHourCreate) => api.post("/working-hours", data).then((r) => r.data),
    update: (data: WorkingHourUpdate, id: number) => api.put(`/working-hours/${id}`, data).then((r) => r.data),
    delete: (id: number) => api.delete(`/working-hours/${id}`).then((r) => r.data),
}