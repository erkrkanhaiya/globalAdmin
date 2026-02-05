import { Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import { OAuth2Client } from 'google-auth-library'
import jwt from 'jsonwebtoken'
import { getUserModel, UserRole } from '../../auth/models/User.js'
import { CustomError } from "../../../../middleware/errorHandler.js'
import { AuthRequest } from "../../../../middleware/auth.js'
import { config } from '../../../config/env.js'
import { nanoid } from 'nanoid'

// Helper to get User model from request
const getUser = (req: any) => {
  const productConnection = req.productConnection
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

// @desc    Register customer (Email or Google)
// @route   POST /api/v1/user/auth/register
// @access  Public
export const registerCustomer = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { 
      name, 
      email, 
      password, 
      mobile, 
      countryCode, 
      googleIdToken, 
      source 
    } = req.body

    const authSource = source || 'web'
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
      const User = getUser(req)
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

          res.status(200).json({
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

    const User = getUser(req)
    const customer = await User.create(userData)

    // Generate token
    const token = generateToken((customer._id as mongoose.Types.ObjectId).toString(), customer.email, customer.role)

    res.status(201).json({
      status: 'success',
      message: googleIdToken ? 'Registered with Google successfully' : 'Registered successfully',
      data: {
        user: {
          id: customer._id,
          name: customer.name,
          email: customer.email,
          mobile: customer.mobile,
          role: customer.role,
          avatar: customer.avatar,
          authProvider: customer.authProvider,
          source: customer.source,
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

// @desc    Login user (Email/Mobile or Google)
// @route   POST /api/v1/user/auth/login
// @access  Public
export const loginUser = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, mobile, countryCode, password, googleIdToken } = req.body

    // Google Login
    if (googleIdToken) {
      const googleUser = await verifyGoogleToken(googleIdToken)

      // Find user by Google ID or email
      const User = getUser(req)
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
    const User = getUser(req)
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

// @desc    Request agent verification
// @route   POST /api/v1/user/agents/request-verification
// @access  Private (Agent)
export const requestAgentVerification = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const User = getUser(req)
    const user = await User.findById(req.user?.id)
    if (!user) {
      throw new CustomError('User not found', 404)
    }

    if (user.role !== 'agent' && user.role !== 'customer') {
      throw new CustomError('Only agents or customers can request verification', 400)
    }

    const { documents } = req.body

    if (!documents || documents.length === 0) {
      throw new CustomError('Verification documents are required', 400)
    }

    if (user.role === 'customer') {
      const agentCode = `AGT-${nanoid(8).toUpperCase()}`
      user.role = 'agent'
      user.metadata = {
        ...user.metadata,
        agentCode,
      }
    }

    user.verificationStatus = 'pending'
    user.isVerified = false
    user.verificationDocuments = documents
    user.verificationNotes = ''

    await user.save()

    res.status(200).json({
      status: 'success',
      message: 'Verification request submitted',
      data: {
        user: {
          id: user._id,
          role: user.role,
          verificationStatus: user.verificationStatus,
          agentCode: user.metadata?.agentCode,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Request doctor verification
// @route   POST /api/v1/user/doctors/request-verification
// @access  Private (Customer)
export const requestDoctorVerification = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const User = getUser(req)
    const user = await User.findById(req.user?.id)
    if (!user) {
      throw new CustomError('User not found', 404)
    }

    const { documents, licenseNumber, specialization } = req.body

    if (!documents || documents.length === 0) {
      throw new CustomError('Verification documents are required', 400)
    }

    if (!licenseNumber) {
      throw new CustomError('License number is required', 400)
    }

    user.role = 'doctor'
    user.verificationStatus = 'pending'
    user.isVerified = false
    user.verificationDocuments = documents
    user.metadata = {
      ...user.metadata,
      licenseNumber,
      specialization: specialization || '',
    }
    user.verificationNotes = ''

    await user.save()

    res.status(200).json({
      status: 'success',
      message: 'Doctor verification request submitted',
      data: {
        user: {
          id: user._id,
          role: user.role,
          verificationStatus: user.verificationStatus,
          licenseNumber: user.metadata?.licenseNumber,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get current user profile
// @route   GET /api/v1/user/profile
// @access  Private
export const getProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const User = getUser(req)
    const user = await User.findById(req.user?.id)
      .select('-password')
      .populate('verifiedBy', 'name email')
      .populate('parentId', 'name email')

    if (!user) {
      throw new CustomError('User not found', 404)
    }

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update profile
// @route   PATCH /api/v1/user/profile
// @access  Private
export const updateProfile = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, phone, avatar } = req.body

    const user = await User.findById(req.user?.id)
    if (!user) {
      throw new CustomError('User not found', 404)
    }

    if (name) user.name = name
    if (phone) user.phone = phone
    if (avatar) user.avatar = avatar

    await user.save()

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          avatar: user.avatar,
          role: user.role,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get verification status
// @route   GET /api/v1/user/verification/status
// @access  Private
export const getVerificationStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const User = getUser(req)
    const user = await User.findById(req.user?.id).select(
      'role verificationStatus isVerified verificationDocuments verificationNotes'
    )

    if (!user) {
      throw new CustomError('User not found', 404)
    }

    res.status(200).json({
      status: 'success',
      data: {
        role: user.role,
        verificationStatus: user.verificationStatus,
        isVerified: user.isVerified,
        documents: user.verificationDocuments,
        notes: user.verificationNotes,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Change password
// @route   PATCH /api/v1/user/change-password
// @access  Private
export const changePassword = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { oldPassword, newPassword } = req.body

    if (!oldPassword || !newPassword) {
      throw new CustomError('Old password and new password are required', 400)
    }

    if (newPassword.length < 6) {
      throw new CustomError('New password must be at least 6 characters', 400)
    }

    // Find user with password field
    const User = getUser(req)
    const user = await User.findById(req.user?.id).select('+password')

    if (!user) {
      throw new CustomError('User not found', 404)
    }

    // Check if user has a password (not Google auth only)
    if (!user.password) {
      throw new CustomError('Password change not available for Google authenticated accounts', 400)
    }

    // Verify old password
    const isPasswordValid = await user.comparePassword(oldPassword)
    if (!isPasswordValid) {
      throw new CustomError('Current password is incorrect', 401)
    }

    // Update password
    user.password = newPassword
    await user.save()

    res.status(200).json({
      status: 'success',
      message: 'Password updated successfully',
    })
  } catch (error) {
    next(error)
  }
}

