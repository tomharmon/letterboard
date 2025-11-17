import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Speech from 'expo-speech';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useCallback, useMemo, useRef, useState, type ComponentProps } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { KeyboardControls, KeyboardGrid } from '@/components/keyboard';
import { Colors } from '@/constants/theme';
import { useKeyboardLayout } from '@/contexts/keyboard-layout-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { NUMERIC_LAYOUT, getKeyboardLayout } from '@/lib/keyboard-layouts';

export default function HomeScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];
  const { layoutId, includePunctuation } = useKeyboardLayout();
  const [text, setText] = useState('');
  const [isNumericMode, setIsNumericMode] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const clearHoldMs = 1000;
  const clearProgress = useRef(new Animated.Value(0)).current;
  const clearAnimationRef = useRef<Animated.CompositeAnimation | null>(null);
  const [clearTrackHeight, setClearTrackHeight] = useState(0);

  const selectedLayout = useMemo(
    () => getKeyboardLayout(layoutId, { includePunctuation }),
    [layoutId, includePunctuation],
  );
  const activeLayout = isNumericMode ? NUMERIC_LAYOUT : selectedLayout;

  const words = useMemo(() => {
    if (!text.trim()) {
      return [];
    }

    return text.split(' ');
  }, [text]);

  const handleLetterClick = useCallback((value: string) => {
    setText((prev) => prev + value);
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
    try {
      Speech.speak(textToSpeak);
    } catch (error) {
      console.error('Speech error:', error);
    }
  }, [text]);

  const handleToggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

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
  const keyColors = useMemo(
    () => ({
      default: keyDefault,
      pressed: keyPressed,
      text: keyText,
    }),
    [keyDefault, keyPressed, keyText],
  );

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
            isExpanded && styles.displayRowExpanded,
          ]}
        >
          <View style={styles.leftColumn}>
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
          </View>

          <ScrollView
            style={[
              styles.textContainer,
              isExpanded && styles.textContainerExpanded,
            ]}
            contentContainerStyle={styles.textContainerContent}
            showsVerticalScrollIndicator={true}
          >
            {words.length === 0 ? (
              <Text style={[styles.placeholderText, { color: mutedText }]}>
                Tap letters to start building a message.
              </Text>
            ) : (
              <Text style={[styles.displayText, { color: palette.text }]}>
                {text}
              </Text>
            )}
          </ScrollView>

          <View style={styles.rightColumn}>
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
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={isExpanded ? "Collapse text area" : "Expand text area"}
              onPress={handleToggleExpand}
              style={({ pressed }) => [
                styles.iconButton,
                styles.iconButtonLarge,
                { backgroundColor: neutralSurface },
                pressed && styles.pressed,
              ]}
            >
              <MaterialCommunityIcons 
                name={isExpanded ? "chevron-up" : "chevron-down"} 
                size={28} 
                color={palette.text} 
              />
            </Pressable>
          </View>
        </View>

        <View
          style={[
            styles.keyboardWrapper,
            { backgroundColor: keyboardBackground, borderTopColor: dividerColor },
            isExpanded && styles.keyboardWrapperHidden,
          ]}
        >
          <View style={styles.keyboardInner}>
            <KeyboardGrid layout={activeLayout} onKeyPress={handleLetterClick} colors={keyColors} />
            <KeyboardControls
              isNumericMode={isNumericMode}
              onToggleNumeric={() => setIsNumericMode((prev) => !prev)}
              onSpace={handleSpace}
              onEnter={handleEnter}
              onBackspace={handleBackspace}
              colors={{ ...keyColors, border: keyBorder }}
            />
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
    paddingVertical: 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  displayRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 6,
    flexShrink: 0,
    maxHeight: 200,
    position: 'relative',
  },
  displayRowExpanded: {
    maxHeight: Dimensions.get('window').height * 0.7,
    flex: 1,
  },
  leftColumn: {
    flexDirection: 'column',
    gap: 12,
  },
  rightColumn: {
    flexDirection: 'column',
    gap: 12,
  },
  textContainer: {
    flex: 1,
    paddingHorizontal: 16,
    height: 100,
  },
  textContainerExpanded: {
    height: '100%',
    flex: 1,
  },
  textContainerContent: {
    paddingBottom: 4,
  },
  displayText: {
    fontSize: 34,
    fontWeight: '700',
    lineHeight: 42,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 12,
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
  keyboardWrapperHidden: {
    height: 0,
    overflow: 'hidden',
    marginTop: 0,
    paddingTop: 0,
    paddingBottom: 0,
  },
  keyboardInner: {
    flex: 1,
    overflow: 'hidden',
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
