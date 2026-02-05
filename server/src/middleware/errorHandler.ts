import { Request, Response, NextFunction } from 'express'

export interface AppError extends Error {
  statusCode?: number
  status?: string
  isOperational?: boolean
}

export class CustomError extends Error implements AppError {
  statusCode: number
  status: string
  isOperational: boolean

  constructor(message: string, statusCode: number = 500) {
    super(message)
    this.statusCode = statusCode
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    this.isOperational = true

    Error.captureStackTrace(this, this.constructor)
  }
}

export const errorHandler = (
  err: AppError | any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Handle JSON parsing errors
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid JSON format. Please check your request body.',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    })
    return
  }

  // Handle express-validator errors
  if (err.type === 'entity.parse.failed') {
    res.status(400).json({
      status: 'fail',
      message: 'Invalid JSON format. Please check your request body.',
    })
    return
  }

  const statusCode = err.statusCode || 500
  const status = err.status || 'error'

  res.status(statusCode).json({
    status,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

export const notFoundHandler = (req: Request, res: Response, next: NextFunction): void => {
  const err = new CustomError(`Route ${req.originalUrl} not found`, 404)
  next(err)
}

