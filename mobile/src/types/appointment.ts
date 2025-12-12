import { Customer } from "./customerAuth";

export type Status = 'SCHEDULED' | 'COMPLETED' | 'NO_SHOW' | 'EXPIRED' | 'BARBER_CANCELLED' |'CANCELLED';

export const statusLabel: Record<Status, string> = {
  SCHEDULED: "Planlandı",
  COMPLETED: "Tamamlandı",
  NO_SHOW: "Gelinmedi",
  EXPIRED: "Süresi Doldu",
  BARBER_CANCELLED: "Berber İptali",
  CANCELLED: "İptal Edildi",
};

export const statusColor: Record<Status, string> = {
  SCHEDULED: "#4ade80",        // yeşil
  COMPLETED: "#22c55e",        // koyu yeşil
  NO_SHOW: "#f59e0b",          // amber
  EXPIRED: "#a855f7",          // mor
  BARBER_CANCELLED: "#ef4444", // kırmızı
  CANCELLED: "#ef4444",        // kırmızı
};
export interface Appointment {
    id: number;
    customerId: number;
    barberId: number;
    appointmentStartAt: string;
    appointmentEndAt: string;
    status: Status;
    notes?: string;
    cancelReason?: string;
    createdAt: string;
    updatedAt: string;
    cancelledAt?: string | null; 
    barber?: Barber | null;
    appointmentServices?: AppointmentService[] | null;
}

export interface AdminAppointment {
    id: number;
    customerId: number;
    barberId: number;
    appointmentStartAt: string;
    appointmentEndAt: string;
    status: Status;
    notes?: string;
    cancelReason?: string;
    createdAt: string;
    updatedAt: string;
    cancelledAt?: string | null;
    barber?: Barber | null;
    customer?: Customer | null;
    appointmentServices?: AppointmentService[] | null; 
}

export interface BarberAppointment {
    id: number;
    customerId: number;
    barberId: number;
    appointmentStartAt: string;
    appointmentEndAt: string;
    status: Status;
    notes?: string;
    cancelReason?: string;
    createdAt: string;
    updatedAt: string;
    cancelledAt?: string | null;
    customer?: Customer | null;
    appointmentServices?: AppointmentService[] | null;
}

export interface Barber {
    id: number;
    firstName: string;
    lastName: string;
    image?: string;
}
export interface Service {
    id: number;
    name: string;
    image?: string;
    price: string;
}

export interface AppointmentService {
    id: number;
    appointmentId: number;
    serviceId: number;
    service: Service;
}

export interface CreateAppointmentRequest {
    barberId: number;
    serviceIds: number[];
    appointmentStartAt: string;
    notes?: string;
}

export interface UpdateAppointmentRequest {
    barberId?: number;
    serviceId?: number;
    appointmentStartAt?: Date;
    notes?: string;
}

export interface CreateBreakForBarber {
    startMin: number;
    endMin: number;
}
