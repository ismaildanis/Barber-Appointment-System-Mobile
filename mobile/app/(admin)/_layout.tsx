import { Drawer } from "expo-router/drawer";

export default function AdminLayout() {
  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerPosition: "right",
        drawerType: "front",
        drawerStyle: { width: "60%", backgroundColor: "#121212" },
        overlayColor: "rgba(0,0,0,0.35)",
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name="dashboard"
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name="drawer"
        options={{
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
            title: "Profil",
        }}
      />
     
    </Drawer>
  );
}
