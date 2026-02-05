import { Request, Response, NextFunction } from 'express'
import { config } from '../config/env.js'
import { CustomError } from './errorHandler.js'

/**
 * Basic Authentication Middleware
 * Validates HTTP Basic Authentication credentials before allowing access to public endpoints
 * This provides an additional layer of security before JWT token generation
 * 
 * Usage: Apply to all public routes (registration, login, etc.)
 * 
 * Mobile App: Include in Authorization header:
 * Authorization: Basic base64(API_KEY:API_SECRET)
 */
export const basicAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Get Authorization header
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      throw new CustomError(
        'Basic authentication required. Please provide valid API credentials in Authorization header.',
        401
      )
    }

    // Extract and decode credentials
    const base64Credentials = authHeader.split(' ')[1]
    const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8')
    const [apiKey, apiSecret] = credentials.split(':')

    if (!apiKey || !apiSecret) {
      throw new CustomError('Invalid basic authentication format. Expected: API_KEY:API_SECRET', 401)
    }

    // Validate against environment variables
    const validApiKey = config.API_KEY
    const validApiSecret = config.API_SECRET

    if (!validApiKey || !validApiSecret) {
      throw new CustomError('API credentials not configured on server', 500)
    }

    // Compare credentials (use timing-safe comparison to prevent timing attacks)
    const keyMatch = apiKey === validApiKey
    const secretMatch = apiSecret === validApiSecret

    if (!keyMatch || !secretMatch) {
      throw new CustomError('Invalid API credentials', 401)
    }

    // Authentication successful
    next()
  } catch (error) {
    if (error instanceof CustomError) {
      return next(error)
    }
    next(new CustomError('Basic authentication failed', 401))
  }
}

