import { Tabs } from 'expo-router';
import React from 'react';
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function CustomerTabLayout () {
    const colorScheme = useColorScheme();

    return (
        <Tabs
        screenOptions={{
            headerShown: false,
            tabBarStyle: {
                borderTopWidth: 0.2,
                borderTopColor: "rgba(209, 196, 178, 0.2)",
                paddingTop: 0,
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
                name="home"
                options={{
                    title: 'Ana Sayfa',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={'#D9C9A3'} />,
                }}
            />
            <Tabs.Screen
                name="create-appointments"
                options={{
                    title: "Randevu Oluştur",
                    tabBarIcon: ({ color }) => (
                    <IconSymbol
                        style={{ transform: [{ rotate: "270deg" }], marginBottom: 0 }}
                        size={32}
                        name="scissors"
                        color="#D9C9A3"
                    />
                    ),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{ href: null }}
            />
            <Tabs.Screen
                name="change-password"
                options={{ href: null }}
            />
            
            <Tabs.Screen
                name="appointments"
                options={{
                    title: 'Randevularım',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="comb.fill" color={'#D9C9A3'} />,
                }}
            />
        </Tabs>
    );
}
