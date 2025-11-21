import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import * as Speech from 'expo-speech';
import { Dimensions, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

type FaceEmoji = { emoji: string; emotion: string };

const faceEmojis: FaceEmoji[] = [
  { emoji: '😀', emotion: 'happy' },
  { emoji: '😌', emotion: 'relaxed' },
  { emoji: '❤️', emotion: 'love' },
  { emoji: '😎', emotion: 'cool' },
  { emoji: '🤪', emotion: 'silly' },
  { emoji: '🤩', emotion: 'excited' },
  { emoji: '🤒', emotion: 'sick' },
  { emoji: '🥱', emotion: 'tired' },
  { emoji: '🤔', emotion: 'confused' },
  { emoji: '🤯', emotion: 'surprised' },
  { emoji: '😵‍💫', emotion: 'overwhelmed' },
  { emoji: '😰', emotion: 'anxious' },
  { emoji: '😣', emotion: 'frustrated' },
  { emoji: '😢', emotion: 'sad' },
  { emoji: '😡', emotion: 'angry' },
];

export default function EmojiBoardScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];
  const screenBackground = colorScheme === 'dark' ? '#18181b' : '#f3f4f6';
  
  // Calculate key width to ensure consistent sizing across all rows
  const screenWidth = Dimensions.get('window').width;
  const numColumns = 5;
  const horizontalPadding = 16 * 2; // left + right padding
  const gap = 12;
  const totalGaps = gap * (numColumns - 1);
  const keyWidth = (screenWidth - horizontalPadding - totalGaps) / numColumns;

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
      <FlatList
        data={faceEmojis}
        keyExtractor={(item) => item.emoji}
        numColumns={5}
        columnWrapperStyle={styles.row}
        contentContainerStyle={[styles.list, { backgroundColor: screenBackground }]}
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`${item.emotion} emoji`}
            onPress={() => {
              try {
                Speech.speak(item.emotion);
              } catch (error) {
                console.error('Speech error:', error);
              }
            }}
            style={({ pressed }) => [
              styles.key,
              {
                width: keyWidth,
                height: keyWidth,
                backgroundColor: colorScheme === 'dark' ? '#1f2937' : '#ffffff',
                borderColor: colorScheme === 'dark' ? '#374151' : '#e5e7eb',
                opacity: pressed ? 0.9 : 1,
                transform: [{ scale: pressed ? 0.98 : 1 }],
              },
            ]}
          >
            <ThemedText style={[styles.emoji, { color: palette.text }]}>
              {item.emoji}
            </ThemedText>
            <ThemedText
              style={[
                styles.label,
                { color: palette.text, fontFamily: Fonts.rounded },
              ]}
            >
              {item.emotion}
            </ThemedText>
          </Pressable>
        )}
      />
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
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  row: {
    gap: 12,
    paddingVertical: 8,
  },
  key: {
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 6,
  },
  emoji: {
    fontSize: 32,
    lineHeight: 38,
    textAlign: 'center',
    includeFontPadding: true,
  },
  label: {
    marginTop: 6,
    fontSize: 14,
    textAlign: 'center',
  },
});
