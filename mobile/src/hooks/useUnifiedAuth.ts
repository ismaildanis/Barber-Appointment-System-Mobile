import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { unifiedAuthApi } from "../api/unifiedAuthApi";
import { useEffect } from "react";

const keyMe = ["unified", "me"] as const;
export const useUnifiedMe = () => {
  const router = useRouter();
  const query = useQuery({
    queryKey: keyMe,
    queryFn: () => unifiedAuthApi.me(),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  useEffect(() => {
    if (
      query.isError &&
      axios.isAxiosError(query.error) &&
      query.error.response?.status === 401
    ) {
      AsyncStorage.multiRemove(["unified_access", "unified_refresh"]).finally(() => {
        router.replace("/(auth)/login");
      });
    }
  }, [query.isError, query.error, router]);

  return query;
};


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
