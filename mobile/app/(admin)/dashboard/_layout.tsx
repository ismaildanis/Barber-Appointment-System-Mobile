import { Drawer } from "expo-router/drawer";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

function DashboardStack() {
  return (
    <Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="[id]" options={{ presentation: "card" }} />
    </Stack>
  );
}

export default function DashboardLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerPosition: "right",   // 👉 SAĞDAN AÇILMASI (aşağıda detay var)
      }}
    >
      {/* Dashboard (Stack) */}
      <Drawer.Screen
        name="index"
        options={{
          title: "Dashboard",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="speedometer" size={size} color={color} />
          ),
        }}
      />

      {/* Diğer admin sayfaları */}
      <Drawer.Screen
        name="../barbers"
        options={{
          title: "Barbers",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="cut" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="../reports"
        options={{
          title: "Reports",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="bar-chart" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="profile"
        options={{
          title: "Profile",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
       <Drawer.Screen
          name="[id]"
          options={{
            drawerItemStyle: { display: "none" },
          }}
        />

    </Drawer>
  );
}
