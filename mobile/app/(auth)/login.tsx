import {
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Button,
} from "react-native";
import { Image } from "expo-image";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { useUnifiedLogin } from "@/src/hooks/useUnifiedAuth";
import { loginSchema, type LoginSchema } from "@/src/schemas/auth";

export default function LoginScreen() {
  const router = useRouter();
  const login = useUnifiedLogin();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = handleSubmit((values) => {
    login.mutate(values, {
      onSuccess: (data) => {
        if (data.role === "customer") router.replace("/(customer)/home");
        else if (data.role === "barber") router.replace("/(barber)/todayAppointments");
        else router.replace("/(admin)/dashboard");
      }
    });
  });
  const handleZodError = errors.email ? errors.email.message : errors.password?.message;
  const apiError = (login.error as any)?.response?.data?.message;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
        headerImage={
          <Image
            source={require("@/assets/images/partial-react-logo.png")}
            style={styles.reactLogo}
          />
        }
      >
        <ThemedView style={styles.container}>
          <ThemedText style={styles.title}>Giriş Yap</ThemedText>

          {apiError && <ThemedText>{apiError}</ThemedText>}
          {handleZodError && <ThemedText style={{ color: "red" }} >{handleZodError} </ThemedText>}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={'#000'}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
              />
            )}
          />
          

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Sifre"
                placeholderTextColor={'#000'}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="password"
              />
            )}
          />
         

          <ThemedView style={{ width: "90%" }}>
            <Button
              title={login.isPending ? "Giriş yapılıyor..." : "Giriş Yap"}
              onPress={onSubmit}
              disabled={login.isPending}
            />
          </ThemedView>
        </ThemedView>
      </ParallaxScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    gap: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  input: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 14,
    borderRadius: 10,
    backgroundColor: "white",
    fontSize: 16,
  },
});
