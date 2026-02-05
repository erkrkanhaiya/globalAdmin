import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import NotFoundPage from './60yard/pages/NotFoundPage'

// 60yard routes
import ProtectedRoute60yard from './60yard/routes/ProtectedRoute'
import AppLayout60yard from './60yard/components/AppLayout'
import DashboardPage60yard from './60yard/pages/DashboardPage'
import LoginPage60yard from './60yard/pages/LoginPage'
import UsersPage60yard from './60yard/pages/UsersPage'
import SettingsPage60yard from './60yard/pages/SettingsPage'
import DiscoverPage60yard from './60yard/pages/DiscoverPage'
import PropertyPage60yard from './60yard/pages/PropertyPage'
import PropertyDetailPage60yard from './60yard/pages/PropertyDetailPage'
import AgentsPage60yard from './60yard/pages/AgentsPage'
import AgentDetailPage60yard from './60yard/pages/AgentDetailPage'
import AddAgentPage60yard from './60yard/pages/AddAgentPage'
import CustomerPage60yard from './60yard/pages/CustomerPage'
import CustomerDetailPage60yard from './60yard/pages/CustomerDetailPage'
import SupportPage60yard from './60yard/pages/SupportPage'
import SupportDetailPage60yard from './60yard/pages/SupportDetailPage'
import AnalyticsPage60yard from './60yard/pages/AnalyticsPage'
import OrdersPage60yard from './60yard/pages/OrdersPage'
import TransactionPage60yard from './60yard/pages/TransactionPage'
import InboxPage60yard from './60yard/pages/InboxPage'
import CalendarPage60yard from './60yard/pages/CalendarPage'
import AuctionRequestsPage60yard from './60yard/pages/AuctionRequestsPage'
import SubmitAuctionPage60yard from './60yard/pages/SubmitAuctionPage'

// CRM routes
import ProtectedRouteCrm from './crm/routes/ProtectedRoute'
import AppLayoutCrm from './crm/components/AppLayout'
import DashboardPageCrm from './crm/pages/DashboardPage'
import LoginPageCrm from './crm/pages/LoginPage'
import UsersPageCrm from './crm/pages/UsersPage'
import SettingsPageCrm from './crm/pages/SettingsPage'

// LiveNotes routes
import ProtectedRouteLivenotes from './livenotes/routes/ProtectedRoute'
import AppLayoutLivenotes from './livenotes/components/AppLayout'
import DashboardPageLivenotes from './livenotes/pages/DashboardPage'
import LoginPageLivenotes from './livenotes/pages/LoginPage'

// Rental Cab routes
import ProtectedRouteRentalcab from './rentalcabbooking/routes/ProtectedRoute'
import AppLayoutRentalcab from './rentalcabbooking/components/AppLayout'
import DashboardPageRentalcab from './rentalcabbooking/pages/DashboardPage'
import LoginPageRentalcab from './rentalcabbooking/pages/LoginPage'

// WhatsApp API routes
import ProtectedRouteWhatsapp from './whatsappapi/routes/ProtectedRoute'
import AppLayoutWhatsapp from './whatsappapi/components/AppLayout'
import DashboardPageWhatsapp from './whatsappapi/pages/DashboardPage'
import LoginPageWhatsapp from './whatsappapi/pages/LoginPage'

// Restaurant routes
import ProtectedRouteRestaurant from './restaurant/routes/ProtectedRoute'
import AppLayoutRestaurant from './restaurant/components/AppLayout'
import DashboardPageRestaurant from './restaurant/pages/DashboardPage'
import LoginPageRestaurant from './restaurant/pages/LoginPage'

// Ecom routes
import ProtectedRouteEcom from './ecom/routes/ProtectedRoute'
import AppLayoutEcom from './ecom/components/AppLayout'
import DashboardPageEcom from './ecom/pages/DashboardPage'
import LoginPageEcom from './ecom/pages/LoginPage'
import UsersPageEcom from './ecom/pages/UsersPage'
import SettingsPageEcom from './ecom/pages/SettingsPage'

// Component to update title and favicon based on route
function ProductMetaUpdater() {
  const location = useLocation()
  
  useEffect(() => {
    const path = location.pathname
    const productMatch = path.match(/\/(60yard|crm|livenotes|rentalcabbooking|whatsappapi|restaurant|ecom)/)
    const selectedProduct = localStorage.getItem('selected_product') || localStorage.getItem('selected_product_slug')
    
    let product = productMatch ? productMatch[1] : selectedProduct || '60yard'
    
    // Product configuration
    const productConfig: Record<string, { title: string; favicon: string }> = {
      '60yard': { title: '60Yard Admin', favicon: '/src/60yard/assets/logo.svg' },
      'crm': { title: 'CRM Admin', favicon: '/src/crm/assets/logo.svg' },
      'livenotes': { title: 'LiveNotes Admin', favicon: '/src/livenotes/assets/logo.svg' },
      'rentalcabbooking': { title: 'Rental Cab Admin', favicon: '/src/rentalcabbooking/assets/logo.svg' },
      'whatsappapi': { title: 'WhatsApp API Admin', favicon: '/src/whatsappapi/assets/logo.svg' },
      'restaurant': { title: 'Restaurant Admin', favicon: '/src/restaurant/assets/logo.svg' },
      'ecom': { title: 'Ecom Admin', favicon: '/src/ecom/assets/logo.svg' },
    }
    
    const config = productConfig[product] || productConfig['60yard']
    
    // Update document title
    document.title = config.title
    
    // Update favicon
    let favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement
    if (!favicon) {
      favicon = document.createElement('link')
      favicon.rel = 'icon'
      favicon.type = 'image/svg+xml'
      document.head.appendChild(favicon)
    }
    favicon.href = config.favicon
  }, [location.pathname])
  
  return null
}

