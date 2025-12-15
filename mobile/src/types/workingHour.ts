export type DayOfWeek = 1 | 2 | 3 | 4 | 5 | 6;


export interface WorkingHour {
    id: number;
    barberId: number;
    dayOfWeek: DayOfWeek;
    startMin: number;
    endMin: number;
}

export interface WorkingHourCreate {
    dayOfWeek: DayOfWeek;
    startMin: number;
    endMin: number;
}

export interface WorkingHourUpdate {
    dayOfWeek: DayOfWeek;
    startMin: number;
    endMin: number;
}

export const dayOfWeekLabel: Record<DayOfWeek, string> = {
    1: "Pazartesi",
    2: "Salı",
    3: "Çarşamba",
    4: "Perşembe",
    5: "Cuma",
    6: "Cumartesi",
}