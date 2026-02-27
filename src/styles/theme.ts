export const theme = {
  colors: {
    background: '#00132A',
    text: {
      primary: 'rgba(255, 255, 255, 0.87)',
      secondary: '#94a3b8',
      muted: '#64748b',
    },
    primary: {
      main: '#38bdf8',
      light: 'rgba(56, 189, 248, 0.1)',
    },
    success: {
      main: '#22c55e',
      glow: '0 0 8px #22c55e',
    },
    border: {
      light: 'rgba(255, 255, 255, 0.1)',
      lighter: 'rgba(255, 255, 255, 0.05)',
      highlight: 'rgba(255, 255, 255, 0.2)',
    },
    glass: {
      background: 'rgba(255, 255, 255, 0.05)',
      border: 'rgba(255, 255, 255, 0.1)',
      hover: 'rgba(255, 255, 255, 0.1)',
    },
    white: '#ffffff',
    black: '#000000',
    transparent: 'transparent',
  },
  layout: {
    container: {
      margin: '90px',
      gutter: '20px',
      columns: 12,
    },
  },
  typography: {
    fontFamily: {
      sans: "'Inter', system-ui, Avenir, Helvetica, Arial, sans-serif",
      serif: "'Times New Roman', serif",
    },
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    weights: {
      regular: 400,
      medium: 500,
      bold: 700,
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
    '4xl': '6rem',
    'section': '8rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    full: '9999px',
  },
  transitions: {
    default: 'all 0.2s ease',
    slow: 'all 0.3s ease',
  },
  zIndices: {
    header: 50,
    modal: 100,
  },
} as const;

export type Theme = typeof theme;
