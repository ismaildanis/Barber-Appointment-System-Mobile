import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { serviceApi } from "../api/serviceApi";
import { CreateService, UpdateService } from "../types/service";

const key = ["service"] as const;

export const useGetServices = () => 
    useQuery({
        queryKey: key,
        queryFn: () => serviceApi.getServices(),
        staleTime: 5 * 60 * 1000
    });

export const useGetService = (id: number) => 
    useQuery({
        queryKey: [key, id],
        queryFn: () => serviceApi.getService(id),
        enabled: !!id
    });

export const useCreateService = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: CreateService) => serviceApi.createService(data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: key });
        },
    })
}
export const useUpdateService = (id: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: UpdateService) => serviceApi.updateService(id, data),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: key });
        },
    })
}

export const useDeleteService = (id: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => serviceApi.deleteService(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: key });
        },
    })  
}

export const useUploadImage = (id: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: any) => serviceApi.uploadImage(data,id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: key });
        },
    }) 
}

export const useDeleteImage = (id: number) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => serviceApi.deleteImage(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: key });
        },
    }) 
}