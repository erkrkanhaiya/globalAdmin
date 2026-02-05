import { createTheme } from '@mui/material/styles'

export function getMuiTheme(mode: 'light' | 'dark') {
  return createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? {
            primary: { main: '#ff7a45' },
            background: { default: '#f8fafc', paper: '#ffffff' }
          }
        : {
            primary: { main: '#ff8f66' },
            background: { default: '#0b1020', paper: '#121933' },
            text: { primary: '#e6e9f5', secondary: '#a6b0cf' }
          })
    },
    shape: { borderRadius: 12 },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: { borderRadius: 12 }
        }
      }
    },
    typography: {
      fontFamily: 'Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", Arial, sans-serif'
    }
  })
}

