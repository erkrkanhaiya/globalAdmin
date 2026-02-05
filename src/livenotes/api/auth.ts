import { z } from 'zod'
import axios from 'axios'
import type { AuthUser } from '@/livenotes/store/auth'

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

const getApiCredentials = () => {
  const apiKey = import.meta.env.VITE_API_KEY || ''
  const apiSecret = import.meta.env.VITE_API_SECRET || ''
  const credentials = btoa(`${apiKey}:${apiSecret}`)
  return `Basic ${credentials}`
}

export async function loginApi(input: unknown): Promise<{ user: AuthUser; token: string }> {
  const { email, password } = LoginSchema.parse(input)

  try {
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1'
    const response = await axios.post(
      `${baseURL}/livenotes/auth/login`,
      { email, password },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': getApiCredentials(),
        },
      }
    )

    if (response.data.status === 'success' && response.data.data) {
      const { user: serverUser, accessToken } = response.data.data
      
      const token = typeof accessToken === 'object' && accessToken?.token 
        ? accessToken.token 
        : (accessToken || response.data.data.token)
      
      if (!token) {
        throw new Error('Token not found in server response')
      }
      
      const user: AuthUser = {
        id: serverUser.id || serverUser._id,
        name: serverUser.name,
        email: serverUser.email,
        role: serverUser.role,
        avatar: serverUser.avatar,
      }

      localStorage.setItem(`admin_token_${product}`, token)
      localStorage.setItem('admin_token_v1', token)

      return { user, token }
    }

    throw new Error('Invalid response format from server')
  } catch (error: any) {
    if (error.response) {
      const message = error.response.data?.message || 
                     error.response.data?.error || 
                     'Login failed. Please check your credentials.'
      throw new Error(message)
    } else if (error.request) {
      throw new Error('Cannot connect to server. Please make sure the server is running.')
    } else {
      throw new Error(error.message || 'Login failed')
    }
  }
}
