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
import { useRootNavigation, useRouter } from "expo-router";
import ParallaxScrollView from "@/components/parallax-scroll-view";
import { useUnifiedLogin, useRegisterNotification } from "@/src/hooks/useUnifiedAuth";
import { loginSchema, type LoginSchema } from "@/src/schemas/auth";
import { CommonActions } from "@react-navigation/native";
export default function LoginScreen() {
  const router = useRouter();
  const notifyRegister = useRegisterNotification();
  const login = useUnifiedLogin();
  const rootNav = useRootNavigation();
  
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });
  const resetToCustomer = () => {
    rootNav?.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { name: "(customer)", state: { routes: [{ name: "home" }] } },
        ],
      })
    );
  };

  const resetToBarber = () => {
    rootNav?.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { name: "(barber)", state: { routes: [{ name: "todayAppointments" }] } },
        ],
      })
    );
  };

  const resetToAdmin = () => {
    rootNav?.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          { name: "(admin)", state: { routes: [{ name: "(tabs)" }, { name: "dashboard" }] } },
        ],
      })
    );
  };

  const onSubmit = handleSubmit((values) => {
    login.mutate(values, {
      onSuccess: (data) => {
        notifyRegister.mutate(undefined, { onError: (e) => console.log("push register err", e) });

        if (data.role === "customer") {
          resetToCustomer();
        } else if (data.role === "barber") {
          resetToBarber();
        } else {
          resetToAdmin();
        }
      },
    });
  });
  const handleZodError = errors.email ? errors.email.message : errors.password?.message;
  const apiError = (login.error as any)?.response?.data?.message;

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ParallaxScrollView
        headerBackgroundColor={{ light: "#AD8C57", dark: "#AD8C57" }}
        headerImage={
          <Image
            source={require("@/assets/logo/a.png")}
            style={styles.logo}
          />
        }
      >
        <View style={styles.container}>
          <Text style={styles.title}>Giriş Yap</Text>

          {handleZodError && <Text style={{ color: "red" }} >{handleZodError} </Text>}
          {apiError && <Text style={{ color: "red" }}>{apiError}</Text>}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={'#4e4e4e'}
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
                placeholderTextColor={'#4e4e4e'}
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
          <View style={{ flexDirection: "column", alignItems: "flex-end", justifyContent: "center" }}>
            <TouchableOpacity onPress={() => router.replace("/forgot")}> 
              <Text style={{ color: "#fff", fontSize: 16}}>Şifremi Unuttum</Text>
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "column", alignItems: "center", gap: 30, marginTop: 20 }}>
            <TouchableOpacity onPress={onSubmit} style={{ paddingVertical: 12, alignItems: "center", paddingHorizontal: 24, backgroundColor: "#AD8C57", borderRadius: 5}}>
                <Text style={{ color: "#1e1e1e", fontSize: 16, fontWeight: "bold" }}>{login.isPending ? "Giriş yapılıyor..." : "Giriş Yap"}</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.replace("/register")} activeOpacity={0.7}> 
              <Text style={{ color: "#AD8C57", fontSize: 16, fontWeight: "bold" }}> Hesabınız yok mu? Kayıt Ol</Text>
            </TouchableOpacity>

            

          </View>
        </View>
      </ParallaxScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 18,
  },
  header: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 32,
    paddingBottom: 24,
  },
  logo: {
    width: "100%",
    height: "100%",
    resizeMode: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
    alignSelf: "center",
    marginBottom: 16,
  },
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
});
