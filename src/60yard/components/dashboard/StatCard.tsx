type Props = {
  label: string
  icon?: React.ReactNode
  value: string
  delta?: string
}

export default function StatCard({ label, icon, value, delta }: Props) {
  return (
    <div className="surface stat-card">
      <div className="stat-label">
        {icon}
        <span>{label}</span>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:8 }}>
        <div className="stat-value">{value}</div>
        {delta && <span className="stat-delta">{delta}</span>}
      </div>
    </div>
  )
}

