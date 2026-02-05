import StatCard from '@/60yard/components/dashboard/StatCard'
import SalesAnalytics from '@/60yard/components/dashboard/SalesAnalytics'
import GoalsCard from '@/60yard/components/dashboard/GoalsCard'
import TransactionsTable from '@/60yard/components/dashboard/TransactionsTable'

export default function DashboardPage() {
  return (
    <div className="dash" style={{ padding: 16, display: 'grid', gap: 16 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div>
          <div className="title">Dashboard</div>
          <div className="muted">Welcome, Let’s dive into your personalized setup guide.</div>
        </div>
        <div className="toolbar">
          <button className="btn-primary">+ Add Property</button>
        </div>
      </div>

      <div className="grid grid-4">
        <StatCard label="No. Of Properties" value="2,454" delta="+7.0%" />
        <StatCard label="Register Agents" value="1,854" delta="+7.0%" />
        <StatCard label="Customers" value="2,454" delta="+7.0%" />
        <StatCard label="Revenue" value="$78.02M" delta="+9.0%" />
      </div>

      <div className="grid grid-2-1">
        <SalesAnalytics />
        <GoalsCard />
      </div>

      <TransactionsTable />
    </div>
  )
}

