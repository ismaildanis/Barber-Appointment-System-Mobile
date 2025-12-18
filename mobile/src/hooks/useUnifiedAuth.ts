import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChangePassword, unifiedAuthApi } from "../api/unifiedAuthApi";
import { useEffect } from "react";
import { RegisterRequest } from "../types/customerAuth";
import * as Notifications from "expo-notifications";

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
      await qc.clear();
      await qc.invalidateQueries({ queryKey: keyMe });
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: (payload: RegisterRequest) =>
      unifiedAuthApi.register(payload),
  });
};

export const useUnifiedLogout = () => {
  const qc = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: () => unifiedAuthApi.logout(),
    onSuccess: async () => {
      await AsyncStorage.multiRemove(["unified_access", "unified_refresh"]);
      await qc.clear();
      await qc.removeQueries({ queryKey: keyMe });
      router.replace("/(auth)/login");
    },
  });
};

export const useForgotPassword = () => 
  useMutation({
    mutationFn: (email: string) => unifiedAuthApi.forgot(email),
  });

export const useVerifyReset = () => 
  useMutation({
    mutationFn: (data: { email: string; code: string; }) => unifiedAuthApi.verifyReset(data),
  });

export const useResetPassword = () => 
  useMutation({
    mutationFn: (data: { resetSessionId: string; newPassword: string; }) => unifiedAuthApi.resetPassword(data),
  });


export const useChangePassword = () => 
  useMutation({
    mutationFn: (data: ChangePassword) => unifiedAuthApi.changePassword(data),
  });


export const useRegisterNotification = () => 
  useMutation({
    mutationFn: async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") throw new Error("Bildirim izni verilmedi");
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      return unifiedAuthApi.registerNotification(token);
    }
  });
