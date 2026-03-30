import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import NavigationButton from '../components/NavigationButton';
import { getCustomTerms, deleteCustomTerm, updateCustomTerm, clearAllCustomTerms } from '../utils/storageService';
import { COLORS, FONTS, SPACING } from '../utils/styles';

export default function TermsListScreen({ navigation }) {
  const [terms, setTerms] = useState([]);
  const [editing, setEditing] = useState(null);
  const [editTerm, setEditTerm] = useState('');
  const [editAnswer, setEditAnswer] = useState('');

  const loadTerms = useCallback(async () => {
    const data = await getCustomTerms();
    setTerms(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTerms();
    }, [loadTerms])
  );

  const handleDelete = (id, term) => {
    Alert.alert(
      'Delete Term',
      `Delete "${term}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updated = await deleteCustomTerm(id);
            setTerms(updated);
          },
        },
      ]
    );
  };

  const handleEditOpen = (item) => {
    setEditing(item);
    setEditTerm(item.term);
    setEditAnswer(item.answer);
  };

  const handleEditSave = async () => {
    if (!editTerm.trim() || !editAnswer.trim()) {
      Alert.alert('Missing Fields', 'Both term and answer are required.');
      return;
    }
    const updated = await updateCustomTerm(editing.id, editTerm, editAnswer);
    setTerms(updated);
    setEditing(null);
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Terms',
      'Are you sure you want to delete ALL custom terms?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete All',
          style: 'destructive',
          onPress: async () => {
            await clearAllCustomTerms();
            setTerms([]);
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.termCard}>
      <View style={styles.termInfo}>
        <Text style={styles.termText}>{item.term}</Text>
        <Text style={styles.answerText}>{item.answer}</Text>
      </View>
      <View style={styles.termActions}>
        <TouchableOpacity style={styles.editBtn} onPress={() => handleEditOpen(item)}>
          <Text style={styles.editBtnText}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item.id, item.term)}>
          <Text style={styles.deleteBtnText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>My Terms</Text>
        <Text style={styles.count}>{terms.length} term{terms.length !== 1 ? 's' : ''}</Text>
      </View>

      {terms.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📚</Text>
          <Text style={styles.emptyText}>No custom terms yet.</Text>
          <Text style={styles.emptySubtext}>Add terms to use them in quizzes!</Text>
          <NavigationButton
            title="➕  Add a Term"
            onPress={() => navigation.navigate('AddTerm')}
            style={styles.addBtn}
          />
        </View>
      ) : (
        <FlatList
          data={terms}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          ListFooterComponent={
            <View style={styles.footer}>
              <NavigationButton
                title="➕  Add More Terms"
                onPress={() => navigation.navigate('AddTerm')}
                style={styles.addBtn}
              />
              <NavigationButton
                title="🗑️  Clear All"
                variant="secondary"
                onPress={handleClearAll}
                style={styles.clearBtn}
              />
            </View>
          }
        />
      )}

      <View style={styles.bottomNav}>
        <NavigationButton
          title="Back to Home"
          variant="secondary"
          onPress={() => navigation.navigate('Home')}
        />
      </View>

      <Modal visible={!!editing} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Edit Term</Text>
            <Text style={styles.label}>Term:</Text>
            <TextInput
              style={styles.input}
              value={editTerm}
              onChangeText={setEditTerm}
              placeholderTextColor={COLORS.textMuted}
              autoCorrect={false}
            />
            <Text style={styles.label}>Answer:</Text>
            <TextInput
              style={styles.input}
              value={editAnswer}
              onChangeText={setEditAnswer}
              placeholderTextColor={COLORS.textMuted}
              autoCorrect={false}
            />
            <NavigationButton title="Save Changes" onPress={handleEditSave} />
            <NavigationButton title="Cancel" variant="secondary" onPress={() => setEditing(null)} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  header: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: FONTS.xlarge, fontWeight: 'bold', color: COLORS.accent },
  count: { fontSize: FONTS.medium, color: COLORS.textMuted },
  list: { padding: SPACING.md, paddingBottom: SPACING.xl },
  termCard: {
    backgroundColor: 'rgba(45, 45, 45, 0.9)',
    borderRadius: 10,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  termInfo: { flex: 1 },
  termText: { fontSize: FONTS.medium, fontWeight: '600', color: COLORS.text, marginBottom: 2 },
  answerText: { fontSize: FONTS.small, color: COLORS.textMuted },
  termActions: { flexDirection: 'row' },
  editBtn: { padding: SPACING.sm, marginRight: SPACING.xs },
  editBtnText: { fontSize: 20 },
  deleteBtn: { padding: SPACING.sm },
  deleteBtnText: { fontSize: 20 },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  emptyIcon: { fontSize: 56, marginBottom: SPACING.md },
  emptyText: { fontSize: FONTS.large, color: COLORS.text, fontWeight: '600' },
  emptySubtext: { fontSize: FONTS.medium, color: COLORS.textMuted, marginBottom: SPACING.lg, textAlign: 'center' },
  addBtn: { width: '80%' },
  footer: { paddingVertical: SPACING.md, alignItems: 'center' },
  clearBtn: { width: '80%' },
  bottomNav: { padding: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.border },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalCard: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 12,
    padding: SPACING.lg,
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  modalTitle: {
    fontSize: FONTS.xlarge,
    fontWeight: 'bold',
    color: COLORS.accent,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  label: { fontSize: FONTS.medium, color: COLORS.accent, fontWeight: '600', marginBottom: SPACING.xs, marginTop: SPACING.sm },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.text,
    fontSize: FONTS.medium,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
});
