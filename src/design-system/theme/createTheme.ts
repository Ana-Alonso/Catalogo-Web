import { colors } from '../tokens/colors';
import { spacing } from '../tokens/spacing';
import { radius } from '../tokens/radius';
import { typography } from '../tokens/typography';

export const createTheme = () => {
  return {
    palette: {
      mode: 'dark' as const,
      primary: colors.primary,
      neutral: colors.neutral,
      background: colors.neutral[950],
      surface: colors.neutral[900],
      text: {
        primary: colors.white,
        secondary: colors.neutral[400],
        tertiary: colors.neutral[500],
      },
      border: colors.neutral[800],
    },
    spacing,
    radius,
    typography,
    components: {},
  };
};

export const theme = createTheme();

export type Theme = ReturnType<typeof createTheme>;
