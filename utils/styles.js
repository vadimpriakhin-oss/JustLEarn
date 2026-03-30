import { StyleSheet } from 'react-native';

export const COLORS = {
  background: '#1d1d1d',
  backgroundLight: '#2e2e2e',
  backgroundCard: 'rgba(45, 45, 45, 0.9)',
  accent: '#00ffcc',
  accentGlow: 'rgba(0, 255, 204, 0.3)',
  buttonPrimary: '#ff007f',
  buttonSecondary: '#ff7f00',
  text: '#f0f0f0',
  textMuted: '#aaaaaa',
  correct: '#00cc66',
  incorrect: '#ff3333',
  border: 'rgba(0, 255, 204, 0.4)',
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
};

export const FONTS = {
  small: 14,
  medium: 16,
  large: 18,
  xlarge: 22,
  xxlarge: 28,
  title: 36,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: SPACING.md,
  },
  centeredContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
  },
  card: {
    backgroundColor: COLORS.backgroundCard,
    borderRadius: 12,
    padding: SPACING.md,
    marginVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: FONTS.title,
    fontWeight: 'bold',
    color: COLORS.accent,
    textAlign: 'center',
    textShadowColor: COLORS.accent,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: FONTS.medium,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  heading: {
    fontSize: FONTS.xlarge,
    fontWeight: 'bold',
    color: COLORS.accent,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  text: {
    fontSize: FONTS.medium,
    color: COLORS.text,
  },
  btnPrimary: {
    backgroundColor: COLORS.buttonPrimary,
    borderRadius: 8,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    marginVertical: SPACING.sm,
  },
  btnSecondary: {
    backgroundColor: COLORS.transparent,
    borderRadius: 8,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    marginVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  btnText: {
    color: COLORS.white,
    fontSize: FONTS.medium,
    fontWeight: '600',
  },
  btnTextSecondary: {
    color: COLORS.accent,
    fontSize: FONTS.medium,
    fontWeight: '600',
  },
  input: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.text,
    fontSize: FONTS.medium,
    padding: SPACING.md,
    marginVertical: SPACING.sm,
  },
  label: {
    fontSize: FONTS.medium,
    color: COLORS.accent,
    marginBottom: SPACING.xs,
    fontWeight: '600',
  },
});
