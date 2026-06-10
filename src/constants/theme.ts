import palette from './palette';

export const colors = {
  background: palette.gray[950],
  surface: palette.gray[900],
  surfaceElevated: palette.gray[800],
  surfaceHigh: palette.gray[700],
  separator: palette.gray[600],
  textPrimary: palette.white,
  textSecondary: palette.gray[400],
  textTertiary: palette.gray[500],
  accent: palette.blue[500],
  positive: palette.green[500],
  warning: palette.orange[500],
  destructive: palette.red[500],
} as const;
