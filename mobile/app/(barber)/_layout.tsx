import { Tabs } from "expo-router";
import React from "react";
import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function BarberTabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs     
        initialRouteName="todayAppointments"
        screenOptions={{
            headerShown: false,
            tabBarStyle: {
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            paddingTop: 20,
            backgroundColor: Colors[colorScheme ?? "dark"].background,
            height: "auto",                 
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
                name="todayAppointments"
                options={{
                    title: 'Günün Randevuları',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="calendar.badge.clock" color={'#AD8C57'} />,
                }}
            /> 

            <Tabs.Screen 
                name="createBreak"
                options={{
                    title: 'Mola Oluştur',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="clock.fill" color={'#AD8C57'} />,
                }}
            /> 
            

            <Tabs.Screen 
                name="calendar"
                options={{
                    title: 'Randevularım',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="calendar" color={'#AD8C57'} />,
                }}
            /> 
            
            <Tabs.Screen 
                name="profile"
                options={{ title: 'Profil',
                    tabBarIcon: ({ color }) => <IconSymbol size={28} name="person.fill" color={'#AD8C57'} />
                }}
            />

            <Tabs.Screen 
                name="workingHour"
                options={{ href: null }}
            />
        </Tabs>
    )
}