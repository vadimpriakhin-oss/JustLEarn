import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING } from '../utils/styles';

export default function QuestionCard({ question, children, feedback }) {
  return (
    <View style={styles.card}>
      <Text style={styles.question}>{question}</Text>
      {feedback ? (
        <View style={[styles.feedback, feedback.correct ? styles.feedbackCorrect : styles.feedbackIncorrect]}>
          <Text style={styles.feedbackText}>{feedback.message}</Text>
        </View>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(45, 45, 45, 0.9)',
    borderRadius: 12,
    padding: SPACING.lg,
    marginVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  question: {
    fontSize: FONTS.large,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md,
    lineHeight: 26,
  },
  feedback: {
    borderRadius: 8,
    padding: SPACING.sm,
    marginBottom: SPACING.md,
    alignItems: 'center',
  },
  feedbackCorrect: {
    backgroundColor: 'rgba(0, 204, 102, 0.2)',
    borderWidth: 1,
    borderColor: COLORS.correct,
  },
  feedbackIncorrect: {
    backgroundColor: 'rgba(255, 51, 51, 0.2)',
    borderWidth: 1,
    borderColor: COLORS.incorrect,
  },
  feedbackText: {
    fontSize: FONTS.medium,
    fontWeight: '600',
    color: COLORS.text,
  },
});
