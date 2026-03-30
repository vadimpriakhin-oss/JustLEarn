import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import NavigationButton from '../components/NavigationButton';
import { addCustomTerm } from '../utils/storageService';
import { COLORS, FONTS, SPACING } from '../utils/styles';

export default function AddTermScreen({ navigation }) {
  const [term, setTerm] = useState('');
  const [answer, setAnswer] = useState('');
  const [saving, setSaving] = useState(false);
  const [lastAdded, setLastAdded] = useState(null);

  const handleAdd = async () => {
    if (term.trim() === '' || answer.trim() === '') {
      Alert.alert('Missing Fields', 'Please enter both a term and an answer.');
      return;
    }
    setSaving(true);
    await addCustomTerm(term, answer);
    setLastAdded({ term: term.trim(), answer: answer.trim() });
    setTerm('');
    setAnswer('');
    setSaving(false);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>JustLEarn</Text>
          <Text style={styles.heading}>Add Custom Term</Text>

          <View style={styles.card}>
            <Text style={styles.label}>Term:</Text>
            <TextInput
              style={styles.input}
              value={term}
              onChangeText={setTerm}
              placeholder="Enter the term..."
              placeholderTextColor={COLORS.textMuted}
              autoCorrect={false}
              returnKeyType="next"
            />

            <Text style={styles.label}>Answer:</Text>
            <TextInput
              style={styles.input}
              value={answer}
              onChangeText={setAnswer}
              placeholder="Enter the answer..."
              placeholderTextColor={COLORS.textMuted}
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleAdd}
            />

            <NavigationButton
              title={saving ? 'Adding...' : '➕  Add Term'}
              onPress={handleAdd}
              disabled={saving}
              style={styles.addBtn}
            />
          </View>

          {lastAdded && (
            <View style={styles.successCard}>
              <Text style={styles.successText}>✅ Term added successfully!</Text>
              <Text style={styles.successDetail}>
                "{lastAdded.term}" → "{lastAdded.answer}"
              </Text>
            </View>
          )}

          <NavigationButton
            title="📋  View All Terms"
            variant="secondary"
            onPress={() => navigation.navigate('TermsList')}
            style={styles.listBtn}
          />

          <NavigationButton
            title="Back to Home"
            variant="secondary"
            onPress={() => navigation.navigate('Home')}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  flex: { flex: 1 },
  container: { flexGrow: 1, padding: SPACING.md, paddingBottom: SPACING.xl },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.accent,
    textAlign: 'center',
    textShadowColor: COLORS.accent,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  heading: {
    fontSize: FONTS.xlarge,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  card: {
    backgroundColor: 'rgba(45, 45, 45, 0.9)',
    borderRadius: 12,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONTS.medium,
    color: COLORS.accent,
    fontWeight: '600',
    marginBottom: SPACING.xs,
    marginTop: SPACING.sm,
  },
  input: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.text,
    fontSize: FONTS.medium,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  addBtn: { marginTop: SPACING.sm },
  successCard: {
    backgroundColor: 'rgba(0, 204, 102, 0.15)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.correct,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  successText: {
    color: COLORS.correct,
    fontSize: FONTS.medium,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  successDetail: {
    color: COLORS.text,
    fontSize: FONTS.small,
    textAlign: 'center',
  },
  listBtn: { marginBottom: SPACING.xs },
});
