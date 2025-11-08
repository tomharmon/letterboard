import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as Haptics from 'expo-haptics';
import { Tabs, usePathname, useRouter, type Href } from 'expo-router';
import React, { ComponentProps } from 'react';
import { Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
    key: 'explore',
    title: 'Explore',
    href: '/explore',
    icon: { family: 'material', name: 'send' },
  },
];

const COMPACT_BREAKPOINT = 768;
const COMPACT_WIDTH = 88;
const DEFAULT_WIDTH = 120;

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];
  const { width: windowWidth } = useWindowDimensions();
  const sidebarWidth = windowWidth < COMPACT_BREAKPOINT ? COMPACT_WIDTH : DEFAULT_WIDTH;

  return (
    <View style={styles.container}>
      <Sidebar width={sidebarWidth} />
      <View style={[styles.content, { backgroundColor: palette.background }]}>
        <Tabs
          screenOptions={{
            headerShown: false,
          }}
          tabBar={() => null}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
            }}
          />
          <Tabs.Screen
            name="explore"
            options={{
              title: 'Explore',
            }}
          />
        </Tabs>
      </View>
    </View>
  );
}

type SidebarProps = {
  width: number;
};

function Sidebar({ width }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];
  const insets = useSafeAreaInsets();
  const pressedBackground =
    colorScheme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)';

  return (
    <View
      style={[
        styles.sidebar,
        {
          width,
          paddingTop: insets.top + 16,
          paddingBottom: insets.bottom + 16,
          backgroundColor: palette.background,
          borderRightColor: palette.tabIconDefault,
        },
      ]}
    >
      {TAB_CONFIG.map((tab, index) => {
        const isFocused = isRouteActive(pathname as Href, tab.href);

        const handlePress = () => {
          if (isFocused) {
            return;
          }

          if (process.env.EXPO_OS === 'ios') {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }

          router.navigate(tab.href);
        };

        return (
          <Pressable
            key={tab.key}
            accessibilityRole="tab"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={handlePress}
            style={({ pressed }) => [
              styles.tabButton,
              index === TAB_CONFIG.length - 1 ? styles.lastTabButton : undefined,
              isFocused && { backgroundColor: palette.tint },
              !isFocused && pressed && { backgroundColor: pressedBackground },
            ]}
          >
            {tab.icon.family === 'community' ? (
              <MaterialCommunityIcons
                size={28}
                name={tab.icon.name}
                color={isFocused ? palette.background : palette.icon}
              />
            ) : (
              <MaterialIcons
                size={28}
                name={tab.icon.name}
                color={isFocused ? palette.background : palette.icon}
              />
            )}
            <Text
              style={[
                styles.label,
                { color: isFocused ? palette.background : palette.text },
              ]}
            >
              {tab.title}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function isRouteActive(pathname: Href, href: Href) {
  return pathname === href;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  content: {
    flex: 1,
  },
  sidebar: {
    borderRightWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 12,
    alignItems: 'stretch',
  },
  tabButton: {
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  lastTabButton: {
    marginBottom: 0,
  },
  label: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});
