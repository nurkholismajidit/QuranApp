import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
    screenOptions={({ route }) => ({
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: 
          route.name === 'index' // Sesuaikan nama rute sesuai kebutuhan
            ? { display: 'none' }
            : Platform.select({
                ios: { position: 'absolute' },
                default: {},
              }),
      })}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Surah',
          tabBarIcon: ({ color }) => <FontAwesome5 name="quran" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="juz"
        options={{
          title: 'Juz',
          tabBarIcon: ({ color }) => <FontAwesome6 name="book-quran" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="SunriseScreen"
        options={{
          title: 'Sunset',
          tabBarIcon: ({ color }) => <Ionicons name="partly-sunny-outline" size={24} color={color} />,
        }}
      />
       {/* <Tabs.Screen
        name="index"
        options={{
            title: 'Home',
            tabBarIcon: ({ color }) => ( <IconSymbol size={28} name="paperplane.fill" color={color} />
         ),
        // Menyembunyikan tab bar untuk screen ini
        tabBarButton: () => null,
        }}
      /> */}
    </Tabs>
  );
}
