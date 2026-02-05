import { Response, NextFunction } from 'express'
import { Property } from '../models/Property.js'
import { CustomError } from "../../../../middleware/errorHandler.js'
import { AuthRequest } from "../../../../middleware/auth.js'

// @desc    Get all properties
// @route   GET /api/v1/properties
// @access  Private
export const getProperties = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, type, search, page = 1, limit = 10, sort = '-createdAt' } = req.query

    const query: any = {}

    if (status) {
      query.status = status
    }

    if (type) {
      query.type = type
    }

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

// @desc    Get single property
// @route   GET /api/v1/properties/:id
// @access  Private
export const getProperty = async (
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

// @desc    Create property
// @route   POST /api/v1/properties
// @access  Private (Admin/Manager)
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

// @desc    Update property
// @route   PUT /api/v1/properties/:id
// @access  Private (Admin/Manager)
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

// @desc    Delete property
// @route   DELETE /api/v1/properties/:id
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

