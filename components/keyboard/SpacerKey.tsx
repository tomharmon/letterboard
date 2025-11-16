import { View } from 'react-native';

type Props = {
  flex?: number;
};

export function SpacerKey({ flex = 1 }: Props) {
  return (
    <View
      style={{
        flex,
        borderRadius: 12,
        backgroundColor: 'transparent',
      }}
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    />
  );
}

export default SpacerKey;

