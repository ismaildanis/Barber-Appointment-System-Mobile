import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { holidayApi } from '../api/holidayApi'
import { CreateHolidayRequest, HolidayDate } from '../types/holiday'

const key = ['holiday'] as const

export const useGetHolidays = () => 
    useQuery({ 
        queryKey: key, 
        queryFn: () => holidayApi.getHolidays(), 
        staleTime: 5 * 60 * 1000
    })

export const useCreateHoliday = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: CreateHolidayRequest) => holidayApi.createHoliday(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: key })
        },
    })
}

export const useDeleteHoliday = (id: number) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: () => holidayApi.deleteHoliday(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: key })
        },
    })
}