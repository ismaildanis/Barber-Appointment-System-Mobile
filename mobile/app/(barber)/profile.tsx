import { useUnifiedLogout } from "@/src/hooks/useUnifiedAuth";
import { useRouter } from "expo-router";
import { View, Text, TouchableOpacity } from "react-native";

export default function BarberProfile() {
  const logout = useUnifiedLogout();

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", color: "white" }}>BarberProfile</Text>
      <TouchableOpacity
        onPress={() => logout.mutate(undefined)}
        style={{ backgroundColor: "red", padding: 10, borderRadius: 5 }}
        disabled={logout.isPending}
      >
        <Text style={{ color: "white" }}>
          {logout.isPending ? "Çıkış yapılıyor..." : "Çıkış Yap"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
