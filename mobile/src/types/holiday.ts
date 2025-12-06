export interface HolidayDate {
    id: number;
    reason: string;
    date: string;
    createdAt: string;
}

export interface CreateHolidayRequest {
    reason: string;
    date: string;
}