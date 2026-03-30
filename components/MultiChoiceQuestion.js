import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, commonStyles } from '../styles/common';

export default function MultiChoiceQuestion({ item, onAnswer, answered }) {
  const [selected, setSelected] = useState(null);

  function handlePress(option) {
    if (answered) return;
    setSelected(option);
    const isCorrect = option === item.answer;
    onAnswer(isCorrect);
  }

  const getOptionStyle = (option) => {
    if (!answered) {
      return [styles.optionBtn, selected === option && styles.selectedBtn];
    }
    if (option === item.answer) return [styles.optionBtn, styles.correctBtn];
    if (option === selected) return [styles.optionBtn, styles.incorrectBtn];
    return [styles.optionBtn, styles.dimmedBtn];
  };

  return (
    <View style={styles.container}>
      <Text style={commonStyles.questionText}>{item.question}</Text>
      {item.options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={getOptionStyle(option)}
          onPress={() => handlePress(option)}
          disabled={answered}
        >
          <Text style={styles.optionLabel}>{String.fromCharCode(65 + index)}.</Text>
          <Text style={styles.optionText}>{option}</Text>
        </TouchableOpacity>
      ))}
      {answered && (
        <View style={selected === item.answer ? commonStyles.feedbackCorrect : commonStyles.feedbackIncorrect}>
          <Text style={commonStyles.feedbackText}>
            {selected === item.answer ? '✅ Correct!' : `❌ Correct answer: ${item.answer}`}
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
  optionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  selectedBtn: {
    borderColor: colors.neon,
    backgroundColor: colors.neonDim,
  },
  correctBtn: {
    borderColor: colors.correct,
    backgroundColor: 'rgba(0,204,102,0.15)',
  },
  incorrectBtn: {
    borderColor: colors.incorrect,
    backgroundColor: 'rgba(255,51,51,0.15)',
  },
  dimmedBtn: {
    opacity: 0.5,
  },
  optionLabel: {
    color: colors.neon,
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 10,
    width: 24,
  },
  optionText: {
    color: colors.text,
    fontSize: 16,
    flex: 1,
  },
});
