import { Tabs } from "expo-router";
import React from "react";
import { HapticTab } from "@/components/haptic-tab";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function BarberTabLayout() {
  const colorScheme = useColorScheme();

  const TabIcon = ({
    iosName,
    androidName,
    size = 28,
    color = "#E4D2AC",
  }: {
    iosName: any;
    androidName: any;
    size?: number;
    color?: string;
  }) =>
    Platform.OS === "ios" ? (
      <IconSymbol size={size} name={iosName} color={color} />
    ) : (
      <Ionicons size={size} name={androidName} color={color} />
    );

  return (
    <Tabs
      initialRouteName="todayAppointments"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          paddingTop: 20,
          borderTopWidth: 0.2,
            borderTopColor: "rgba(209, 196, 178, 0.2)",
          backgroundColor: Colors[colorScheme ?? "dark"].background,
          height: "auto",
          position: "absolute",
          overflow: "hidden",
          elevation: 0,
        },
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="todayAppointments"
        options={{
          title: "Günün Randevuları",
          tabBarIcon: () => (
            <TabIcon iosName="calendar.badge.clock" androidName="calendar" />
          ),
        }}
      />

      <Tabs.Screen
        name="createBreak"
        options={{
          title: "Mola Oluştur",
          tabBarIcon: () => <TabIcon iosName="clock.fill" androidName="time" />,
        }}
      />

      <Tabs.Screen
        name="calendar"
        options={{
          title: "Randevularım",
          tabBarIcon: () => <TabIcon iosName="calendar" androidName="calendar" />,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: () => <TabIcon iosName="person.fill" androidName="person" />,
        }}
      />

      <Tabs.Screen name="workingHour" options={{ href: null }} />
      <Tabs.Screen name="breaks" options={{ href: null }} />
      <Tabs.Screen name="change-password-barber" options={{ href: null }} />
    </Tabs>
  );
}
