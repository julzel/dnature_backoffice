import { createContext, useContext, useMemo, useState } from 'react'
import { ThemeProvider as MuiThemeProvider, CssBaseline, type PaletteMode } from '@mui/material'
import { buildTheme } from './theme'

interface ColorModeContextType {
  toggleColorMode: () => void
  mode: PaletteMode
}

const ColorModeContext = createContext<ColorModeContextType>({
  toggleColorMode: () => {},
  mode: 'light',
})

/**
 * Hook to access color mode context
 * Must be used within AppThemeProvider
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useColorMode() {
  return useContext(ColorModeContext)
}

/**
 * Theme provider wrapping the app with Material UI theme and dark mode support
 */
export default function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<PaletteMode>('light')

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => setMode((prev) => (prev === 'light' ? 'dark' : 'light')),
      mode,
    }),
    [mode],
  )

  const theme = useMemo(() => buildTheme(mode), [mode])

  return (
    <ColorModeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ColorModeContext.Provider>
  )
}
