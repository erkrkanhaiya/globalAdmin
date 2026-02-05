export default function GoalsCard() {
  return (
    <div className="surface goals">
      <div className="title">Goals</div>
      <div style={{ display:'grid', placeItems:'center', marginTop:12 }}>
        <svg width="180" height="180" viewBox="0 0 180 180">
          <circle cx="90" cy="90" r="64" stroke="#e5e7eb" strokeWidth="20" fill="none" />
          <circle cx="90" cy="90" r="64" stroke="#2563eb" strokeWidth="20" fill="none" strokeDasharray="402" strokeDashoffset="160" strokeLinecap="round" />
          <circle cx="90" cy="90" r="64" stroke="#f59e0b" strokeWidth="20" fill="none" strokeDasharray="402" strokeDashoffset="300" strokeLinecap="round" />
          <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="18" fontWeight="800">32,021</text>
          <text x="50%" y="50%" dy="20" dominantBaseline="middle" textAnchor="middle" fontSize="12" fill="#667085">Total Income</text>
        </svg>
      </div>
      <div className="goals-metrics">
        <div className="metric"><span className="dot" style={{ background:'#2563eb' }} /> <div><div className="muted">$12,167</div><div className="muted" style={{ fontSize:12 }}>From January</div></div></div>
        <div className="metric"><span className="dot" style={{ background:'#f59e0b' }} /> <div><div className="muted">$14,900</div><div className="muted" style={{ fontSize:12 }}>From June</div></div></div>
      </div>
    </div>
  )
}

