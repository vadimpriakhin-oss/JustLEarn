import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, commonStyles } from '../styles/common';

export default function TrueFalseQuestion({ item, onAnswer, answered }) {
  const [selected, setSelected] = useState(null);

  function handlePress(choice) {
    if (answered) return;
    setSelected(choice);
    const isCorrect = choice === item.correctAnswer;
    onAnswer(isCorrect);
  }

  const getButtonStyle = (choice) => {
    if (!answered || selected !== choice) {
      return [styles.choiceBtn, selected === choice && styles.selectedBtn];
    }
    const isCorrect = choice === item.correctAnswer;
    return [styles.choiceBtn, isCorrect ? styles.correctBtn : styles.incorrectBtn];
  };

  return (
    <View style={styles.container}>
      <Text style={commonStyles.questionText}>{item.question}</Text>
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={getButtonStyle(true)}
          onPress={() => handlePress(true)}
          disabled={answered}
        >
          <Text style={styles.choiceText}>✓ True</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={getButtonStyle(false)}
          onPress={() => handlePress(false)}
          disabled={answered}
        >
          <Text style={styles.choiceText}>✗ False</Text>
        </TouchableOpacity>
      </View>
      {answered && (
        <View style={selected === item.correctAnswer ? commonStyles.feedbackCorrect : commonStyles.feedbackIncorrect}>
          <Text style={commonStyles.feedbackText}>
            {selected === item.correctAnswer
              ? '✅ Correct!'
              : `❌ The answer is: ${item.correctAnswer ? 'True' : 'False'}`}
          </Text>
          {item.explanation ? (
            <Text style={[commonStyles.feedbackText, { marginTop: 6, fontSize: 13 }]}>{item.explanation}</Text>
          ) : null}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  choiceBtn: {
    flex: 1,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 18,
    alignItems: 'center',
    marginHorizontal: 6,
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
  choiceText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
