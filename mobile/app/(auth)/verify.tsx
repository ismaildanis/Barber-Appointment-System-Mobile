import {
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useVerifyReset } from "@/src/hooks/useUnifiedAuth"; // verify-reset mutation
export type VerifyResponse = {
  resetSessionId: string;
  role: string;
}
const verifySchema = z.object({
  code: z
    .string()
    .length(6, "6 haneli kod girin")
    .regex(/^\d+$/, "Sadece rakam girin"),
});

type VerifySchema = z.infer<typeof verifySchema>;

export default function Verify() {
  const router = useRouter();
  const verifyReset = useVerifyReset();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifySchema>({
    resolver: zodResolver(verifySchema),
    defaultValues: { code: "" },
  });

  const onSubmit = handleSubmit((values) => {
    verifyReset.mutate(values, {
      onSuccess: (data: VerifyResponse) => {
        router.replace({
          pathname: "/(auth)/reset",
          params: { token: data.resetSessionId, role: data.role },
        });
      },
    });
  });

  const apiError = (verifyReset.error as any)?.response?.data?.message;
  const zodCodeError = errors.code?.message;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#AD8C57", dark: "#AD8C57" }}
        headerImage={<Image source={require("@/assets/logo/a.png")} style={styles.logo} />}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Gönderilen 6 Haneli Kodu Girin</Text>

          {apiError && <Text style={styles.error}>{apiError}</Text>}
          {zodCodeError && <Text style={styles.error}>{zodCodeError}</Text>}

          <Controller
            control={control}
            name="code"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="6 haneli kod"
                placeholderTextColor="#4e4e4e"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="number-pad"
                maxLength={6}
              />
            )}
          />

          <View style={styles.actions}>
            <TouchableOpacity onPress={onSubmit} style={styles.primaryBtn} disabled={verifyReset.isPending}>
              <Text style={styles.primaryText}>
                {verifyReset.isPending ? "Doğrulanıyor..." : "Doğrula"}
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
