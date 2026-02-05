import { FormEvent, useState } from 'react'
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom'
import { loginApi } from '@/rentalcabbooking/api/auth'
import { useAuthStore } from '@/rentalcabbooking/store/auth'
import Logo from '../assets/logo.svg'
import ContentIllus from '../assets/content.svg'
import SalesCard from '../assets/sales.svg'

export default function LoginPage() {
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('admin123')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const login = useAuthStore(s => s.login)
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const navigate = useNavigate()
  const location = useLocation() as any

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/rentalcabbooking/dashboard" replace />
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { user, token } = await loginApi({ email, password })
      login({ user, token }); localStorage.setItem('selected_product', 'rentalcabbooking'); localStorage.setItem('selected_product_slug', 'rentalcabbooking')
      const dest = location.state?.from?.pathname || '/rentalcabbooking/dashboard'
      navigate(dest, { replace: true })
    } catch (err: any) {
      setError(err?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth">
      <div className="auth-left">
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div className="brand">
            <img src={Logo} alt="logo" width={32} height={32} />
            <span>Rental Cab</span>
          </div>
        </div>

        <div style={{ display:'grid', placeContent:'center' }}>
          <div className="auth-card">
            <div className="auth-title" style={{ color: '#FFFFFF', fontWeight: 600, fontSize: '24px' }}>Log in to Rental Cab</div>
            <div className="auth-socials">
              <button type="button" className="social-btn"><span>G</span> Sign in with Google</button>
              <button type="button" className="social-btn"><span></span> Sign in with Apple</button>
            </div>
            <div className="auth-sep">Or</div>

            <form onSubmit={onSubmit} style={{ display:'grid', gap:12 }}>
              <div className="form-row">
                <label className="form-hint">Email</label>
                <input className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <div className="form-row">
                <label className="form-hint">Password</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    className="input" 
                    type={showPassword ? 'text' : 'password'} 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    placeholder="Min. 8 Character"
                    style={{ paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-dim)',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px'
                    }}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>
              <div className="form-inline">
                <label style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <input type="checkbox" /> Remember password
                </label>
                <Link to="#" className="ghost-link">Forgot Password</Link>
              </div>
              {error && <div style={{ color: 'var(--danger)', fontSize: 14 }}>{error}</div>}
              <button className="auth-submit" disabled={loading}>{loading ? 'Signing in…' : 'Sign in'}</button>
              <div className="auth-meta">Don't Have an account? <Link to="#">Sign Up</Link></div>
            </form>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="hero">
          <h1>Welcome to Rental Cab</h1>
          <p>Manage your cab bookings and fleet operations with ease and efficiency.</p>
          <div className="hero-illus">
            <img src={ContentIllus} alt="dashboard preview" className="illus-bg" />
            <img src={SalesCard} alt="sales analytics" className="illus-card" />
          </div>
        </div>
      </div>
    </div>
  )
}
