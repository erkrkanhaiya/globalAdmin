import { Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './routes/ProtectedRoute'
import AppLayout from './components/AppLayout'
import DashboardPage from './pages/DashboardPage'
import UsersPage from './pages/UsersPage'
import SettingsPage from './pages/SettingsPage'
import LoginPage from './pages/LoginPage'
import NotFoundPage from './pages/NotFoundPage'
import DiscoverPage from './pages/DiscoverPage'
import PropertyPage from './pages/PropertyPage'
import PropertyDetailPage from './pages/PropertyDetailPage'
import AgentsPage from './pages/AgentsPage'
import AgentDetailPage from './pages/AgentDetailPage'
import AddAgentPage from './pages/AddAgentPage'
import CustomerPage from './pages/CustomerPage'
import CustomerDetailPage from './pages/CustomerDetailPage'
import SupportPage from './pages/SupportPage'
import SupportDetailPage from './pages/SupportDetailPage'
import AnalyticsPage from './pages/AnalyticsPage'
import OrdersPage from './pages/OrdersPage'
import TransactionPage from './pages/TransactionPage'
import InboxPage from './pages/InboxPage'
import CalendarPage from './pages/CalendarPage'
import AuctionRequestsPage from './pages/AuctionRequestsPage'
import SubmitAuctionPage from './pages/SubmitAuctionPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}> 
        <Route element={<AppLayout />}> 
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/property" element={<PropertyPage />} />
          <Route path="/property/:id" element={<PropertyDetailPage />} />
          <Route path="/agents" element={<AgentsPage />} />
          <Route path="/agents/new" element={<AddAgentPage />} />
          <Route path="/agents/:id" element={<AgentDetailPage />} />
          <Route path="/customer" element={<CustomerPage />} />
          <Route path="/customer/:id" element={<CustomerDetailPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/support/:id" element={<SupportDetailPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/transaction" element={<TransactionPage />} />
          <Route path="/inbox" element={<InboxPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/auction-requests" element={<AuctionRequestsPage />} />
          <Route path="/submit-auction" element={<SubmitAuctionPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

