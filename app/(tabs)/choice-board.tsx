import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Speech from 'expo-speech';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function ChoiceBoardScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];

  const handleCardPress = useCallback((choice: 'A' | 'B' | 'C') => {
    const textToSpeak = `choice ${choice}`;
    try {
      Speech.speak(textToSpeak);
    } catch (error) {
      console.error('Speech error:', error);
    }
  }, []);

  const screenBackground = colorScheme === 'dark' ? '#18181b' : '#f3f4f6';
  const cardBackground = colorScheme === 'dark' ? '#1f2937' : '#ffffff';
  const cardBorder = colorScheme === 'dark' ? '#374151' : '#e5e7eb';
  const cardText = palette.text;

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: screenBackground }]}
      edges={['top', 'left', 'right']}
    >
      <View style={[styles.header, { backgroundColor: screenBackground }]}>
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
      <View style={[styles.container, { backgroundColor: screenBackground }]}>
        <View style={styles.cardsContainer}>
          {(['A', 'B', 'C'] as const).map((choice) => (
            <Pressable
              key={choice}
              accessibilityRole="button"
              accessibilityLabel={`Choice ${choice}`}
              onPress={() => handleCardPress(choice)}
              style={({ pressed }) => [
                styles.card,
                {
                  backgroundColor: cardBackground,
                  borderColor: cardBorder,
                  opacity: pressed ? 0.8 : 1,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
            >
              <ThemedText
                style={[
                  styles.cardText,
                  {
                    color: cardText,
                    fontFamily: Fonts.rounded,
                  },
                ]}
              >
                {choice}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  menuButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    width: 48,
    borderRadius: 14,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  cardsContainer: {
    flexDirection: 'row',
    gap: 108,
    width: '100%',
    maxWidth: 700,
    justifyContent: 'center',
  },
  card: {
    flex: 1,
    aspectRatio: 1.5,
    borderRadius: 24,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 200,
    minHeight: 200,
    maxHeight: 350,
    padding: 20,
    overflow: 'visible',
  },
  cardText: {
    fontSize: 96,
    fontWeight: 'bold',
    lineHeight: 96,
    textAlign: 'center',
    includeFontPadding: true,
  },
});
