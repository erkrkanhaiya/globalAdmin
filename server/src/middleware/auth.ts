import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config/env.js'
import { CustomError } from './errorHandler.js'

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    role: string
  }
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1]
    }

    if (!token) {
      throw new CustomError(
        'No token provided. Please login and include a valid JWT token in the Authorization header as "Bearer <token>".',
        401
      )
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, config.JWT_SECRET as string) as {
        id: string
        email: string
        role: string
      }

      req.user = decoded
      next()
    } catch (error: any) {
      if (error.name === 'TokenExpiredError') {
        throw new CustomError('Token has expired. Please login again.', 401)
      } else if (error.name === 'JsonWebTokenError') {
        throw new CustomError('Invalid token. Please login again.', 401)
      }
      throw new CustomError('Not authorized to access this route', 401)
    }
  } catch (error) {
    next(error)
  }
}

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new CustomError('Not authorized to access this route', 401)
    }

    if (!roles.includes(req.user.role)) {
      throw new CustomError(
        `User role '${req.user.role}' is not authorized to access this route`,
        403
      )
    }

    next()
  }
}

