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
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { useForgotPassword } from "@/src/hooks/useUnifiedAuth";
import { z } from "zod";
import { LinearGradient } from "expo-linear-gradient";

const forgotSchema = z.object({ email: z.string().email("Geçerli email girin") });
type ForgotSchema = z.infer<typeof forgotSchema>;

export default function Forgot() {
  const router = useRouter();
  const forgot = useForgotPassword();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotSchema>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = handleSubmit((values) => {
    forgot.mutate(values.email, {
      onSuccess: () => router.replace({ pathname: "/verify", params: { email: values.email } }),
      onError: (err: any) => console.log(err),
    });
  });

  const apiError = (forgot.error as any)?.response?.data?.message;
  const handleZodError = errors.email?.message;

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
          <View style={styles.formWrapper}>
            <Text style={styles.title}>Şifremi Unuttum</Text>

            {apiError && <Text style={styles.error}>{apiError}</Text>}
            {handleZodError && <Text style={styles.error}>{handleZodError}</Text>}

            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="#4e4e4e"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                />
              )}
            />

            <View style={styles.actions}>
              <TouchableOpacity onPress={onSubmit} style={styles.primaryBtn} disabled={forgot.isPending}>
                <Text style={styles.primaryText}>
                  {forgot.isPending ? "Gönderiliyor..." : "Kod Gönder"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.replace("/login")} activeOpacity={0.7}>
                <Text style={styles.link}>Giriş ekranına dön</Text>
              </TouchableOpacity>
            </View>
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
  formWrapper: {
    width: "100%",
    alignSelf: "center",
    maxWidth: 420,
    gap: 12,
  },
});
