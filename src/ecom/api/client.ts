import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1/ecom',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const product = localStorage.getItem('selected_product') || 'ecom'
    const token = localStorage.getItem(`admin_token_${product}`) || localStorage.getItem('admin_token_v1')
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - server took too long to respond')
      return Promise.reject(new Error('Request timeout. Please try again.'))
    }
    
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      console.error('Network error - server is not reachable')
      return Promise.reject(new Error('Cannot connect to server. Please make sure the server is running on port 5001.'))
    }
    
    if (error.response) {
      const message = error.response.data?.message || 
                     error.response.data?.error || 
                     `Server error: ${error.response.status}`
      return Promise.reject(new Error(message))
    }
    
    if (error.request) {
      console.error('No response from server')
      return Promise.reject(new Error('No response from server. Please check if the server is running.'))
    }
    
    return Promise.reject(error)
  }
)

export function simulateNetwork<T>(data: T, delayMs = 400): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), delayMs))
}
