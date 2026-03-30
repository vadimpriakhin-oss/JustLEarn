import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, commonStyles } from '../styles/common';

export default function DragDropQuestion({ item, onAnswer, answered }) {
  const [selectedTerm, setSelectedTerm] = useState(null);
  const [matched, setMatched] = useState({});

  function handleTermPress(term) {
    if (answered) return;
    setSelectedTerm(selectedTerm === term ? null : term);
  }

  function handleDefinitionPress(definition) {
    if (answered || !selectedTerm) return;
    const isCorrect = item.pairs.some(
      (p) => p.term === selectedTerm && p.definition === definition
    );
    const newMatched = { ...matched, [selectedTerm]: { definition, isCorrect } };
    setMatched(newMatched);
    setSelectedTerm(null);

    if (Object.keys(newMatched).length === item.pairs.length) {
      const allCorrect = Object.values(newMatched).every((m) => m.isCorrect);
      onAnswer(allCorrect);
    }
  }

  const isTermMatched = (term) => term in matched;
  const isDefinitionMatched = (definition) =>
    Object.values(matched).some((m) => m.definition === definition);

  const getTermStyle = (term) => {
    if (isTermMatched(term)) {
      return [styles.item, matched[term].isCorrect ? styles.correctItem : styles.incorrectItem];
    }
    if (selectedTerm === term) return [styles.item, styles.selectedItem];
    return [styles.item];
  };

  const getDefinitionStyle = (definition) => {
    if (isDefinitionMatched(definition)) {
      const match = Object.values(matched).find((m) => m.definition === definition);
      return [styles.item, match.isCorrect ? styles.correctItem : styles.incorrectItem];
    }
    return [styles.item, selectedTerm && styles.highlightedItem];
  };

  return (
    <View style={styles.container}>
      <Text style={commonStyles.questionText}>{item.question}</Text>
      <Text style={styles.instruction}>
        {selectedTerm ? `Selected: "${selectedTerm}" — tap a definition` : 'Tap a term, then tap its definition'}
      </Text>
      <View style={styles.columnsContainer}>
        <View style={styles.column}>
          <Text style={styles.columnHeader}>Terms</Text>
          {item.pairs.map((p, i) => (
            <TouchableOpacity
              key={i}
              style={getTermStyle(p.term)}
              onPress={() => handleTermPress(p.term)}
              disabled={isTermMatched(p.term) || answered}
            >
              <Text style={styles.itemText}>{p.term}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.column}>
          <Text style={styles.columnHeader}>Definitions</Text>
          {item.pairs
            .map((p) => p.definition)
            .sort()
            .map((def, i) => (
              <TouchableOpacity
                key={i}
                style={getDefinitionStyle(def)}
                onPress={() => handleDefinitionPress(def)}
                disabled={isDefinitionMatched(def) || answered}
              >
                <Text style={styles.itemText}>{def}</Text>
              </TouchableOpacity>
            ))}
        </View>
      </View>
      {answered && (
        <View
          style={
            Object.values(matched).every((m) => m.isCorrect)
              ? commonStyles.feedbackCorrect
              : commonStyles.feedbackIncorrect
          }
        >
          <Text style={commonStyles.feedbackText}>
            {Object.values(matched).every((m) => m.isCorrect)
              ? '✅ All correct!'
              : '❌ Some matches were incorrect. Review the correct pairs above.'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  instruction: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 16,
  },
  columnsContainer: {
    flexDirection: 'row',
    marginHorizontal: -5,
  },
  column: {
    flex: 1,
    marginHorizontal: 5,
  },
  columnHeader: {
    color: colors.neon,
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  item: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    minHeight: 50,
    justifyContent: 'center',
  },
  selectedItem: {
    borderColor: colors.neon,
    backgroundColor: colors.neonDim,
  },
  highlightedItem: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(255,0,127,0.1)',
  },
  correctItem: {
    borderColor: colors.correct,
    backgroundColor: 'rgba(0,204,102,0.15)',
  },
  incorrectItem: {
    borderColor: colors.incorrect,
    backgroundColor: 'rgba(255,51,51,0.15)',
  },
  itemText: {
    color: colors.text,
    fontSize: 13,
    textAlign: 'center',
  },
});
