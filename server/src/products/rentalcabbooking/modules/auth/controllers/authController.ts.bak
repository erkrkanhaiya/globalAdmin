import { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import { body } from 'express-validator'
import { User } from '../models/User.js'
import { config } from '../../../config/env.js'
import { CustomError } from "../../../../middleware/errorHandler.js'
import { AuthRequest } from "../../../../middleware/auth.js'

// Generate JWT Token
const generateToken = (id: string, email: string, role: string): string => {
  return jwt.sign({ id, email, role }, config.JWT_SECRET as string, {
    expiresIn: config.JWT_EXPIRE,
  } as jwt.SignOptions)
}

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, role } = req.body

    // Check if user exists
    const userExists = await User.findOne({ email })
    if (userExists) {
      throw new CustomError('User already exists', 400)
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: role || 'user',
    })

    // Generate token
    const token = generateToken((user._id as mongoose.Types.ObjectId).toString(), user.email, user.role)

    res.status(201).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
        accessToken: {
          token,
          expiresIn: config.JWT_EXPIRE,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body

    // Validate email & password
    if (!email || !password) {
      throw new CustomError('Please provide email and password', 400)
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password')

    if (!user || !(await user.comparePassword(password))) {
      throw new CustomError('Invalid credentials', 401)
    }

    // Check if user is active
    if (!user.isActive) {
      throw new CustomError('Your account has been deactivated', 401)
    }

    // Update last login
    user.lastLogin = new Date()
    await user.save({ validateBeforeSave: false })

    // Generate token
    const token = generateToken((user._id as mongoose.Types.ObjectId).toString(), user.email, user.role)

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
        accessToken: {
          token,
          expiresIn: config.JWT_EXPIRE,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get current user
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.user?.id)

    if (!user) {
      throw new CustomError('User not found', 404)
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

// Validation rules
export const validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['admin', 'manager', 'user']).withMessage('Invalid role'),
]

export const validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
]

