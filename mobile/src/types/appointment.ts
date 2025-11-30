export type Status = 'SCHEDULED' | 'COMPLETED' | 'NO_SHOW' | 'EXPIRED' | 'BARBER_CANCELLED' |'CANCELLED';
export interface Appointment {
    id: number;
    customerId: number;
    barberId: number;
    serviceId: number;
    appointmentStartAt: Date;
    appointmentEndAt: Date;
    status: Status;
    notes?: string;
    cancelReason?: string;
    createdAt: Date;
    updatedAt: Date;
    cancelledAt?: Date | null; 
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
