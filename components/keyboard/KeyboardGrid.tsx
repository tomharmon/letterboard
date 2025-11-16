import { StyleSheet, View } from 'react-native';

import type { KeyboardLayout } from '@/app/lib/keyboard-layouts';

import { KeyboardKey, type KeyColors } from './KeyboardKey';
import { SpacerKey } from './SpacerKey';

type Props = {
  layout: KeyboardLayout;
  onKeyPress: (value: string) => void;
  colors: KeyColors;
};

export function KeyboardGrid({ layout, onKeyPress, colors }: Props) {
  return (
    <View style={styles.grid}>
      {layout.rows.map((row, rowIdx) => (
        <View key={`${layout.id}-row-${rowIdx}`} style={styles.row}>
          {row.map((cell) =>
            cell.type === 'key' ? (
              <KeyboardKey
                key={cell.id}
                label={cell.label}
                value={cell.value}
                flex={cell.flex}
                onPress={onKeyPress}
                colors={colors}
              />
            ) : (
              <SpacerKey key={cell.id} flex={cell.flex} />
            ),
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flex: 1,
    gap: 4,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
  },
});

export default KeyboardGrid;

