import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles } from '../styles/common';

const MODES = [
  { id: 'truefalse', icon: '✓✗', title: 'True or False', desc: 'Decide if the statement is true or false' },
  { id: 'multichoice', icon: '◯', title: 'Multiple Choice', desc: 'Pick the correct answer from 4 options' },
  { id: 'fillblank', icon: '_', title: 'Fill in the Blank', desc: 'Type the missing word or phrase' },
  { id: 'dragdrop', icon: '⇄', title: 'Match Terms', desc: 'Match terms to their definitions' },
  { id: 'addterm', icon: '➕', title: 'Add Custom Term', desc: 'Create and manage your own terms' },
];

export default function HomeScreen({ navigation }) {
  function handleMode(mode) {
    if (mode === 'addterm') {
      navigation.navigate('AddTerm');
    } else {
      navigation.navigate('Quiz', { mode });
    }
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView contentContainerStyle={commonStyles.scrollContent}>
        <Text style={commonStyles.title}>JustLEarn</Text>
        <Text style={commonStyles.subtitle}>Learn Your Way</Text>

        {MODES.map((m) => (
          <TouchableOpacity
            key={m.id}
            style={styles.modeCard}
            onPress={() => handleMode(m.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.modeIcon}>{m.icon}</Text>
            <View style={styles.modeInfo}>
              <Text style={styles.modeTitle}>{m.title}</Text>
              <Text style={styles.modeDesc}>{m.desc}</Text>
            </View>
            <Text style={styles.modeArrow}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 12,
    shadowColor: colors.neon,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  modeIcon: {
    fontSize: 28,
    width: 44,
    textAlign: 'center',
    marginRight: 14,
  },
  modeInfo: {
    flex: 1,
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.neon,
    marginBottom: 2,
  },
  modeDesc: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  modeArrow: {
    fontSize: 24,
    color: colors.neon,
    marginLeft: 8,
  },
});
