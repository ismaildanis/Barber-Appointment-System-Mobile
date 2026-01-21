export type Role = "customer" | "barber" | "admin";

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: Role;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  role: Role;
  accessToken: string;
  refreshToken: string;
}

export type RegisterRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export interface UpdateCustomer {
    firstName: string;
    lastName: string;
    phone: string
}
