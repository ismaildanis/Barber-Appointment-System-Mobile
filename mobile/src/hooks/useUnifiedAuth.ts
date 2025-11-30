import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { unifiedAuthApi } from "../api/unifiedAuthApi";

const keyMe = ["unified", "me"] as const;

export const useUnifiedMe = () =>
  useQuery({
    queryKey: keyMe,
    queryFn: () => unifiedAuthApi.me(),
    staleTime: 5 * 60 * 1000,
  });

export const useUnifiedLogin = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { email: string; password: string }) =>
      unifiedAuthApi.login(payload),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: keyMe });
    },
  });
};

export const useUnifiedLogout = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => unifiedAuthApi.logout(),
    onSuccess: async () => {
      await qc.removeQueries({ queryKey: keyMe });
    },
  });
};
