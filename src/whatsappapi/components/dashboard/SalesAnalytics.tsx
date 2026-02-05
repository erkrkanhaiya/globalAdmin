export default function SalesAnalytics() {
  return (
    <div className="surface sales-card">
      <div className="sales-header">
        <div className="title">Sales Analytics</div>
        <select className="select" defaultValue="last-month">
          <option value="last-month">Last Month</option>
          <option value="this-month">This Month</option>
        </select>
      </div>
      <div style={{ height: 220, position: 'relative' }}>
        <svg viewBox="0 0 600 220" width="100%" height="220">
          <defs>
            <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff7a45" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#ff7a45" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polyline fill="url(#area)" stroke="#ff7a45" strokeWidth="2" points="0,180 60,150 120,160 180,120 240,140 300,90 360,130 420,150 480,120 540,150 600,140 600,220 0,220" />
          <polyline fill="none" stroke="#94a3b8" strokeWidth="2" points="0,190 60,185 120,187 180,180 240,182 300,170 360,185 420,190 480,182 540,188 600,190" />
        </svg>
        <div style={{ position:'absolute', right: 20, top: 12, display:'flex', gap:12, fontSize:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}><span style={{ width:10, height:10, borderRadius:999, background:'#ff7a45' }} /> Income $5,720.00</div>
          <div style={{ display:'flex', alignItems:'center', gap:6 }}><span style={{ width:10, height:10, borderRadius:999, background:'#64748b' }} /> Expenses $5,720.00</div>
        </div>
      </div>
    </div>
  )
}

