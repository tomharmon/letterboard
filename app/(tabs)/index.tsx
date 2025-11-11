import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useCallback, useMemo, useState, type ComponentProps } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const COLUMNS = 6;

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];
  const [text, setText] = useState('');

  const letterRows = useMemo(() => {
    // Desired layout:
    // - 6 columns total
    // - Rows 1–5 only: fill columns 1–5 with A–Y, column 6 empty except for Z
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    const rows: Array<Array<string | null>> = Array.from({ length: 5 }, () =>
      Array(COLUMNS).fill(null),
    );

    let index = 0;
    for (let r = 0; r < rows.length; r++) {
      for (let c = 0; c < 5; c++) {
        rows[r][c] = alphabet[index++];
      }
      // rows[r][5] remains null to create the empty vertical column
    }
    // Place Z at the end of the fifth row (move up one row)
    rows[4][5] = alphabet[index] ?? null;

    return rows;
  }, []);

  const words = useMemo(() => {
    if (!text.trim()) {
      return [];
    }

    return text.split(' ');
  }, [text]);

  const handleLetterClick = useCallback((letter: string) => {
    setText((prev) => prev + letter);
  }, []);

  const handleBackspace = useCallback(() => {
    setText((prev) => prev.slice(0, -1));
  }, []);

  const handleClear = useCallback(() => {
    setText('');
  }, []);

  const handleSpeak = useCallback(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text || 'Nothing to say yet');
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      return;
    }

    Alert.alert('Speech unavailable', 'Speech playback is only supported on web right now.');
  }, [text]);

  const mutedText = colorScheme === 'dark' ? '#d4d4d8' : '#6b7280';
  const neutralSurface = colorScheme === 'dark' ? '#1f2937' : '#f3f4f6';
  const destructiveSurface = colorScheme === 'dark' ? '#4b5563' : '#4b5563';
  const destructiveIcon = '#ffffff';
  const dividerColor = colorScheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)';
  const keyboardBackground = '#18181b';
  const keyDefault = '#27272a';
  const keyPressed = '#3f3f46';

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: colorScheme === 'dark' ? '#111827' : '#f3f4f6' },
      ]}
      edges={['top', 'left', 'right']}
    >
      <View style={styles.container}>
        <View
          style={[
            styles.header,
            { backgroundColor: palette.background, borderBottomColor: dividerColor },
          ]}
        >
          <IconButton
            name="menu"
            iconColor={palette.text}
            accessibilityLabel="Open menu"
            containerStyle={styles.iconButtonSmall}
          />
          <Text style={[styles.title, { color: palette.text }]}>Letterboard</Text>
        </View>

        <View
          style={[
            styles.displayRow,
            { backgroundColor: palette.background, borderBottomColor: dividerColor },
          ]}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Speak out loud"
            onPress={handleSpeak}
            style={({ pressed }) => [
              styles.iconButton,
              styles.iconButtonLarge,
              { backgroundColor: neutralSurface },
              pressed && styles.pressed,
            ]}
          >
            <MaterialCommunityIcons name="volume-high" size={28} color={palette.text} />
          </Pressable>

          <View style={styles.textContainer}>
            {words.length === 0 ? (
              <Text style={[styles.placeholderText, { color: mutedText }]}>
                Tap letters to start building a message.
              </Text>
            ) : (
              <Text
                style={[styles.displayText, { color: palette.text }]}
                numberOfLines={2}
                adjustsFontSizeToFit
                minimumFontScale={0.5}
              >
                {words.join(' ')}
              </Text>
            )}
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear message"
            onPress={handleClear}
            style={({ pressed }) => [
              styles.iconButton,
              styles.iconButtonLarge,
              { backgroundColor: destructiveSurface },
              pressed && styles.pressed,
            ]}
          >
            <MaterialCommunityIcons name="close" size={28} color={destructiveIcon} />
          </Pressable>
        </View>

        <View
          style={[
            styles.keyboardWrapper,
            { backgroundColor: keyboardBackground, borderTopColor: dividerColor },
          ]}
        >
          <View style={styles.keyboardInner}>
            <View style={styles.letterGrid}>
              {letterRows.map((row, rowIdx) => (
                <View key={rowIdx} style={styles.letterRow}>
                  {row.map((letter, colIdx) =>
                    letter ? (
                      <Pressable
                        key={letter}
                        onPress={() => handleLetterClick(letter)}
                        accessibilityRole="button"
                        accessibilityLabel={`Add letter ${letter}`}
                        style={({ pressed }) => [
                          styles.letterButton,
                          { backgroundColor: keyDefault },
                          pressed && { backgroundColor: keyPressed },
                        ]}
                      >
                        <Text style={styles.letter}>{letter}</Text>
                      </Pressable>
                    ) : (
                      <View
                        key={`spacer-${rowIdx}-${colIdx}`}
                        style={[styles.letterButton, { backgroundColor: 'transparent' }]}
                        pointerEvents="none"
                        accessibilityElementsHidden
                        importantForAccessibility="no-hide-descendants"
                      />
                    )
                  )}
                </View>
              ))}
            </View>

            <View style={styles.bottomRow}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Toggle numbers"
                style={({ pressed }) => [
                  styles.numberButton,
                  pressed && styles.pressed,
                ]}
                onPress={() => {
                  // Future enhancement for toggling numeric layout.
                }}
              >
                <Text style={styles.numberButtonText}>123</Text>
              </Pressable>
              <View style={styles.spaceBar} accessibilityLabel="Space bar" />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Delete last letter"
                onPress={handleBackspace}
                style={({ pressed }) => [
                  styles.iconButton,
                  styles.backspaceButton,
                  pressed && styles.pressed,
                ]}
              >
                <MaterialCommunityIcons name="backspace-outline" size={28} color="#ffffff" />
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

type IconButtonProps = {
  name: ComponentProps<typeof MaterialCommunityIcons>['name'];
  iconColor: string;
  accessibilityLabel: string;
  containerStyle?: StyleProp<ViewStyle>;
};

function IconButton({ name, iconColor, accessibilityLabel, containerStyle }: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [
        styles.iconButton,
        containerStyle,
        pressed && styles.pressed,
      ]}
    >
      <MaterialCommunityIcons name={name} size={28} color={iconColor} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  displayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  displayText: {
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 42,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '500',
  },
  keyboardWrapper: {
    flex: 1,
    marginTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 12,
    overflow: 'hidden',
  },
  keyboardInner: {
    flex: 1,
    overflow: 'hidden',
  },
  letterGrid: {
    flex: 1,
    gap: 4,
  },
  letterRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
  },
  letterButton: {
    flex: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 0,
  },
  letter: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
    gap: 8,
  },
  numberButton: {
    height: 64,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3f3f46',
    backgroundColor: '#27272a',
  },
  numberButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  spaceBar: {
    flex: 0.75,
    height: 64,
    borderRadius: 12,
    backgroundColor: '#27272a',
    borderWidth: 1,
    borderColor: '#3f3f46',
  },
  backspaceButton: {
    height: 64,
    width: 64,
    borderRadius: 12,
    backgroundColor: '#27272a',
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  iconButtonLarge: {
    height: 48,
    width: 48,
  },
  iconButtonSmall: {
    height: 44,
    width: 44,
  },
  pressed: {
    opacity: 0.7,
  },
});
