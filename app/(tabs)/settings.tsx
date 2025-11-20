import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Linking, Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { useKeyboardLayout } from '@/contexts/keyboard-layout-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
  keyboardLayoutOptions,
  type KeyboardLayoutId,
} from '@/lib/keyboard-layouts';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];
  const { layoutId, includePunctuation, setLayoutId, setIncludePunctuation, isReady } =
    useKeyboardLayout();
  const mutedText = colorScheme === 'dark' ? '#a1a1aa' : '#4b5563';
  const surface = colorScheme === 'dark' ? '#1f2937' : '#f3f4f6';
  const borderColor = colorScheme === 'dark' ? 'rgba(255,255,255,0.12)' : 'rgba(15,23,42,0.12)';
  const selectedBackground =
    colorScheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(10,126,164,0.08)';
  const handleEmailPress = () => {
    Linking.openURL('mailto:tom@harmon.tech');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: palette.background }]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open menu"
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            style={({ pressed }) => [
              styles.menuButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <MaterialCommunityIcons name="menu" size={28} color={palette.text} />
          </Pressable>
        </View>
        <Text style={[styles.heading, { color: palette.text }]}>Settings</Text>

        <View style={[styles.card, { backgroundColor: surface, borderColor }]}>
          <Text style={[styles.cardTitle, { color: palette.text }]}>Keyboard layout</Text>
          <Text style={[styles.cardSubtitle, { color: mutedText }]}>
            Choose how letters are arranged when you type.
          </Text>

          <View style={styles.optionGroup}>
            {keyboardLayoutOptions.map((option) => {
              const selected = layoutId === option.id;
              return (
                <Pressable
                  key={option.id}
                  accessibilityRole='button'
                  accessibilityLabel={`Switch to ${option.label} layout`}
                  accessibilityState={{ selected }}
                  onPress={() => setLayoutId(option.id as KeyboardLayoutId)}
                  disabled={!isReady}
                  style={({ pressed }) => [
                    styles.optionButton,
                    {
                      borderColor: selected ? palette.tint : borderColor,
                      backgroundColor: selected ? selectedBackground : surface,
                    },
                    pressed && styles.pressed,
                  ]}
                >
                  <View>
                    <Text style={[styles.optionLabel, { color: palette.text }]}>
                      {option.label}
                    </Text>
                    {option.description ? (
                      <Text style={[styles.optionDescription, { color: mutedText }]}>
                        {option.description}
                      </Text>
                    ) : null}
                  </View>
                  {selected ? (
                    <MaterialCommunityIcons name='check-circle' size={24} color={palette.tint} />
                  ) : (
                    <View style={styles.optionIndicator} />
                  )}
                </Pressable>
              );
            })}
          </View>

          <View style={styles.toggleRow}>
            <View style={styles.toggleTextContainer}>
              <Text style={[styles.optionLabel, { color: palette.text }]}>Include punctuation</Text>
              <Text style={[styles.optionDescription, { color: mutedText }]}>
                Adds , ! ? . keys to the keyboard layout.
              </Text>
            </View>
            <Switch
              accessibilityRole='switch'
              accessibilityLabel='Include punctuation keys'
              value={includePunctuation}
              onValueChange={setIncludePunctuation}
              disabled={!isReady}
              trackColor={{
                false: borderColor,
                true: palette.tint,
              }}
              thumbColor={includePunctuation ? '#ffffff' : '#d4d4d8'}
              ios_backgroundColor={borderColor}
              style={styles.toggleSwitch}
            />
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: surface, borderColor }]}>
          <Text style={[styles.cardTitle, { color: palette.text }]}>Bug reports & feedback</Text>
          <Text style={[styles.cardSubtitle, { color: mutedText }]}>
            Encountering a bug or have a feature request? We&apos;d love to hear from you!
          </Text>
          <Text style={[styles.feedbackDescription, { color: mutedText }]}>
            Please contact us by emailing tom@harmon.tech
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Send email to tom@harmon.tech"
            onPress={handleEmailPress}
            style={({ pressed }) => [
              styles.emailButton,
              {
                backgroundColor: palette.tint,
                opacity: pressed ? 0.7 : 1,
              },
            ]}
          >
            <MaterialCommunityIcons name="email-outline" size={18} color="#fff" />
            <Text style={styles.emailButtonText}>tom@harmon.tech</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuButton: {
    height: 44,
    width: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 32,
    fontWeight: '700',
  },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  cardSubtitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  optionGroup: {
    gap: 10,
  },
  optionButton: {
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  optionDescription: {
    fontSize: 14,
    marginTop: 2,
  },
  feedbackDescription: {
    fontSize: 14,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  toggleTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  toggleSwitch: {
    transform: [{ scale: 0.92 }],
  },
  optionIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d4d4d8',
  },
  pressed: {
    opacity: 0.7,
  },
  emailButton: {
    marginTop: 8,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'center',
    width: '60%',
    justifyContent: 'center',
  },
  emailButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

