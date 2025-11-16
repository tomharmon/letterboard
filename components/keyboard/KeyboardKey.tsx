import { Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';

export type KeyColors = {
  default: string;
  pressed: string;
  text: string;
};

type Props = {
  label: string;
  value?: string;
  flex?: number;
  onPress: (value: string) => void;
  colors: KeyColors;
  accessibilityLabel?: string;
  style?: ViewStyle;
};

export function KeyboardKey({
  label,
  value,
  flex = 1,
  onPress,
  colors,
  accessibilityLabel,
  style,
}: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? `Add ${label}`}
      onPress={() => onPress(value ?? label)}
      style={({ pressed }) => [
        styles.key,
        { flex, backgroundColor: colors.default },
        pressed && { backgroundColor: colors.pressed },
        style,
      ]}
    >
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  key: {
    flex: 1,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 0,
  },
  label: {
    fontSize: 28,
    fontWeight: '700',
  },
});

export default KeyboardKey;

