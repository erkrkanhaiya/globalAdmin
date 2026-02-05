import { z } from 'zod'
import axios from 'axios'
import type { AuthUser } from '@/store/auth'

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

// Get API credentials from environment (for basic auth)
// Note: Basic Auth is required for public endpoints like login/register
const getApiCredentials = () => {
  // These should match your server's API_KEY and API_SECRET from server/.env
  // Check server/.env for actual values
  const apiKey = (import.meta as any).env?.VITE_API_KEY || 'your-api-key-here'
  const apiSecret = (import.meta as any).env?.VITE_API_SECRET || 'your-api-secret-here'
  
  // Create base64 encoded credentials for Basic Auth
  // Format: Basic base64(API_KEY:API_SECRET)
  const credentials = btoa(`${apiKey}:${apiSecret}`)
  return `Basic ${credentials}`
}

export async function loginApi(input: unknown): Promise<{ user: AuthUser; token: string }> {
  const { email, password } = LoginSchema.parse(input)

  try {
    // Call the actual server API endpoint
    const baseURL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5001/api/v1'
    const response = await axios.post(
      `${baseURL}/auth/login`,
      { email, password },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getApiCredentials(),
        },
      }
    )

    // Handle server response format
    if (response.data.status === 'success' && response.data.data) {
      const { user: serverUser, accessToken } = response.data.data
      
      // Extract token from accessToken object (new format) or fallback to direct token (backward compatibility)
      const token = typeof accessToken === 'object' && accessToken?.token 
        ? accessToken.token 
        : (accessToken || response.data.data.token)
      
      if (!token) {
        throw new Error('Token not found in server response')
      }
      
      // Transform server user to frontend AuthUser format
      const user: AuthUser = {
        id: serverUser.id || serverUser._id,
        name: serverUser.name,
        email: serverUser.email,
        role: serverUser.role,
        avatar: serverUser.avatar,
      }

      // Store token in localStorage
      localStorage.setItem('admin_token_v1', token)

      return { user, token }
    }

    throw new Error('Invalid response format from server')
  } catch (error: any) {
    // Handle different error types
    if (error.response) {
      // Server responded with error
      const message = error.response.data?.message || 
                     error.response.data?.error || 
                     'Login failed. Please check your credentials.'
      throw new Error(message)
    } else if (error.request) {
      // Request was made but no response
      throw new Error('Cannot connect to server. Please make sure the server is running.')
    } else {
      // Something else happened
      throw new Error(error.message || 'Login failed')
    }
  }
}

