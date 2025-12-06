export type Status = 'SCHEDULED' | 'COMPLETED' | 'NO_SHOW' | 'EXPIRED' | 'BARBER_CANCELLED' |'CANCELLED';
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
}

export interface LastAppointment extends Appointment {
  barber?: Barber | null;
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
}

export interface AppointmentService {
    id: number;
    appointmentId: number;
    serviceId: number;
    service: Service;
}

export interface CreateAppointmentRequest {
    barberId: number;
    serviceIds: number;
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
