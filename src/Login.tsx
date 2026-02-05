import { FormEvent, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Logo from '@/assets/logo.svg'
import ContentIllus from '@/assets/content.svg'
import SalesCard from '@/assets/sales.svg'

// Product configuration
const PRODUCTS = [
  { 
    slug: '60yard', 
    name: '60Yard', 
    description: 'Property Management System',
    icon: '🏠',
    color: '#6c8cff'
  },
  { 
    slug: 'crm', 
    name: 'CRM', 
    description: 'Customer Relationship Management',
    icon: '📊',
    color: '#4dd9a7'
  },
  { 
    slug: 'livenotes', 
    name: 'LiveNotes', 
    description: 'Note Taking & Collaboration',
    icon: '📝',
    color: '#ff6b6b'
  },
  { 
    slug: 'rentalcabbooking', 
    name: 'Rental Cab Booking', 
    description: 'Taxi & Cab Booking System',
    icon: '🚕',
    color: '#ffa500'
  },
  { 
    slug: 'whatsappapi', 
    name: 'WhatsApp API', 
    description: 'WhatsApp Integration & Messaging',
    icon: '💬',
    color: '#25d366'
  },
  { 
    slug: 'restaurant', 
    name: 'Restaurant', 
    description: 'Restaurant Management System',
    icon: '🍽️',
    color: '#ff6b6b'
  }
]

export default function Login() {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!selectedProduct) {
      setError('Please select a product first')
      return
    }

    setError(null)
    setLoading(true)
    
    try {
      // Dynamically import the auth API for the selected product
      const authModule = await import(`./${selectedProduct}/api/auth.js`)
      const { loginApi } = authModule
      
      // Login with product-specific API
      const { user, token } = await loginApi({ email, password })
      
      // Store product info and auth data
      localStorage.setItem('selected_product', selectedProduct)
      localStorage.setItem('selected_product_slug', selectedProduct)
      localStorage.setItem(`admin_token_${selectedProduct}`, token)
      localStorage.setItem(`admin_user_${selectedProduct}`, JSON.stringify(user))
      
      // Navigate to product dashboard
      navigate(`/${selectedProduct}/dashboard`)
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please check your credentials.')
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
            <span>60Yards</span>
          </div>
        </div>

        <div style={{ display:'grid', placeContent:'center' }}>
          <div className="auth-card">
            <div className="auth-title">
              {!selectedProduct ? 'Select Product & Login' : `Login to ${PRODUCTS.find(p => p.slug === selectedProduct)?.name}`}
            </div>
            
            {!selectedProduct ? (
              <>
                <div style={{ marginBottom: 24 }}>
                  <p style={{ color: 'var(--text-dim)', marginBottom: 16, fontSize: 14 }}>
                    Choose a product to manage
                  </p>
                </div>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', 
                  gap: 12,
                  marginBottom: 24
                }}>
                  {PRODUCTS.map((product) => (
                    <div
                      key={product.slug}
                      onClick={() => setSelectedProduct(product.slug)}
                      style={{
                        background: 'var(--panel)',
                        borderRadius: 12,
                        padding: 20,
                        cursor: 'pointer',
                        border: '2px solid transparent',
                        transition: 'all 0.2s',
                        textAlign: 'center',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = product.color
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = `0 4px 12px ${product.color}20`
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'transparent'
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = 'none'
                      }}
                    >
                      <div style={{ fontSize: 40, marginBottom: 12 }}>
                        {product.icon}
                      </div>
                      <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>
                        {product.name}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>
                        {product.description}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* Selected Product Display */}
                <div style={{ 
                  background: 'var(--panel)', 
                  padding: 16, 
                  borderRadius: 12, 
                  marginBottom: 24,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  border: `2px solid ${PRODUCTS.find(p => p.slug === selectedProduct)?.color || 'var(--accent)'}`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 32 }}>
                      {PRODUCTS.find(p => p.slug === selectedProduct)?.icon}
                    </span>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 16 }}>
                        {PRODUCTS.find(p => p.slug === selectedProduct)?.name}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>
                        {PRODUCTS.find(p => p.slug === selectedProduct)?.description}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProduct(null)
                      setEmail('')
                      setPassword('')
                      setError(null)
                    }}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--border)',
                      borderRadius: 6,
                      padding: '6px 12px',
                      cursor: 'pointer',
                      fontSize: 12,
                      color: 'var(--text-dim)',
                    }}
                  >
                    Change
                  </button>
                </div>

                {/* Login Form */}
                <form onSubmit={onSubmit} style={{ display:'grid', gap:12 }}>
                  <div className="form-row">
                    <label className="form-hint">Email</label>
                    <input 
                      className="input" 
                      type="email" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)} 
                      placeholder="you@example.com" 
                      required
                      autoFocus
                    />
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
                        required
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
                    <a href="#" className="ghost-link" style={{ fontSize: 12 }}>Forgot Password</a>
                  </div>
                  {error && (
                    <div style={{ 
                      color: 'var(--danger)', 
                      fontSize: 14, 
                      padding: 12, 
                      background: 'rgba(255, 107, 107, 0.1)',
                      borderRadius: 8,
                      border: '1px solid rgba(255, 107, 107, 0.3)'
                    }}>
                      {error}
                    </div>
                  )}
                  <button 
                    className="auth-submit" 
                    disabled={loading}
                    style={{
                      background: PRODUCTS.find(p => p.slug === selectedProduct)?.color || 'var(--accent)',
                      opacity: loading ? 0.6 : 1,
                      cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {loading ? 'Signing in…' : `Sign in to ${PRODUCTS.find(p => p.slug === selectedProduct)?.name}`}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="hero">
          <h1>Let's begin your journey together</h1>
          <p>Manage all your products from a single platform. Select a product and get started.</p>
          <div className="hero-illus">
            <img src={ContentIllus} alt="dashboard preview" className="illus-bg" />
            <img src={SalesCard} alt="sales analytics" className="illus-card" />
          </div>
        </div>
      </div>
    </div>
  )
}
