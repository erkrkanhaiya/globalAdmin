import { Response, NextFunction } from 'express'
import { Property } from '@/modules/property/models/Property.js'
import { CustomError } from '@/middleware/errorHandler.js'
import { AuthRequest } from '@/middleware/auth.js'

// @desc    Get all properties (Admin)
// @route   GET /api/v1/admin/properties
// @access  Private (Admin)
export const getAllProperties = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, type, search, page = 1, limit = 20, sort = '-createdAt' } = req.query

    const query: any = {}

    if (status) query.status = status
    if (type) query.type = type

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
      ]
    }

    const skip = (Number(page) - 1) * Number(limit)

    const properties = await Property.find(query)
      .populate('agentId', 'name email phone')
      .sort(sort as string)
      .skip(skip)
      .limit(Number(limit))

    const total = await Property.countDocuments(query)

    res.status(200).json({
      status: 'success',
      data: {
        properties,
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

// @desc    Get property by ID (Admin)
// @route   GET /api/v1/admin/properties/:id
// @access  Private (Admin)
export const getPropertyById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const property = await Property.findById(req.params.id).populate('agentId', 'name email phone')

    if (!property) {
      throw new CustomError('Property not found', 404)
    }

    res.status(200).json({
      status: 'success',
      data: {
        property,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create property (Admin)
// @route   POST /api/v1/admin/properties
// @access  Private (Admin)
export const createProperty = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const property = await Property.create(req.body)

    res.status(201).json({
      status: 'success',
      data: {
        property,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update property (Admin)
// @route   PUT /api/v1/admin/properties/:id
// @access  Private (Admin)
export const updateProperty = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!property) {
      throw new CustomError('Property not found', 404)
    }

    res.status(200).json({
      status: 'success',
      data: {
        property,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete property (Admin)
// @route   DELETE /api/v1/admin/properties/:id
// @access  Private (Admin)
export const deleteProperty = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id)

    if (!property) {
      throw new CustomError('Property not found', 404)
    }

    res.status(200).json({
      status: 'success',
      message: 'Property deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}

