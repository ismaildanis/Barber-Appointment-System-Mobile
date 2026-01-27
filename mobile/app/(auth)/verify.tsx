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
import { useRouter, useLocalSearchParams } from "expo-router";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useVerifyReset } from "@/src/hooks/useUnifiedAuth";
import { LinearGradient } from "expo-linear-gradient";

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
  const { email } = useLocalSearchParams<{ email?: string }>();
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
      if (!email) {
        Alert.alert("Uyarı", "Lütfen önce e-posta ile kod isteyin.");
        return;
      }
    verifyReset.mutate({...values, email: email as string}, {
      onSuccess: (data: VerifyResponse) => {
        if (!data?.resetSessionId) {
          Alert.alert("Hata", "Kod giriş hatası.");
          return;
        }
        router.replace({
          pathname: "/reset",
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
        headerBackgroundColor={{ light: "#121212", dark: "#121212" }}
        headerImage={
          <LinearGradient
            colors={["#E4D2AC", "#AD8C57"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <Image source={require("@/assets/logo/logoForeground.png")} style={styles.logo} />
          </LinearGradient>
        }
      >
        <View style={styles.container}>
          <Text style={styles.title}>Gönderilen 6 Haneli Kodu Girin</Text>
          {email && <Text style={styles.subtitle}>Email: {email}</Text>}
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
    backgroundColor: "#E4D2AC",
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
    marginBottom: 16,
  },
  primaryText: { color: "#1e1e1e", fontSize: 16, fontWeight: "bold" },
  link: { color: "#E4D2AC", fontSize: 16, fontWeight: "bold" },
  subtitle: { color: "#ccc", fontSize: 14, textAlign: "center", marginBottom: 8 },

});
