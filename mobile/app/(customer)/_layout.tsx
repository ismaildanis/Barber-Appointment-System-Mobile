import { Tabs } from 'expo-router';
import React from 'react';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { router } from "expo-router";

export default function CustomerTabLayout () {
    const colorScheme = useColorScheme();

    return (
        <Tabs
        screenOptions={{
            headerShown: false,
            tabBarStyle: {
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingTop: 20,
            backgroundColor: Colors[colorScheme ?? "light"].background,
            height: 100,                 
            position: "absolute",
            overflow: "hidden",             
            borderTopWidth: 0,             
            elevation: 0,                   
            },
            tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
            tabBarButton: HapticTab,
        }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: 'Ana Sayfa',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={'#AD8C57'} />,
                }}
            />
            <Tabs.Screen
                name="appointments"
                options={{
                    title: "Randevu Oluştur",
                    tabBarIcon: ({ color }) => (
                    <IconSymbol
                        style={{ transform: [{ rotate: "270deg" }], marginBottom: 28 }}
                        size={50}
                        name="scissors"
                        color="#AD8C57"
                    />
                    ),
                }}
                // listeners={{
                //     tabPress: (e) => {
                //     e.preventDefault(); // varsayılan tab navigation’ı durdur
                //     router.push("/(customer)/appointments/select-barber"); // direkt seçim ekranına git
                //     },
                // }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Randevularım',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="comb.fill" color={'#AD8C57'} />,
                }}
            />
        </Tabs>
    );
}
