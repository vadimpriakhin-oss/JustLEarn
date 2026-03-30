import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING } from '../utils/styles';

export default function QuizHeader({ score, current, total, title }) {
  const progress = total > 0 ? (current / total) * 100 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.scoreBox}>
          <Text style={styles.scoreLabel}>Score</Text>
          <Text style={styles.scoreValue}>{score}</Text>
        </View>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.progressLabel}>
          <Text style={styles.progressText}>
            {current}/{total}
          </Text>
        </View>
      </View>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(45, 45, 45, 0.95)',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  scoreBox: {
    alignItems: 'center',
    minWidth: 60,
  },
  scoreLabel: {
    fontSize: FONTS.small,
    color: COLORS.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  scoreValue: {
    fontSize: FONTS.xlarge,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  title: {
    fontSize: FONTS.large,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    flex: 1,
  },
  progressLabel: {
    alignItems: 'center',
    minWidth: 60,
  },
  progressText: {
    fontSize: FONTS.medium,
    color: COLORS.textMuted,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.accent,
    borderRadius: 3,
  },
});
