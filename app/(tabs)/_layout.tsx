import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Drawer } from 'expo-router/drawer';
import React, { ComponentProps } from 'react';
import { StyleSheet } from 'react-native';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type TabIcon =
  | {
      family: 'material';
      name: ComponentProps<typeof MaterialIcons>['name'];
    }
  | {
      family: 'community';
      name: ComponentProps<typeof MaterialCommunityIcons>['name'];
    };

type TabConfig = {
  key: string;
  title: string;
  href: Href;
  icon: TabIcon;
};

const TAB_CONFIG: readonly TabConfig[] = [
  {
    key: 'home',
    title: 'Home',
    href: '/',
    icon: { family: 'community', name: 'alphabetical-variant' },
  },
  {
    key: 'choice-board',
    title: 'Choice board',
    href: '/choice-board',
    icon: { family: 'community', name: 'checkbox-multiple-outline' },
  },
  {
    key: 'emoji-board',
    title: 'Emoji board',
    href: '/emoji-board',
    icon: { family: 'community', name: 'emoticon-outline' },
  },
  {
    key: 'settings',
    title: 'Settings',
    href: '/settings',
    icon: { family: 'community', name: 'cog-outline' },
  },
  {
    key: 'help',
    title: 'Help',
    href: '/help',
    icon: { family: 'community', name: 'help-circle-outline' },
  },
];

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];

  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: palette.background,
        },
        drawerActiveBackgroundColor: palette.tint,
        drawerActiveTintColor: palette.background,
        drawerInactiveTintColor: palette.text,
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: 'Home',
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

const styles = StyleSheet.create({
  // Drawer-specific styles can be added here if needed in future
});
