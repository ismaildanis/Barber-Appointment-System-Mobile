import { StyleSheet, useWindowDimensions, View, Text, Button } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { myColors } from "@/constants/theme";
import { Customer } from "@/src/types/customerAuth";
import OwnerLogo from "@/components/customer/OwnerLogo";
import Logo from "../../assets/logo/a.svg";
import { success } from "zod";
import { useRouter } from "expo-router";

type ShopHeaderProps = {
  customer: Customer;
  logout: () => void;
};

export default function ShopHeader({ customer, logout }: ShopHeaderProps) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const padH = Math.min(Math.max(width * 0.05, 16));
  const padV = padH * 0.7;
  const headerHeight = Math.min(Math.max(width * 0.28, 80), 250);
  const subtitleSize = Math.min(Math.max(width * 0.04, 12), 14);
  const initials = `${customer.firstName?.[0] ?? "B"}${customer.lastName?.[0] ?? ""}`.toUpperCase();
  const onSubmit = () => {
    logout;
    router.replace("/(auth)/login");  
  }
  return (
    <ThemedView style={[styles.wrapper, { height: headerHeight }]}>
      <ThemedView
        style={[
          styles.container,
          {
            paddingHorizontal: padH,
            paddingVertical: padV,
          },
        ]}
      >
          <View style={styles.left}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
              <View style={{ gap: 0 }}>
                <ThemedText style={[styles.name, { fontSize: subtitleSize + 3 }]}>
                  {customer.firstName} {customer.lastName}
                </ThemedText>
                <ThemedText style={[styles.email, { fontSize: subtitleSize }]}>{customer.email}</ThemedText>
              </View>
              <View style={{ flex: 1, alignItems: "flex-end" }}>
                <Button title="Cıkıs Yap" onPress={onSubmit}  />
              </View>
            </View>
          </View>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  wrapper: { backgroundColor: "transparent", overflow: "hidden" },
  container: { 
    flex: 1, 
    flexDirection: "column", 
    backgroundColor: "transparent", 
    justifyContent:"center", 
    borderBottomColor: '#E4D2AC', 
    borderBottomWidth: 2, 
    shadowOpacity: 0.45,
  },
  logoRow: { alignItems: "center", justifyContent: "center"},
  left: { flexDirection: "row", alignItems: "center", gap: 10 },
  name: { fontWeight: "600", color: "#fff" },
  email: { color: "#c0c2bdff", fontWeight: "500" },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 28,
    backgroundColor: "#CFB080",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#1A1A1A", fontWeight: "800", fontSize: 18 },
});
