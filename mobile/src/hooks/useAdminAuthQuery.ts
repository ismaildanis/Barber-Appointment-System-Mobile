import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminAuthApi } from '../api/adminAuthApi'
import {
  Admin,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "../types/adminAuth";

const keys = {
    me : ['admin', 'me'] as const,
}

export const useAdminMe = () => 
    useQuery<Admin>({
        queryKey: keys.me,
        queryFn: () => adminAuthApi.me(),
        staleTime: 5 * 60 * 1000
    });

export const useAdminLogin = () => {
    const qc = useQueryClient();

    return useMutation<LoginResponse, Error, LoginRequest>({
        mutationFn: (payload) => adminAuthApi.login(payload),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: keys.me })
        }
    })
}

export const useAdminRegister = () => {
  const qc = useQueryClient();
  return useMutation<RegisterResponse, Error, RegisterRequest>({
    mutationFn: (payload) => adminAuthApi.register(payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: keys.me });
    },
  });
};

export const useAdminLogout = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => adminAuthApi.logout(),
    onSuccess: async () => {
      await qc.removeQueries({ queryKey: keys.me });
    },
  });
};
