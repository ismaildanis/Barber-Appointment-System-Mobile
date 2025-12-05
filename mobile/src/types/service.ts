export interface Service {
    id: number
    name: string
    description: string
    price: string
    duration: number
    image?: string
    createdAt: Date
    updatedAt: Date
}

export interface CreateService {
    name: string
    description?: string
    price: string
    duration: number
}

export interface UpdateService {
    name?: string
    description?: string
    price?: string
    duration?: number
}