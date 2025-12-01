export type Status = 'SCHEDULED' | 'COMPLETED' | 'NO_SHOW' | 'EXPIRED' | 'BARBER_CANCELLED' |'CANCELLED';
export interface Appointment {
    id: number;
    customerId: number;
    barberId: number;
    serviceId: number;
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
  service?: Service | null;
}

export interface Barber {
    id: number;
    firstName: string;
    lastName: string;
}
export interface Service {
    id: number;
    name: string;
}

export interface CreateAppointmentRequest {
    barberId: number;
    serviceId: number;
    appointmentStartAt: Date;
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
