import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Speech from '@mhpdev/react-native-speech';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useCallback, useMemo, useRef, useState, type ComponentProps } from 'react';
import {
  Animated,
  Easing,
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
const GRID_GAP = 6;

export default function HomeScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];
  const [text, setText] = useState('');
  const [isNumericMode, setIsNumericMode] = useState(false);
  const clearHoldMs = 1000;
  const clearProgress = useRef(new Animated.Value(0)).current;
  const clearAnimationRef = useRef<Animated.CompositeAnimation | null>(null);
  const [clearTrackHeight, setClearTrackHeight] = useState(0);

  const letterRows = useMemo(() => {
    if (isNumericMode) {
      // Numpad layout: centered 3-column numpad
      // Row 1: 7 8 9
      // Row 2: 4 5 6
      // Row 3: 1 2 3
      // Row 4: 0 . , (left-aligned)
      // Row 5: remaining symbols
      const rows: Array<Array<string | null>> = Array.from({ length: 5 }, () =>
        Array(COLUMNS).fill(null),
      );

      // Row 1: 7 8 9 (centered in columns 1-3)
      rows[0][1] = '7';
      rows[0][2] = '8';
      rows[0][3] = '9';

      // Row 2: 4 5 6 (centered in columns 1-3)
      rows[1][1] = '4';
      rows[1][2] = '5';
      rows[1][3] = '6';

      // Row 3: 1 2 3 (centered in columns 1-3)
      rows[2][1] = '1';
      rows[2][2] = '2';
      rows[2][3] = '3';

      // Row 4: 0 . , (left-aligned)
      rows[3][1] = '0';
      rows[3][2] = '.';
      rows[3][3] = ',';

      // Row 5: remaining symbols
      const symbols = ['-', '/', '×', '(', ')'];
      let symIndex = 0;
      for (let c = 1; c < COLUMNS && symIndex < symbols.length; c++) {
        rows[4][c] = symbols[symIndex++];
      }

      return rows;
    } else {
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
    }
  }, [isNumericMode]);

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

  const handleSpace = useCallback(() => {
    setText((prev) => prev + ' ');
  }, []);

  const handleEnter = useCallback(() => {
    setText((prev) => prev + '\n');
  }, []);

  const handleClear = useCallback(() => {
    setText('');
  }, []);

  const handleClearPressIn = useCallback(() => {
    // Start progress animation towards completion
    clearAnimationRef.current?.stop();
    clearAnimationRef.current = Animated.timing(clearProgress, {
      toValue: 1,
      duration: clearHoldMs,
      easing: Easing.linear,
      useNativeDriver: false, // animates width
    });
    clearAnimationRef.current.start(({ finished }) => {
      if (finished) {
        // Only clear if the hold completed
        handleClear();
        Animated.timing(clearProgress, {
          toValue: 0,
          duration: 150,
          useNativeDriver: false,
        }).start();
      }
    });
  }, [clearHoldMs, clearProgress, handleClear]);

  const handleClearPressOut = useCallback(() => {
    // Cancel if released early and reset progress
    clearAnimationRef.current?.stop();
    Animated.timing(clearProgress, {
      toValue: 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [clearProgress]);

  const handleSpeak = useCallback(() => {
    const textToSpeak = text || 'Nothing to say yet';
    Speech.speak(textToSpeak).catch((error) => {
      console.error('Speech error:', error);
    });
  }, [text]);

  const mutedText = colorScheme === 'dark' ? '#d4d4d8' : '#6b7280';
  const neutralSurface = colorScheme === 'dark' ? '#1f2937' : '#f3f4f6';
  const destructiveSurface = colorScheme === 'dark' ? '#4b5563' : '#4b5563';
  const destructiveIcon = '#ffffff';
  const dividerColor = colorScheme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(15,23,42,0.08)';
  const keyboardBackground = colorScheme === 'dark' ? '#18181b' : '#f3f4f6';
  const keyDefault = colorScheme === 'dark' ? '#27272a' : '#ffffff';
  const keyPressed = colorScheme === 'dark' ? '#3f3f46' : '#e5e7eb';
  const keyText = colorScheme === 'dark' ? '#ffffff' : '#111827';
  const keyBorder = colorScheme === 'dark' ? '#3f3f46' : '#d1d5db';

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
            styles.displayRow,
            { backgroundColor: palette.background, borderBottomColor: dividerColor },
          ]}
        >
          <IconButton
            name="menu"
            iconColor={palette.text}
            accessibilityLabel="Open menu"
            containerStyle={styles.iconButtonLarge}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          />
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
                {text}
              </Text>
            )}
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Clear message"
            onPressIn={handleClearPressIn}
            onPressOut={handleClearPressOut}
            style={({ pressed }) => [
              styles.iconButton,
              styles.iconButtonLarge,
              { backgroundColor: destructiveSurface },
              pressed && styles.pressed,
              { position: 'relative' },
            ]}
          >
            <MaterialCommunityIcons name="trash-can-outline" size={28} color={destructiveIcon} />
            <View
              pointerEvents="none"
              style={styles.clearFillContainer}
              onLayout={(e) => setClearTrackHeight(e.nativeEvent.layout.height)}
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
            >
              <Animated.View
                style={[
                  styles.clearFill,
                  {
                    height: clearTrackHeight
                      ? Animated.multiply(clearProgress, clearTrackHeight)
                      : 0,
                  },
                ]}
              />
            </View>
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
                        accessibilityLabel={`Add ${letter}`}
                        style={({ pressed }) => [
                          styles.letterButton,
                          { backgroundColor: keyDefault },
                          pressed && { backgroundColor: keyPressed },
                        ]}
                      >
                        <Text style={[styles.letter, { color: keyText }]}>{letter}</Text>
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
              <View style={[styles.slot, { flex: 1 }]}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={isNumericMode ? "Switch to letters" : "Switch to numbers"}
                  style={({ pressed }) => [
                    styles.numberButton,
                    { backgroundColor: keyDefault, borderColor: keyBorder },
                    pressed && styles.pressed,
                  ]}
                  onPress={() => {
                    setIsNumericMode((prev) => !prev);
                  }}
                >
                  <Text style={[styles.numberButtonText, { color: keyText }]}>
                    {isNumericMode ? 'ABC' : '123'}
                  </Text>
                </Pressable>
              </View>
              <View style={[styles.slot, { flex: 3 }]}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Add space"
                  onPress={handleSpace}
                  style={({ pressed }) => [
                    styles.spaceBar,
                    { backgroundColor: keyDefault, borderColor: keyBorder },
                    pressed && { backgroundColor: keyPressed },
                  ]}
                />
              </View>
              <View style={[styles.slot, { flex: 1 }]}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="New line"
                  onPress={handleEnter}
                  style={({ pressed }) => [
                    styles.iconButton,
                    styles.enterButton,
                    { backgroundColor: keyDefault },
                    pressed && styles.pressed,
                  ]}
                >
                  <MaterialCommunityIcons name="keyboard-return" size={28} color={keyText} />
                </Pressable>
              </View>
              <View style={[styles.slot, { flex: 1 }]}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Delete last letter"
                  onPress={handleBackspace}
                  style={({ pressed }) => [
                    styles.iconButton,
                    styles.backspaceButton,
                    { backgroundColor: keyDefault },
                    pressed && styles.pressed,
                  ]}
                >
                  <MaterialCommunityIcons name="backspace-outline" size={28} color={keyText} />
                </Pressable>
              </View>
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
  onPress?: () => void;
};

function IconButton({ name, iconColor, accessibilityLabel, containerStyle, onPress }: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
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
    gap: GRID_GAP,
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
    justifyContent: 'flex-start',
    marginTop: 4,
    gap: GRID_GAP,
  },
  slot: {
    flexBasis: 0,
  },
  numberButton: {
    height: 64,
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3f3f46',
    backgroundColor: '#27272a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberButtonText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#ffffff',
  },
  spaceBar: {
    height: 64,
    width: '100%',
    borderRadius: 12,
    backgroundColor: '#27272a',
    borderWidth: 1,
    borderColor: '#3f3f46',
  },
  enterButton: {
    height: 64,
    width: '100%',
    borderRadius: 12,
    backgroundColor: '#27272a',
  },
  backspaceButton: {
    height: 64,
    width: '100%',
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
  clearFillContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 14,
    overflow: 'hidden',
  },
  clearFill: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#ef4444',
  },
});
