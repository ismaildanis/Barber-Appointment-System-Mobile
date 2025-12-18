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
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useResetPassword } from "@/src/hooks/useUnifiedAuth";

const resetSchema = z
  .object({
    newPassword: z.string().min(8, "En az 8 karakter"),
    confirm: z.string(),
  })
  .refine((d) => d.newPassword === d.confirm, {
    message: "Şifreler aynı olmalı",
    path: ["confirm"],
  });

type ResetSchema = z.infer<typeof resetSchema>;

export default function Reset() {
  const router = useRouter();
  const params = useLocalSearchParams<{ token?: string }>();
  const resetPassword = useResetPassword();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetSchema>({
    resolver: zodResolver(resetSchema),
    defaultValues: { newPassword: "", confirm: "" },
  });

  const onSubmit = handleSubmit((values) => {
    if (!params.token) return;
    resetPassword.mutate(
      { resetSessionId: params.token, newPassword: values.newPassword },
      {
        onSuccess: () => {
            Alert.alert("Başarılı", "Şifreniz yenilenmiştir.");
            router.replace("/login")
        },
        onError: (err: any) => {
          Alert.alert("Hata", err?.response?.data?.message || "Şifre yenileme basarısız.");
        },
      }
    );
  });

  const apiError = (resetPassword.error as any)?.response?.data?.message;
  const zodPassError = errors.newPassword?.message;
  const zodConfirmError = errors.confirm?.message;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#AD8C57", dark: "#AD8C57" }}
        headerImage={<Image source={require("@/assets/logo/a.png")} style={styles.logo} />}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Yeni Şifre Belirle</Text>

          {apiError && <Text style={styles.error}>{apiError}</Text>}
          {zodPassError && <Text style={styles.error}>{zodPassError}</Text>}
          {zodConfirmError && <Text style={styles.error}>{zodConfirmError}</Text>}

          <Controller
            control={control}
            name="newPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Yeni şifre"
                placeholderTextColor="#4e4e4e"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry
                autoCapitalize="none"
              />
            )}
          />

          <Controller
            control={control}
            name="confirm"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Yeni şifre (tekrar)"
                placeholderTextColor="#4e4e4e"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry
                autoCapitalize="none"
              />
            )}
          />

          <View style={styles.actions}>
            <TouchableOpacity onPress={onSubmit} style={styles.primaryBtn} disabled={resetPassword.isPending}>
              <Text style={styles.primaryText}>
                {resetPassword.isPending ? "Kaydediliyor..." : "Şifreyi Güncelle"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.replace("/login")} activeOpacity={0.7}>
              <Text style={styles.link}>Giriş ekranına dön</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ParallaxScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, gap: 18 },
  logo: { width: "100%", height: "100%", resizeMode: "contain" },
  title: { fontSize: 26, fontWeight: "800", color: "#fff", alignSelf: "center", marginBottom: 8 },
  error: { color: "#ff4d4f" },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#1f1f1f",
    fontSize: 16,
    color: "#fff",
  },
  actions: { alignItems: "center", gap: 16, marginTop: 12 },
  primaryBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: "#AD8C57",
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 16,
  },
  primaryText: { color: "#1e1e1e", fontSize: 16, fontWeight: "bold" },
  link: { color: "#AD8C57", fontSize: 16, fontWeight: "bold" },
});