export default function App() {
  return (
    <>
      <ProductMetaUpdater />
      <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Product-specific login pages */}
      <Route path="/60yard/login" element={<LoginPage60yard />} />
      <Route path="/crm/login" element={<LoginPageCrm />} />
      <Route path="/livenotes/login" element={<LoginPageLivenotes />} />
      <Route path="/rentalcabbooking/login" element={<LoginPageRentalcab />} />
      <Route path="/whatsappapi/login" element={<LoginPageWhatsapp />} />
      <Route path="/restaurant/login" element={<LoginPageRestaurant />} />
      <Route path="/ecom/login" element={<LoginPageEcom />} />
      
      {/* Default login redirects to 60yard */}
      <Route path="/login" element={<Navigate to="/60yard/login" replace />} />

      {/* 60yard routes */}
      <Route element={<ProtectedRoute60yard />}>
        <Route element={<AppLayout60yard />}>
          <Route path="/60yard/dashboard" element={<DashboardPage60yard />} />
          <Route path="/60yard/discover" element={<DiscoverPage60yard />} />
          <Route path="/60yard/property" element={<PropertyPage60yard />} />
          <Route path="/60yard/property/:id" element={<PropertyDetailPage60yard />} />
          <Route path="/60yard/agents" element={<AgentsPage60yard />} />
          <Route path="/60yard/agents/new" element={<AddAgentPage60yard />} />
          <Route path="/60yard/agents/:id" element={<AgentDetailPage60yard />} />
          <Route path="/60yard/customer" element={<CustomerPage60yard />} />
          <Route path="/60yard/customer/:id" element={<CustomerDetailPage60yard />} />
          <Route path="/60yard/support" element={<SupportPage60yard />} />
          <Route path="/60yard/support/:id" element={<SupportDetailPage60yard />} />
          <Route path="/60yard/analytics" element={<AnalyticsPage60yard />} />
          <Route path="/60yard/orders" element={<OrdersPage60yard />} />
          <Route path="/60yard/transaction" element={<TransactionPage60yard />} />
          <Route path="/60yard/inbox" element={<InboxPage60yard />} />
          <Route path="/60yard/calendar" element={<CalendarPage60yard />} />
          <Route path="/60yard/users" element={<UsersPage60yard />} />
          <Route path="/60yard/settings" element={<SettingsPage60yard />} />
          <Route path="/60yard/auction-requests" element={<AuctionRequestsPage60yard />} />
          <Route path="/60yard/submit-auction" element={<SubmitAuctionPage60yard />} />
        </Route>
      </Route>

      {/* CRM routes */}
      <Route element={<ProtectedRouteCrm />}>
        <Route element={<AppLayoutCrm />}>
          <Route path="/crm/dashboard" element={<DashboardPageCrm />} />
          <Route path="/crm/users" element={<UsersPageCrm />} />
          <Route path="/crm/settings" element={<SettingsPageCrm />} />
        </Route>
      </Route>

      {/* LiveNotes routes */}
      <Route element={<ProtectedRouteLivenotes />}>
        <Route element={<AppLayoutLivenotes />}>
          <Route path="/livenotes/dashboard" element={<DashboardPageLivenotes />} />
        </Route>
      </Route>

      {/* Rental Cab routes */}
      <Route element={<ProtectedRouteRentalcab />}>
        <Route element={<AppLayoutRentalcab />}>
          <Route path="/rentalcabbooking/dashboard" element={<DashboardPageRentalcab />} />
        </Route>
      </Route>

      {/* WhatsApp API routes */}
      <Route element={<ProtectedRouteWhatsapp />}>
        <Route element={<AppLayoutWhatsapp />}>
          <Route path="/whatsappapi/dashboard" element={<DashboardPageWhatsapp />} />
        </Route>
      </Route>

      {/* Restaurant routes */}
      <Route element={<ProtectedRouteRestaurant />}>
        <Route element={<AppLayoutRestaurant />}>
          <Route path="/restaurant/dashboard" element={<DashboardPageRestaurant />} />
        </Route>
      </Route>

      {/* Ecom routes */}
      <Route element={<ProtectedRouteEcom />}>
        <Route element={<AppLayoutEcom />}>
          <Route path="/ecom/dashboard" element={<DashboardPageEcom />} />
          <Route path="/ecom/users" element={<UsersPageEcom />} />
          <Route path="/ecom/settings" element={<SettingsPageEcom />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}
