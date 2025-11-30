export interface Barber {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string
    active: boolean
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