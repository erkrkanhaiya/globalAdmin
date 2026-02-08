import { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import { OAuth2Client } from 'google-auth-library'
import jwt from 'jsonwebtoken'
import { getUserModel } from '@/products/livenotes/modules/auth/models/User.js'
import { CustomError } from "@/middleware/errorHandler.js"
import { config } from '@/config/env.js' 

// Helper to get User model from request
const getUser = (req: any) => {
  const productConnection = req.productConnection
  if (!productConnection) {
    throw new CustomError('Product connection not found', 500)
  }
  return getUserModel(productConnection)
}

// Initialize Google OAuth Client (only if configured)
const getGoogleClient = () => {
  if (!config.GOOGLE_CLIENT_ID) {
    return null
  }
  return new OAuth2Client(config.GOOGLE_CLIENT_ID)
}

// Generate JWT Token
const generateToken = (id: string, email: string, role: string): string => {
  return jwt.sign({ id, email, role }, config.JWT_SECRET as string, {
    expiresIn: config.JWT_EXPIRE,
  } as jwt.SignOptions)
}

// Verify Google ID Token
const verifyGoogleToken = async (idToken: string) => {
  const googleClient = getGoogleClient()
  if (!googleClient || !config.GOOGLE_CLIENT_ID) {
    throw new CustomError('Google OAuth is not configured. Please use email/password registration instead.', 400)
  }
  
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: config.GOOGLE_CLIENT_ID,
    })
    const payload = ticket.getPayload()
    if (!payload) {
      throw new CustomError('Invalid Google token', 401)
    }
    return {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    }
  } catch (error: any) {
    if (error instanceof CustomError) {
      throw error
    }
    throw new CustomError('Failed to verify Google token', 401)
  }
}

/**
 * @desc    Register user (Email/Password or Google Sign-In) - Mobile App API
 * @route   POST /api/v1/livenotes/auth/register
 * @access  Public (with Basic Auth)
 */
export const register = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const User = getUser(req)
    const { 
      name, 
      email, 
      password, 
      mobile, 
      countryCode, 
      googleIdToken, 
      source 
    } = req.body

    const authSource = source || 'mobile' // Default to mobile for mobile app API
    let userData: any = {
      name,
      email: email?.toLowerCase().trim(),
      role: 'customer',
      source: authSource === 'mobile' ? 'mobile' : 'web',
      isActive: true,
      isVerified: false,
      verificationStatus: 'pending',
    }

    // Google Sign-In
    if (googleIdToken) {
      const googleUser = await verifyGoogleToken(googleIdToken)
      
      // Check if user already exists with this email or Google ID
      const existingUser = await User.findOne({
        $or: [
          { email: googleUser.email },
          { googleId: googleUser.googleId }
        ]
      })

      if (existingUser) {
        // If user exists but doesn't have Google ID, link it
        if (existingUser.email === googleUser.email && !existingUser.googleId) {
          existingUser.googleId = googleUser.googleId
          existingUser.authProvider = 'google'
          if (googleUser.picture) existingUser.avatar = googleUser.picture
          await existingUser.save()

          const token = generateToken(
            (existingUser._id as mongoose.Types.ObjectId).toString(),
            existingUser.email,
            existingUser.role
          )

          return res.status(200).json({
            status: 'success',
            message: 'Google account linked successfully',
            data: {
              user: {
                id: existingUser._id,
                name: existingUser.name,
                email: existingUser.email,
                role: existingUser.role,
                avatar: existingUser.avatar,
                authProvider: existingUser.authProvider,
                mobile: existingUser.mobile,
                source: existingUser.source,
              },
              accessToken: {
                token,
                expiresIn: config.JWT_EXPIRE,
              },
            },
          })
        }

        // If user exists with Google ID, return error
        if (existingUser.googleId === googleUser.googleId) {
          throw new CustomError('User with this Google account already exists. Please login instead.', 400)
        }
      }

      userData.googleId = googleUser.googleId
      userData.authProvider = 'google'
      userData.name = name || googleUser.name
      userData.email = googleUser.email
      if (googleUser.picture) userData.avatar = googleUser.picture
      if (mobile && countryCode) {
        userData.mobile = {
          number: mobile,
          countryCode: countryCode || '+1',
        }
      }
    } else {
      // Email/Password Registration
      if (!email || !password) {
        throw new CustomError('Email and password are required', 400)
      }

      if (!name) {
        throw new CustomError('Full name is required', 400)
      }

      // Check if user already exists
      const existingUser = await User.findOne({ 
        $or: [
          { email: userData.email },
          { 'mobile.fullNumber': mobile && countryCode ? `${countryCode}${mobile}` : undefined }
        ].filter(Boolean)
      })

      if (existingUser) {
        throw new CustomError('User with this email or mobile already exists', 400)
      }

      userData.password = password
      userData.authProvider = 'email'
      
      if (mobile && countryCode) {
        userData.mobile = {
          number: mobile,
          countryCode: countryCode || '+1',
        }
      }
    }

    const user = await User.create(userData)

    // Generate token
    const token = generateToken((user._id as mongoose.Types.ObjectId).toString(), user.email, user.role)

    res.status(201).json({
      status: 'success',
      message: googleIdToken ? 'Registered with Google successfully' : 'Registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
          avatar: user.avatar,
          authProvider: user.authProvider,
          source: user.source,
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

/**
 * @desc    Login user (Email/Mobile or Google) - Mobile App API
 * @route   POST /api/v1/livenotes/auth/login
 * @access  Public (with Basic Auth)
 */
export const login = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const User = getUser(req)
    const { email, mobile, countryCode, password, googleIdToken } = req.body

    // Google Login
    if (googleIdToken) {
      const googleUser = await verifyGoogleToken(googleIdToken)

      // Find user by Google ID or email
      let user = await User.findOne({
        $or: [
          { googleId: googleUser.googleId },
          { email: googleUser.email }
        ]
      }).select('+password')

      if (!user) {
        throw new CustomError('No account found with this Google account. Please register first.', 404)
      }

      // If user exists with email but no Google ID, link it
      if (user.email === googleUser.email && !user.googleId) {
        user.googleId = googleUser.googleId
        user.authProvider = 'google'
        if (googleUser.picture && !user.avatar) {
          user.avatar = googleUser.picture
        }
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

      return res.status(200).json({
        status: 'success',
        message: 'Logged in successfully',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            role: user.role,
            avatar: user.avatar,
            authProvider: user.authProvider,
            source: user.source,
          },
          accessToken: {
            token,
            expiresIn: config.JWT_EXPIRE,
          },
        },
      })
    }

    // Email/Mobile Login
    if (!password) {
      throw new CustomError('Password is required', 400)
    }

    if (!email && !mobile) {
      throw new CustomError('Email or mobile number is required', 400)
    }

    // Build query for email or mobile
    let query: any = {}
    if (email) {
      query.email = email.toLowerCase().trim()
    } else if (mobile && countryCode) {
      query['mobile.fullNumber'] = `${countryCode}${mobile}`
    }

    // Find user
    const user = await User.findOne(query).select('+password')

    if (!user) {
      throw new CustomError('Invalid credentials', 401)
    }

    // Check if user is using email auth
    if (user.authProvider !== 'email') {
      throw new CustomError('Please use Google Sign-In to login', 400)
    }

    // Verify password
    if (!user.password || !(await user.comparePassword(password))) {
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
      message: 'Logged in successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          role: user.role,
          avatar: user.avatar,
          authProvider: user.authProvider,
          source: user.source,
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
