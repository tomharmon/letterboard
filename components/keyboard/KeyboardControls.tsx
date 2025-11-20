import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { KeyColors } from './KeyboardKey';

export const KEYBOARD_CONTROL_BASE_HEIGHT = 64;

type Props = {
  isNumericMode: boolean;
  onToggleNumeric: () => void;
  onSpace: () => void;
  onEnter: () => void;
  onBackspace: () => void;
  colors: KeyColors & { border: string };
  controlHeight?: number;
};

export function KeyboardControls({
  isNumericMode,
  onToggleNumeric,
  onSpace,
  onEnter,
  onBackspace,
  colors,
  controlHeight,
}: Props) {
  const resolvedControlHeight = controlHeight ?? KEYBOARD_CONTROL_BASE_HEIGHT;
  const heightStyle = { height: resolvedControlHeight };

  return (
    <View style={styles.container}>
      <View style={[styles.slot, { flex: 1 }]}>
        <Pressable
          accessibilityRole='button'
          accessibilityLabel={isNumericMode ? 'Switch to letters' : 'Switch to numbers'}
          style={({ pressed }) => [
            styles.toggleButton,
            { backgroundColor: colors.default, borderColor: colors.border },
            heightStyle,
            pressed && styles.pressed,
          ]}
          onPress={onToggleNumeric}
        >
          <Text style={[styles.toggleText, { color: colors.text }]}>{isNumericMode ? 'ABC' : '123'}</Text>
        </Pressable>
      </View>
      <View style={[styles.slot, { flex: 3 }]}>
        <Pressable
          accessibilityRole='button'
          accessibilityLabel='Add space'
          onPress={onSpace}
          style={({ pressed }) => [
            styles.spaceBar,
            { backgroundColor: colors.default, borderColor: colors.border },
            heightStyle,
            pressed && { backgroundColor: colors.pressed },
          ]}
        />
      </View>
      <View style={[styles.slot, { flex: 1 }]}>
        <Pressable
          accessibilityRole='button'
          accessibilityLabel='New line'
          onPress={onEnter}
          style={({ pressed }) => [
            styles.iconButton,
            { backgroundColor: colors.default },
            heightStyle,
            pressed && styles.pressed,
          ]}
        >
          <MaterialCommunityIcons name='keyboard-return' size={28} color={colors.text} />
        </Pressable>
      </View>
      <View style={[styles.slot, { flex: 1 }]}>
        <Pressable
          accessibilityRole='button'
          accessibilityLabel='Delete last letter'
          onPress={onBackspace}
          style={({ pressed }) => [
            styles.iconButton,
            { backgroundColor: colors.default },
            heightStyle,
            pressed && styles.pressed,
          ]}
        >
          <MaterialCommunityIcons name='backspace-outline' size={28} color={colors.text} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 4,
    gap: 6,
  },
  slot: {
    flexBasis: 0,
  },
  toggleButton: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleText: {
    fontSize: 26,
    fontWeight: '700',
  },
  spaceBar: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 1,
  },
  iconButton: {
    width: '100%',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.7,
  },
});

export default KeyboardControls;

