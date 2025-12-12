import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Appointment, CreateAppointmentRequest, UpdateAppointmentRequest, CreateBreakForBarber, Status } from "../types/appointment";
import { appointmentApi } from "../api/appointmentApi";

const key = ["appointment"] as const;

//Customer
export const useGetCustomerAppointments = () => 
    useQuery({
        queryKey: key,
        queryFn: () => appointmentApi.getCustomerAppointments(),
        staleTime: 5 * 60 * 1000
    })

export const useGetCustomerOneAppointment = (id: number) => 
    useQuery({
        queryKey: [key, id],
        queryFn: () => appointmentApi.getCustomerOneAppointment(id),
        enabled: !!id
    })


export const useGetCustomerLastAppointment = () =>
    useQuery({
        queryKey: ["appointment", "last-completed"],
        queryFn: () => appointmentApi.getCustomerLastAppointment(),
        staleTime: 5 * 60 * 1000,
    });

export const useGetCustomerScheduledAppointment = () =>
    useQuery({
        queryKey: ["appointment", "last-scheduled"],
        queryFn: () => appointmentApi.getCustomerScheduledAppointment(),
        staleTime: 5 * 60 * 1000,
    });

export const useCreateAppointment = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: CreateAppointmentRequest) => appointmentApi.createAppointment(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: key })
        },
    })
}

export const  useUpdateCustomerAppointment = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: UpdateAppointmentRequest) => appointmentApi.updateCustomerAppointment(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: key })
        },
    })
}

export const useCancelCustomerAppointment = (id: number) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: () => appointmentApi.cancelCustomerAppointment(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: key })
        },
    })
}

export const useAvailableHoursForAppointment = (barberId?: number, date?: string) =>
  useQuery({
    queryKey: ["appointment", "available-hours", barberId, date],
    queryFn: async () => {
      const { allHours, busyHours } = await appointmentApi.availableHoursForAppointment(barberId!, date!);
      return allHours.map((time: any) => ({ time, available: !busyHours.includes(time) }));
    },
    enabled: !!barberId && !!date,
  });


export const  useAvailableDatesForAppointment = () => 
    useQuery({
        queryKey: ["appointment", "available-dates"],
        queryFn: () => appointmentApi.availableDatesForAppointment(),
        staleTime : 5 * 60 * 1000
    })


//Barber

export const useGetBarberAppointments = (date?: string) => 
    useQuery({
        queryKey: ["barber-appointments", date],
        queryFn: () => appointmentApi.getBarberAppointments(date!),
        enabled: !!date,
        staleTime: 5 * 60 * 1000
    })

export const useGetBarberOneAppointment = (id?: number) => 
    useQuery({
        queryKey: ["barber-appointment", id],
        queryFn: () => appointmentApi.getBarberOneAppointment(id!),
        enabled: !!id,
        staleTime: 5 * 60 * 1000
    })

export const useGetBarberTodayAppointments = () => 
    useQuery({
        queryKey: ["barber-today-appointments"],
        queryFn: () => appointmentApi.getBarberTodayAppointments(),
        staleTime: 5 * 60 * 1000
    })

export const useCancelBarberAppointment = (id: number) => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: () => appointmentApi.cancelBarberAppointment(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: key })
        },
    })
}

export const useCreateBreakForBarber = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (data: CreateBreakForBarber) => appointmentApi.createBreakForBarber(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: key })
        },
    })
}

//Admin

export const useGetAdminAppointments = (status: Status) => 
    useQuery({
        queryKey: key,
        queryFn: () => appointmentApi.getAdminAppointments(status),
        staleTime: 5 * 60 * 1000
    })

export const useGetAdminOneAppointment = (id: number) => 
    useQuery({
        queryKey: [key, id],
        queryFn: () => appointmentApi.getAdminOneAppointment(id),
        enabled: !!id
    })

export const useMarkCanceledAppointment = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => appointmentApi.markCanceledAppointment(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: key })
        },
    })
}

export const useMarkNoShowAppointment = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => appointmentApi.markNoShowAppointment(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: key })
        },
    })
}

export const useMarkCompletedAppointment = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (id: number) => appointmentApi.markCompletedAppointment(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: key })
        },
    })
}