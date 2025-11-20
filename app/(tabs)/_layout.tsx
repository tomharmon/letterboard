import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';


export default function TabLayout() {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];

  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: palette.background,
          width: '20%',
        },
        drawerActiveBackgroundColor: palette.tint,
        drawerActiveTintColor: palette.background,
        drawerInactiveTintColor: palette.text,
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: 'Spelling Board',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="alphabetical-variant" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="choice-board"
        options={{
          title: 'Choice board',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="checkbox-multiple-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="emoji-board"
        options={{
          title: 'Emoji board',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="emoticon-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="settings"
        options={{
          title: 'Settings',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog-outline" color={color} size={size} />
          ),
        }}
      />
      <Drawer.Screen
        name="help"
        options={{
          title: 'Help',
          drawerIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="help-circle-outline" color={color} size={size} />
          ),
        }}
      />
    </Drawer>
  );
}

