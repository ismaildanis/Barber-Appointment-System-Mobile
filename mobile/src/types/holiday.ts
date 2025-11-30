export interface HolidayDate {
    id: number;
    reason: string;
    date: Date;
    createdAt: Date;
}

export interface CreateHolidayRequest {
    reason: string;
    date: Date;
}