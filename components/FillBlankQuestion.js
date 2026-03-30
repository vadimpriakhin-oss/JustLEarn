import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, commonStyles } from '../styles/common';

export default function FillBlankQuestion({ item, onAnswer, answered }) {
  const [userInput, setUserInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const inputRef = useRef(null);

  function handleSubmit() {
    if (submitted || !userInput.trim()) return;
    setSubmitted(true);
    const isCorrect = userInput.trim().toLowerCase() === item.answer.toLowerCase();
    onAnswer(isCorrect);
  }

  const isCorrect = submitted && userInput.trim().toLowerCase() === item.answer.toLowerCase();

  return (
    <View style={styles.container}>
      <Text style={commonStyles.questionText}>
        {item.question}
      </Text>
      <Text style={styles.hint}>Fill in the blank:</Text>
      <TextInput
        ref={inputRef}
        style={[
          commonStyles.input,
          submitted && (isCorrect ? styles.correctInput : styles.incorrectInput),
        ]}
        placeholder="Type your answer..."
        placeholderTextColor={colors.textSecondary}
        value={userInput}
        onChangeText={setUserInput}
        editable={!submitted}
        onSubmitEditing={handleSubmit}
        returnKeyType="done"
        autoCapitalize="none"
        autoCorrect={false}
      />
      {!submitted && (
        <TouchableOpacity
          style={[commonStyles.primaryButton, !userInput.trim() && styles.disabledBtn]}
          onPress={handleSubmit}
          disabled={!userInput.trim()}
        >
          <Text style={commonStyles.primaryButtonText}>Check Answer</Text>
        </TouchableOpacity>
      )}
      {submitted && (
        <View style={isCorrect ? commonStyles.feedbackCorrect : commonStyles.feedbackIncorrect}>
          <Text style={commonStyles.feedbackText}>
            {isCorrect ? '✅ Correct!' : `❌ The correct answer is: "${item.answer}"`}
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
  hint: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 8,
    textAlign: 'center',
  },
  correctInput: {
    borderColor: colors.correct,
  },
  incorrectInput: {
    borderColor: colors.incorrect,
  },
  disabledBtn: {
    opacity: 0.5,
  },
});
