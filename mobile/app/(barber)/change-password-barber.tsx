import React, { useCallback, useEffect } from "react";
import {
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  View,
  TouchableOpacity,
  Text,
  Alert,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useChangePassword } from "@/src/hooks/useUnifiedAuth";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const schema = z
  .object({
    oldPassword: z.string().min(6, "Mevcut şifre en az 6 karakter"),
    newPassword: z.string().min(8, "Yeni şifre en az 8 karakter"),
    confirm: z.string(),
  })
  .refine((d) => d.newPassword === d.confirm, {
    message: "Şifreler aynı olmalı",
    path: ["confirm"],
  });

type FormValues = z.infer<typeof schema>;

export default function ChangePasswordBarber() {
  const router = useRouter();
  const changePassword = useChangePassword();
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { oldPassword: "", newPassword: "", confirm: "" },
  });

  const apiError = (changePassword.error as any)?.response?.data?.message;

  const onSubmit = handleSubmit(({ oldPassword, newPassword }) => {
    changePassword.mutate(
      { oldPassword, newPassword },
      {
        onSuccess: () => {
            reset();
            Alert.alert("Başarılı", "Şifre güncellendi. Lütfen Tekrar Giriş Yapınız", [
                { text: "Tamam", onPress: () => router.replace("/(auth)/login") },
            ]);
        },
      }
    );
  });

    const onBack = () => {
        changePassword.reset();
        reset(); 
        router.replace("/(barber)/profile");
    }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <SafeAreaView style={styles.screen}>
        <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={onBack}>
                <Ionicons name="arrow-back" size={20} color="#fff" />
            </TouchableOpacity>
        </View>
        
        <View style={styles.container}>
            
            <Text style={styles.title}>Şifre Değiştir</Text>

            {apiError && <Text style={styles.error}>{apiError}</Text>}
            {Object.values(errors).map((e, i) => e?.message && (
            <Text key={i} style={styles.error}>{e.message}</Text>
            ))}

            {[
            { name: "oldPassword", label: "Mevcut Şifre", secure: true },
            { name: "newPassword", label: "Yeni Şifre", secure: true },
            { name: "confirm", label: "Yeni Şifre (Tekrar)", secure: true },
            ].map((field) => (
            <Controller
                key={field.name}
                control={control}
                name={field.name as keyof FormValues}
                render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                    style={styles.input}
                    placeholder={field.label}
                    placeholderTextColor="#4e4e4e"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry={field.secure}
                    autoCapitalize="none"
                />
                )}
            />
            ))}

            <TouchableOpacity onPress={onSubmit} style={styles.primaryBtn} disabled={changePassword.isPending}>
            <Text style={styles.primaryText}>
                {changePassword.isPending ? "Gönderiliyor..." : "Kaydet"}
            </Text>
            </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

    screen: { flex: 1, backgroundColor: "#0f0f0f", padding: 16 },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    title: { fontSize: 24, fontWeight: "800", color: "#fff" },
    backBtn: {
        padding: 12,
        borderRadius: 18,
        backgroundColor: "rgba(255,255,255,0.08)",
        alignItems: "center",
        justifyContent: "center",
    },
    container: { flexDirection: "column", padding: 24, gap: 14, justifyContent: "center", alignItems: "center" },

    input: {
        width: "90%",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
        padding: 14,
        borderRadius: 12,
        backgroundColor: "#1f1f1f",
        fontSize: 16,
        color: "#fff",
    },
    primaryBtn: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        backgroundColor: "#AD8C57",
        borderRadius: 10,
        width: "90%",
        alignItems: "center",
        marginTop: 12,
    },
    error: { color: "#ff4d4f" },
    primaryText: { color: "#1e1e1e", fontSize: 16, fontWeight: "bold" },
});
