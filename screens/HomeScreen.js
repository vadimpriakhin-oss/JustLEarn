import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { COLORS, FONTS, SPACING } from '../utils/styles';

const MODES = [
  { key: 'TrueFalse', icon: '✓✗', title: 'True or False', screen: 'TrueFalse' },
  { key: 'MultiChoice', icon: '◯', title: 'Multiple Choice', screen: 'MultiChoice' },
  { key: 'FillBlank', icon: '_', title: 'Fill in the Blank', screen: 'FillBlank' },
  { key: 'DragDrop', icon: '⇄', title: 'Drag & Drop', screen: 'DragDrop' },
  { key: 'AddTerm', icon: '➕', title: 'Add Custom Term', screen: 'AddTerm' },
];

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>JustLEarn</Text>
          <Text style={styles.subtitle}>Learn Your Way</Text>
        </View>

        <View style={styles.modesGrid}>
          {MODES.map((mode) => (
            <TouchableOpacity
              key={mode.key}
              style={styles.modeCard}
              onPress={() => navigation.navigate(mode.screen)}
              activeOpacity={0.8}
            >
              <Text style={styles.modeIcon}>{mode.icon}</Text>
              <Text style={styles.modeTitle}>{mode.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={styles.termsBtn}
          onPress={() => navigation.navigate('TermsList')}
          activeOpacity={0.8}
        >
          <Text style={styles.termsBtnText}>📋  Manage Custom Terms</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flexGrow: 1,
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  logo: {
    fontSize: 42,
    fontWeight: 'bold',
    color: COLORS.accent,
    textShadowColor: COLORS.accent,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: FONTS.medium,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
    letterSpacing: 1,
  },
  modesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  modeCard: {
    width: '48%',
    backgroundColor: 'rgba(45, 45, 45, 0.9)',
    borderRadius: 12,
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.sm,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  modeIcon: {
    fontSize: 32,
    marginBottom: SPACING.sm,
    color: COLORS.accent,
  },
  modeTitle: {
    fontSize: FONTS.medium,
    color: COLORS.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  termsBtn: {
    marginTop: SPACING.md,
    padding: SPACING.md,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: 'rgba(45, 45, 45, 0.6)',
    alignItems: 'center',
  },
  termsBtnText: {
    fontSize: FONTS.medium,
    color: COLORS.textMuted,
  },
});
