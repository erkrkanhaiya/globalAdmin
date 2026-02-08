import { Response, NextFunction } from 'express'
import mongoose from 'mongoose'
import { getUserModel, UserRole } from '@/modules/auth/models/User.js' 
import { CustomError } from '@/middleware/errorHandler.js'
import { AuthRequest } from '@/middleware/auth.js'
import { nanoid } from 'nanoid'

// Helper to get User model from request
const getUser = (req: any) => {
  const productConnection = req.productConnection
  return getUserModel(productConnection)
}

// @desc    Get all users (Admin only)
// @route   GET /api/v1/admin/users
// @access  Private (Super Admin/Admin)
export const getAllUsers = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { role, status, search, page = 1, limit = 20 } = req.query

    const query: any = {}

    if (role) {
      query.role = role
    }

    if (status === 'active') {
      query.isActive = true
    } else if (status === 'inactive') {
      query.isActive = false
    }

    if (status === 'verified') {
      query.isVerified = true
    } else if (status === 'pending') {
      query.verificationStatus = 'pending'
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ]
    }

    const skip = (Number(page) - 1) * Number(limit)

    const User = getUser(req)
    const users = await User.find(query)
      .select('-password')
      .populate('verifiedBy', 'name email')
      .populate('parentId', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))

    const total = await User.countDocuments(query)

    res.status(200).json({
      status: 'success',
      data: {
        users,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit)),
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create agent (Admin only)
// @route   POST /api/v1/admin/agents
// @access  Private (Super Admin/Admin)
export const createAgent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, phone, password, agentCode } = req.body

    const User = getUser(req)
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw new CustomError('User with this email already exists', 400)
    }

    const code = agentCode || `AGT-${nanoid(8).toUpperCase()}`

    const agent = await User.create({
      name,
      email,
      phone,
      password,
      role: 'agent',
      isActive: true,
      isVerified: true,
      verificationStatus: 'approved',
      parentId: req.user?.id ? new mongoose.Types.ObjectId(req.user.id) : undefined,
      source: 'web',
      metadata: {
        agentCode: code,
      },
      verifiedBy: req.user?.id ? new mongoose.Types.ObjectId(req.user.id) : undefined,
      verifiedAt: new Date(),
    })

    res.status(201).json({
      status: 'success',
      data: {
        user: {
          id: agent._id,
          name: agent.name,
          email: agent.email,
          phone: agent.phone,
          role: agent.role,
          agentCode: agent.metadata?.agentCode,
          isVerified: agent.isVerified,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create admin user (Super Admin only)
// @route   POST /api/v1/admin/admins
// @access  Private (Super Admin only)
export const createAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, role, assignedProducts } = req.body

    // Only super admin can create admins
    if (req.user?.role !== 'super_admin') {
      throw new CustomError('Only super admin can create admin users', 403)
    }

    const User = getUser(req)
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      throw new CustomError('User with this email already exists', 400)
    }

    // Validate assignedProducts if provided
    if (assignedProducts && !Array.isArray(assignedProducts)) {
      throw new CustomError('assignedProducts must be an array of product slugs', 400)
    }

    // Create admin user
    const admin = await User.create({
      name,
      email,
      password,
      role: role || 'admin',
      isActive: true,
      isVerified: true,
      verificationStatus: 'approved',
      assignedProducts: assignedProducts || [], // Empty array = access to all products (super admin behavior)
      // If assignedProducts is provided, admin can only access those products
      source: 'web',
    })

    res.status(201).json({
      status: 'success',
      data: {
        user: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          assignedProducts: admin.assignedProducts || [],
          isActive: admin.isActive,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update admin's assigned products
// @route   PATCH /api/v1/admin/users/:id/products
// @access  Private (Super Admin only)
export const updateAdminProducts = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params
    const { assignedProducts } = req.body

    // Only super admin can update product assignments
    if (req.user?.role !== 'super_admin') {
      throw new CustomError('Only super admin can update product assignments', 403)
    }

    if (!Array.isArray(assignedProducts)) {
      throw new CustomError('assignedProducts must be an array of product slugs', 400)
    }

    const User = getUser(req)
    const user = await User.findById(id)
    if (!user) {
      throw new CustomError('User not found', 404)
    }

    // Only update for admin roles
    if (!['super_admin', 'admin', 'subadmin_support', 'subadmin_agent', 'subadmin_reseller', 'subadmin_marketing'].includes(user.role)) {
      throw new CustomError('Product assignments can only be updated for admin roles', 400)
    }

    user.assignedProducts = assignedProducts
    await user.save()

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          assignedProducts: user.assignedProducts || [],
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get user by ID
// @route   GET /api/v1/admin/users/:id
// @access  Private (Super Admin/Admin)
export const getUserById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params
    const User = getUser(req)
    const user = await User.findById(id)
      .select('-password')
      .populate('verifiedBy', 'name email')
      .populate('parentId', 'name email')

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
          phone: user.phone,
          avatar: user.avatar,
          isActive: user.isActive,
          isVerified: user.isVerified,
          verificationStatus: user.verificationStatus,
          assignedProducts: user.assignedProducts || [],
          createdAt: user.createdAt,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update user role (Super Admin only)
// @route   PATCH /api/v1/admin/users/:id/role
// @access  Private (Super Admin only)
export const updateUserRole = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params
    const { role } = req.body

    if (!role || !['super_admin', 'admin', 'subadmin_support', 'subadmin_agent', 'subadmin_reseller', 'subadmin_marketing', 'agent', 'doctor', 'customer'].includes(role)) {
      throw new CustomError('Invalid role', 400)
    }

    const User = getUser(req)
    const user = await User.findById(id)
    if (!user) {
      throw new CustomError('User not found', 404)
    }

    user.role = role as UserRole
    await user.save()

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update user status
// @route   PATCH /api/v1/admin/users/:id/status
// @access  Private (Super Admin/Admin)
export const updateUserStatus = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params
    const { isActive } = req.body

    const User = getUser(req)
    const user = await User.findById(id)
    if (!user) {
      throw new CustomError('User not found', 404)
    }

    user.isActive = isActive !== undefined ? isActive : user.isActive
    await user.save()

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isActive: user.isActive,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Verify agent/doctor
// @route   POST /api/v1/admin/users/:id/verify
// @access  Private (Super Admin/Admin)
export const verifyUser = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params
    const { status, notes } = req.body

    if (!status || !['approved', 'rejected'].includes(status)) {
      throw new CustomError('Status must be approved or rejected', 400)
    }

    const User = getUser(req)
    const user = await User.findById(id)
    if (!user) {
      throw new CustomError('User not found', 404)
    }

    user.verificationStatus = status
    user.isVerified = status === 'approved'
    user.verifiedBy = req.user?.id ? new mongoose.Types.ObjectId(req.user.id) : undefined
    user.verifiedAt = new Date()
    if (notes) {
      user.verificationNotes = notes
    }

    await user.save()

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          isVerified: user.isVerified,
          verificationStatus: user.verificationStatus,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Convert customer to agent
// @route   POST /api/v1/admin/users/:id/convert-to-agent
// @access  Private (Super Admin/Admin)
export const convertToAgent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params
    const { agentCode } = req.body

    const User = getUser(req)
    const user = await User.findById(id)
    if (!user) {
      throw new CustomError('User not found', 404)
    }

    if (user.role === 'agent') {
      throw new CustomError('User is already an agent', 400)
    }

    const code = agentCode || `AGT-${nanoid(8).toUpperCase()}`

    user.role = 'agent'
    user.isVerified = true
    user.verificationStatus = 'approved'
    user.verifiedBy = req.user?.id ? new mongoose.Types.ObjectId(req.user.id) : undefined
    user.verifiedAt = new Date()
    user.metadata = {
      ...user.metadata,
      agentCode: code,
    }

    await user.save()

    res.status(200).json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          agentCode: user.metadata?.agentCode,
          isVerified: user.isVerified,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}