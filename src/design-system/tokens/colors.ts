export const colors = {
  primary: {
    500: '#ea580c',
    600: '#ea580c',
    700: '#c2410c',
  },
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    950: '#0a0a0a',
  },
  white: '#ffffff',
  black: '#000000',
} as const;

export type Colors = typeof colors;
