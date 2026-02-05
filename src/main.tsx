import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider, CssBaseline } from '@mui/material'
import App from './App'
import './styles/global.css'
import { useThemeStore } from './store/theme'
import { getMuiTheme } from './theme'

const queryClient = new QueryClient()

function Root() {
  const mode = useThemeStore(s => s.mode)
  const theme = React.useMemo(() => getMuiTheme(mode), [mode])
  
  React.useEffect(() => {
    console.log('React app mounted successfully')
  }, [])
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
)

