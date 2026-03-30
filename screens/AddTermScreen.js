import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTerms } from '../context/TermsContext';
import { colors, commonStyles } from '../styles/common';

const TABS = [
  { id: 'single', label: '📝 Single Term' },
  { id: 'batch', label: '📚 Batch Mode' },
  { id: 'list', label: '📋 My Terms' },
];

export default function AddTermScreen({ navigation }) {
  const { terms, addTerm, addTermsBatch, deleteTerm, resetToDefaults } = useTerms();
  const [activeTab, setActiveTab] = useState('single');

  // Single term state
  const [singleTerm, setSingleTerm] = useState('');
  const [singleAnswer, setSingleAnswer] = useState('');

  // Batch mode state
  const [batchText, setBatchText] = useState('');

  async function handleAddSingle() {
    if (!singleTerm.trim() || !singleAnswer.trim()) {
      Alert.alert('Missing fields', 'Please enter both a term and an answer.');
      return;
    }
    await addTerm(singleTerm, singleAnswer);
    setSingleTerm('');
    setSingleAnswer('');
    Alert.alert('Success', 'Term added successfully!');
  }

  async function handleAddBatch() {
    const lines = batchText
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.includes(':') || l.includes('=') || l.includes('-'));

    if (!lines.length) {
      Alert.alert(
        'Invalid format',
        'Enter terms using format:\nterm : answer\nor\nterm = answer\nor\nterm - answer'
      );
      return;
    }

    const pairs = lines
      .map((l) => {
        const sep = l.includes(':') ? ':' : l.includes('=') ? '=' : '-';
        const idx = l.indexOf(sep);
        return { term: l.slice(0, idx).trim(), answer: l.slice(idx + 1).trim() };
      })
      .filter((p) => p.term && p.answer);

    if (!pairs.length) {
      Alert.alert('No valid pairs', 'Could not parse any valid term–answer pairs.');
      return;
    }

    await addTermsBatch(pairs);
    setBatchText('');
    Alert.alert('Success', `${pairs.length} term(s) added!`);
  }

  function handleDelete(id, term) {
    Alert.alert('Delete term', `Remove "${term}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteTerm(id) },
    ]);
  }

  function handleReset() {
    Alert.alert('Reset to defaults', 'This will remove all your custom terms. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => resetToDefaults() },
    ]);
  }

  return (
    <SafeAreaView style={commonStyles.container}>
      <ScrollView contentContainerStyle={commonStyles.scrollContent} keyboardShouldPersistTaps="handled">
        <Text style={commonStyles.title}>JustLEarn</Text>
        <Text style={commonStyles.subtitle}>Manage Your Terms</Text>

        {/* Tabs */}
        <View style={styles.tabRow}>
          {TABS.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, activeTab === tab.id && styles.activeTab]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Single Term */}
        {activeTab === 'single' && (
          <View style={commonStyles.card}>
            <Text style={commonStyles.heading}>Add Single Term</Text>
            <Text style={commonStyles.label}>Term:</Text>
            <TextInput
              style={commonStyles.input}
              placeholder="Enter the term..."
              placeholderTextColor={colors.textSecondary}
              value={singleTerm}
              onChangeText={setSingleTerm}
              autoCapitalize="words"
            />
            <Text style={commonStyles.label}>Definition / Answer:</Text>
            <TextInput
              style={[commonStyles.input, { minHeight: 70 }]}
              placeholder="Enter the definition or answer..."
              placeholderTextColor={colors.textSecondary}
              value={singleAnswer}
              onChangeText={setSingleAnswer}
              multiline
            />
            <TouchableOpacity style={commonStyles.primaryButton} onPress={handleAddSingle}>
              <Text style={commonStyles.primaryButtonText}>Add Term</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Batch Mode */}
        {activeTab === 'batch' && (
          <View style={commonStyles.card}>
            <Text style={commonStyles.heading}>Batch Mode</Text>
            <Text style={[commonStyles.label, { marginBottom: 12 }]}>
              Enter one term per line using format:{'\n'}
              <Text style={{ color: colors.neon }}>term : definition</Text>
            </Text>
            <TextInput
              style={[commonStyles.input, { minHeight: 160, textAlignVertical: 'top' }]}
              placeholder={'Apple : A round, sweet fruit\nBook : A set of written pages\nCat : A small furry animal'}
              placeholderTextColor={colors.textSecondary}
              value={batchText}
              onChangeText={setBatchText}
              multiline
              autoCapitalize="none"
              autoCorrect={false}
            />
            <TouchableOpacity style={commonStyles.primaryButton} onPress={handleAddBatch}>
              <Text style={commonStyles.primaryButtonText}>Add All Terms</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* My Terms List */}
        {activeTab === 'list' && (
          <View>
            <View style={styles.listHeader}>
              <Text style={commonStyles.heading}>My Terms ({terms.length})</Text>
              <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
                <Text style={styles.resetText}>Reset</Text>
              </TouchableOpacity>
            </View>
            {terms.length === 0 ? (
              <View style={commonStyles.card}>
                <Text style={styles.emptyText}>No terms yet. Add some!</Text>
              </View>
            ) : (
              terms.map((t) => (
                <View key={t.id} style={styles.termCard}>
                  <View style={styles.termInfo}>
                    <Text style={styles.termTitle}>{t.term}</Text>
                    <Text style={styles.termAnswer}>{t.answer}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDelete(t.id, t.term)}
                  >
                    <Text style={styles.deleteText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        )}

        <TouchableOpacity
          style={[commonStyles.secondaryButton, { marginTop: 16 }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={commonStyles.secondaryButtonText}>Back to Home</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  activeTabText: {
    color: colors.white,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  termCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 8,
  },
  termInfo: {
    flex: 1,
  },
  termTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.neon,
    marginBottom: 2,
  },
  termAnswer: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,51,51,0.15)',
    borderWidth: 1,
    borderColor: colors.incorrect,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  deleteText: {
    color: colors.incorrect,
    fontSize: 14,
    fontWeight: 'bold',
  },
  resetBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.incorrect,
  },
  resetText: {
    color: colors.incorrect,
    fontSize: 13,
  },
  emptyText: {
    color: colors.textSecondary,
    textAlign: 'center',
    fontSize: 15,
    paddingVertical: 20,
  },
});
