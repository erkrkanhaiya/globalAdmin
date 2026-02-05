import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div style={{ display: 'grid', placeItems: 'center', height: '100vh', gap: 8 }}>
      <div style={{ fontSize: 72, fontWeight: 800 }}>404</div>
      <div style={{ color: 'var(--text-dim)' }}>Page not found</div>
      <Link className="btn" to="/dashboard">Go to dashboard</Link>
    </div>
  )
}

