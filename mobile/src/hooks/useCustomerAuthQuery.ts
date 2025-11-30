import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { customerAuthApi } from '../api/customerAuthApi'
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  Customer,
} from "../types/customerAuth";

const keys = {
    me : ['customer', 'me'] as const,
}

export const useCustomerMe = () => 
    useQuery<Customer>({
        queryKey: keys.me,
        queryFn: () => customerAuthApi.me(),
        staleTime: 5 * 60 * 1000
    });

export const useCustomerLogin = () => {
    const qc = useQueryClient();

    return useMutation<LoginResponse, Error, LoginRequest>({
        mutationFn: (payload) => customerAuthApi.login(payload),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: keys.me })
        }
    })
}

export const useCustomerRegister = () => {
  const qc = useQueryClient();
  return useMutation<RegisterResponse, Error, RegisterRequest>({
    mutationFn: (payload) => customerAuthApi.register(payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: keys.me });
    },
  });
};

export const useCustomerLogout = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => customerAuthApi.logout(),
    onSuccess: async () => {
      await qc.removeQueries({ queryKey: keys.me });
    },
  });
};


