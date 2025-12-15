import { Drawer } from "expo-router/drawer";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from "@react-navigation/drawer";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const insets = useSafeAreaInsets();

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={{
        paddingTop: insets.top + 12,
        paddingBottom: insets.bottom + 12,
        backgroundColor: "#121212",
      }}
    >
      <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "800" }}>Menü</Text>
        <Text style={{ color: "rgba(255,255,255,0.7)" }}>Yönetici paneli</Text>
      </View>

      <DrawerItem
        label="Profil"
        icon={({ color, size }) => <Ionicons name="person" color={color} size={size} />}
        labelStyle={{ color: "#121212", fontWeight: "700" }}
        style={{ backgroundColor: "#AD8C57", borderRadius: 12, marginHorizontal: 12 }}
        onPress={() => props.navigation.navigate("profile")}
      />
      <DrawerItem
        label="Tatil Günleri"
        icon={({ color, size }) => <Ionicons name="calendar" color={color} size={size} />}
        labelStyle={{ color: "rgba(255,255,255,0.8)", fontWeight: "600" }}
        style={{ marginHorizontal: 12, borderRadius: 12 }}
        inactiveTintColor="rgba(255,255,255,0.8)"
        activeBackgroundColor="#AD8C57"
        activeTintColor="#121212"
        onPress={() => props.navigation.navigate("holiday")}
      />

      <View
        style={{
          height: 1,
          backgroundColor: "rgba(255,255,255,0.1)",
          margin: 16,
        }}
      />

<TouchableOpacity
  onPress={() => props.navigation.navigate("(tabs)", { screen: "dashboard" })}
  style={{
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.08)",
  }}
>
  <Ionicons name="home" size={20} color="#AD8C57" />
  <Text style={{ color: "#fff", fontWeight: "700" }}>Dashboard</Text>
</TouchableOpacity>
    </DrawerContentScrollView>
  );
}

export default function AdminLayout() {
  return (
    <Drawer
      initialRouteName="(tabs)"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerPosition: "right",
        drawerType: "front",
        drawerStyle: { width: "70%", backgroundColor: "#121212" },
        overlayColor: "rgba(0,0,0,0.35)",
      }}
    >
  <Drawer.Screen name="(tabs)" options={{ drawerItemStyle: { display: "none" } }} />
  <Drawer.Screen name="profile" options={{ title: "Profil" }} />
  <Drawer.Screen name="holiday" options={{ title: "Tatil Günleri" }} />
    </Drawer>
  );
}
