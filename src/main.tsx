import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider, CssBaseline } from '@mui/material'
import App from './App'
import { useThemeStore } from './60yard/store/theme'
import { getMuiTheme } from './theme'
// Import global CSS from 60yard (shared styles)
import './60yard/styles/global.css'

const queryClient = new QueryClient()

// Determine which product store to use based on URL or localStorage
function getProductStore() {
  // Check if we're on a product-specific route
  const path = window.location.pathname
  const productMatch = path.match(/\/(60yard|crm|livenotes|rentalcabbooking|whatsappapi|restaurant|ecom)/)
  
  if (productMatch) {
    const product = productMatch[1]
    try {
      // Try to import the product-specific theme store
      return require(`./${product}/store/theme`).useThemeStore
    } catch {
      // Fallback to 60yard
      return useThemeStore
    }
  }
  
  // Check localStorage for selected product
  const selectedProduct = localStorage.getItem('selected_product') || localStorage.getItem('selected_product_slug')
  if (selectedProduct && selectedProduct !== '60yard') {
    try {
      return require(`./${selectedProduct}/store/theme`).useThemeStore
    } catch {
      // Fallback to 60yard
    }
  }
  
  // Default to 60yard
  return useThemeStore
}

function Root() {
  const ProductThemeStore = getProductStore()
  const mode = ProductThemeStore((s: any) => s.mode)
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
