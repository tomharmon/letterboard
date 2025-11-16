import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Zocial from '@expo/vector-icons/Zocial';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { Linking, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors, Fonts } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabTwoScreen() {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const palette = Colors[colorScheme ?? 'light'];

  const handleEmailPress = () => {
    Linking.openURL('mailto:tom@harmon.tech');
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: colorScheme === 'dark' ? '#111827' : '#f3f4f6' },
      ]}
      edges={['top', 'left', 'right']}
    >
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
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <ThemedView style={styles.container}>
          {/* Bug and Feedback Reports Section */}
          <ThemedView style={styles.section}>
            <ThemedText
              type="subtitle"
              style={[styles.sectionHeader, { fontFamily: Fonts.rounded }]}>
              Bug and Feedback Reports
            </ThemedText>
            <ThemedText style={styles.sectionContent}>
              Encountering a bug or have a feature request? We&apos;d love to hear from you! Please
              contact us by emailing tom@harmon.tech
            </ThemedText>
            <Pressable
              onPress={handleEmailPress}
              style={({ pressed }) => [
                styles.emailButton,
                {
                  backgroundColor: colorScheme === 'dark' ? '#0a7ea4' : palette.tint,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Send email to tom@harmon.tech">
              <Zocial name="email" size={16} color="#fff" style={styles.emailIcon} />
              <ThemedText style={styles.emailButtonText}>tom@harmon.tech</ThemedText>
            </Pressable>
          </ThemedView>

          {/* Planned Features Section */}
          <ThemedView style={styles.section}>
            <ThemedText
              type="subtitle"
              style={[styles.sectionHeader, { fontFamily: Fonts.rounded }]}>
              Planned Features
            </ThemedText>
            <ThemedView style={styles.featuresContainer}>
              <ThemedView style={styles.versionSection}>
                <ThemedText type="defaultSemiBold" style={styles.versionHeader}>
                  v1.1
                </ThemedText>
                <ThemedText style={styles.featureItem}>• settings</ThemedText>
                <ThemedText style={styles.subFeatureItem}>
                  • enable/disable tactile feedback via vibration on each keypress
                </ThemedText>
                <ThemedText style={styles.subFeatureItem}>
                  • enable/disable text to speech on each letter press, each whole word entered, or on
                  button press only.
                </ThemedText>
                <ThemedText style={styles.subFeatureItem}>
                  • select different voices for text to speech
                </ThemedText>
                <ThemedText style={styles.subFeatureItem}>• change font size</ThemedText>
                <ThemedText style={styles.subFeatureItem}>
                  • customize the multiple choice options on the multiple choice board
                </ThemedText>
              </ThemedView>

              <ThemedView style={styles.versionSection}>
                <ThemedText type="defaultSemiBold" style={styles.versionHeader}>
                  v1.2
                </ThemedText>
                <ThemedText style={styles.featureItem}>
                  • save custom phrases: type out custom, commonly used messages to easily re-use them.
                </ThemedText>
              </ThemedView>

              <ThemedView style={styles.versionSection}>
                <ThemedText type="defaultSemiBold" style={styles.versionHeader}>
                  v1.3
                </ThemedText>
                <ThemedText style={styles.featureItem}>
                  • session history: automatically save all spelled messages locally to your device.
                  these are completely private and never sent off-device.
                </ThemedText>
              </ThemedView>

              <ThemedView style={styles.versionSection}>
                <ThemedText type="defaultSemiBold" style={styles.versionHeader}>
                  v1.4
                </ThemedText>
                <ThemedText style={styles.featureItem}>• settings</ThemedText>
                <ThemedText style={styles.subFeatureItem}>
                  • customizable theme colors for background colors and keyboard letter colors
                </ThemedText>
                <ThemedText style={styles.subFeatureItem}>• spell check</ThemedText>
                <ThemedText style={styles.subFeatureItem}>• word prediction</ThemedText>
                <ThemedText style={styles.subFeatureItem}>• split letterboard (a-i, j-r, s-z)</ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>
      </ThemedView>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  section: {
    width: '100%',
    maxWidth: 600,
    alignItems: 'center',
    marginBottom: 48,
  },
  sectionHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    paddingVertical: 12,
    textAlign: 'center',
  },
  sectionContent: {
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  emailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  emailIcon: {
    marginRight: 8,
  },
  emailButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  featuresContainer: {
    width: '100%',
    alignItems: 'flex-start',
  },
  versionSection: {
    width: '100%',
    marginBottom: 24,
  },
  versionHeader: {
    fontSize: 18,
    marginBottom: 12,
    paddingVertical: 4,
  },
  featureItem: {
    marginLeft: 16,
    marginBottom: 8,
    lineHeight: 22,
  },
  subFeatureItem: {
    marginLeft: 32,
    marginBottom: 8,
    lineHeight: 22,
  },
});
