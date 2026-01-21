export interface Barber {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string
    active: boolean
    image?: string
}
export interface CreateBarber {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string
}

export interface ActivityBarber {
    active: boolean
}

export interface UpdateBarber {
    firstName: string;
    lastName: string;
    phone: string
}