import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { barberAuthApi } from '../api/barberAuthApi'
import {
  Barber,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "../types/barberAuth";

const keys = {
    me : ['barber', 'me'] as const,
}

export const useBarberMe = () => 
    useQuery<Barber>({
        queryKey: keys.me,
        queryFn: () => barberAuthApi.me(),
        staleTime: 5 * 60 * 1000
    });

export const useBarberLogin = () => {
    const qc = useQueryClient();

    return useMutation<LoginResponse, Error, LoginRequest>({
        mutationFn: (payload) => barberAuthApi.login(payload),
        onSuccess: async () => {
            await qc.invalidateQueries({ queryKey: keys.me })
        }
    })
}

export const useBarberRegister = () => {
  const qc = useQueryClient();
  return useMutation<RegisterResponse, Error, RegisterRequest>({
    mutationFn: (payload) => barberAuthApi.register(payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: keys.me });
    },
  });
};

export const useBarberLogout = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => barberAuthApi.logout(),
    onSuccess: async () => {
      await qc.removeQueries({ queryKey: keys.me });
    },
  });
};
