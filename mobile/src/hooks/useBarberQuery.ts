import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { barberApi } from '../api/barberApi'
import { ActivityBarber, CreateBarber } from '../types/barber';

const key = ['barber'] as const

export const useGetBarbers = () => 
    useQuery({ 
        queryKey: key, 
        queryFn: () => barberApi.getBarbers(), 
        staleTime: 5 * 60 * 1000 
    });

export const useGetBarber = (id: number) => 
    useQuery({ 
        queryKey: [key, id], 
        queryFn: () => barberApi.getBarber(id), 
        enabled: !!id 
    });

export const useCreateBarber = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: CreateBarber) => barberApi.createBarber(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: key })
        },
    })
}

export const useUpdateActivityBarberr = (id: number) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: ActivityBarber) => barberApi.updateBarberActivity(id, data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: key })
        },
    })
}

export const useDeleteBarber = (id: number) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: () => barberApi.deleteBarber(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: key })
        },
    })
}