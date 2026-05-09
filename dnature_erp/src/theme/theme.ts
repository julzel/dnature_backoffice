import { createTheme, type PaletteMode } from '@mui/material'

export function buildTheme(mode: PaletteMode) {
  const isDark = mode === 'dark'

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? '#4caf80' : '#17352c',
        light: isDark ? '#80cba8' : '#2e5c4a',
        dark: isDark ? '#2e8b5f' : '#0c1f19',
        contrastText: isDark ? '#000000' : '#ffffff',
      },
      secondary: {
        main: isDark ? '#a8d5bf' : '#5c8a7a',
      },
      background: {
        default: isDark ? '#0f1a16' : '#f5f7f6',
        paper: isDark ? '#1a2e26' : '#ffffff',
      },
      text: {
        primary: isDark ? '#e8f5f0' : '#111827',
        secondary: isDark ? '#9ab8ac' : '#4b5563',
        disabled: isDark ? '#4a6b5e' : '#9ca3af',
      },
      divider: isDark ? '#2a4a3e' : '#e5e7eb',
      success: { main: isDark ? '#66bb6a' : '#2e7d32' },
      warning: { main: isDark ? '#ffa726' : '#ed6c02' },
      error: { main: isDark ? '#f44336' : '#d32f2f' },
      info: { main: isDark ? '#29b6f6' : '#0288d1' },
    },
    typography: {
      fontFamily: '"Inter", system-ui, sans-serif',
      h1: { fontFamily: '"Inter", system-ui, sans-serif', fontWeight: 800, fontSize: '2.5rem' },
      h2: { fontFamily: '"Inter", system-ui, sans-serif', fontWeight: 700, fontSize: '2rem' },
      h3: { fontFamily: '"Inter", system-ui, sans-serif', fontWeight: 700, fontSize: '1.5rem' },
      h4: { fontFamily: '"Inter", system-ui, sans-serif', fontWeight: 800, fontSize: '1.25rem' },
      h5: { fontFamily: '"Inter", system-ui, sans-serif', fontWeight: 700, fontSize: '1.125rem' },
      h6: { fontFamily: '"Inter", system-ui, sans-serif', fontWeight: 600, fontSize: '1rem' },
      subtitle1: { fontFamily: '"Inter", system-ui, sans-serif', fontWeight: 600 },
      subtitle2: { fontFamily: '"Inter", system-ui, sans-serif', fontWeight: 600 },
      body1: { fontFamily: '"Source Sans 3", Georgia, serif', fontWeight: 400, fontSize: '1rem' },
      body2: { fontFamily: '"Source Sans 3", Georgia, serif', fontWeight: 400, fontSize: '0.875rem' },
      caption: { fontFamily: '"Source Sans 3", Georgia, serif', fontWeight: 400, fontSize: '0.75rem' },
      button: { fontFamily: '"Inter", system-ui, sans-serif', fontWeight: 600, textTransform: 'none' },
      overline: { fontFamily: '"Inter", system-ui, sans-serif', fontWeight: 600, letterSpacing: '0.1em' },
    },
    shape: { borderRadius: 8 },
    components: {
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { borderRadius: 8, padding: '8px 20px' },
        },
      },
      MuiPaper: {
        defaultProps: { elevation: 0 },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: isDark ? '#4caf80' : '#17352c',
            },
          },
        },
      },
      MuiButtonBase: {
        styleOverrides: {
          root: {
            '&:focus-visible': {
              outline: `2px solid ${isDark ? '#4caf80' : '#17352c'}`,
              outlineOffset: '2px',
            },
          },
        },
      },
    },
  })
}
