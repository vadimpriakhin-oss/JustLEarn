import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING } from '../utils/styles';

export default function NavigationButton({ title, onPress, variant = 'primary', disabled = false, style }) {
  const isPrimary = variant === 'primary';

  return (
    <TouchableOpacity
      style={[
        styles.btn,
        isPrimary ? styles.btnPrimary : styles.btnSecondary,
        disabled && styles.btnDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
    >
      <Text style={[styles.btnText, !isPrimary && styles.btnTextSecondary]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    borderRadius: 10,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SPACING.xs,
  },
  btnPrimary: {
    backgroundColor: COLORS.buttonPrimary,
  },
  btnSecondary: {
    backgroundColor: COLORS.transparent,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  btnDisabled: {
    opacity: 0.4,
  },
  btnText: {
    color: COLORS.white,
    fontSize: FONTS.medium,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  btnTextSecondary: {
    color: COLORS.accent,
  },
});
