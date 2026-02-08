import { Request, Response, NextFunction } from 'express'
import { Product } from '../models/Product.js'
import { CustomError } from '@/middleware/errorHandler.js'
import { AuthRequest } from '@/middleware/auth.js'

/**
 * @desc    Get all products (filtered by admin's assigned products)
 * @route   GET /api/v1/products
 * @access  Private (Admin)
 */
export const getProducts = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get user's assigned products from main database (not product-specific)
    // User data is stored in the main database
    let assignedProducts: string[] | null = null
    
    if (req.user?.id) {
      // Import User model from main database connection
      const mongoose = await import('mongoose')
      const { User } = await import('@/modules/auth/models/User.js')
      
      // Use default mongoose connection (main database)
      const user = await User.findById(req.user.id).select('assignedProducts role')
      
      // Super admin or admin with no assignedProducts = access to all products
      if (user && (user.role === 'super_admin' || !user.assignedProducts || user.assignedProducts.length === 0)) {
        assignedProducts = null // null means all products
      } else if (user?.assignedProducts && user.assignedProducts.length > 0) {
        assignedProducts = user.assignedProducts
      }
    }

    // Build query
    const query: any = { isActive: true }
    
    // If admin has specific product assignments, filter by them
    if (assignedProducts && assignedProducts.length > 0) {
      query.slug = { $in: assignedProducts }
    }

    const products = await Product.find(query).sort({ name: 1 })

    res.status(200).json({
      status: 'success',
      data: {
        products,
        // Include info about admin's access
        accessInfo: {
          hasAllAccess: assignedProducts === null || assignedProducts.length === 0,
          assignedProducts: assignedProducts || [],
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Get single product
 * @route   GET /api/v1/products/:slug
 * @access  Private (Admin)
 */
export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { slug } = req.params

    const product = await Product.findOne({ slug, isActive: true })

    if (!product) {
      throw new CustomError('Product not found', 404)
    }

    res.status(200).json({
      status: 'success',
      data: {
        product,
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Create product
 * @route   POST /api/v1/products
 * @access  Private (Super Admin)
 */
export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, slug, displayName, description, icon, color, databaseName } = req.body

    // Check if product already exists
    const existingProduct = await Product.findOne({
      $or: [{ slug }, { databaseName }],
    })

    if (existingProduct) {
      throw new CustomError('Product with this slug or database name already exists', 400)
    }

    const product = await Product.create({
      name,
      slug,
      displayName,
      description,
      icon,
      color,
      databaseName,
    })

    res.status(201).json({
      status: 'success',
      data: {
        product,
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Update product
 * @route   PUT /api/v1/products/:id
 * @access  Private (Super Admin)
 */
export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params
    const { name, displayName, description, icon, color, isActive } = req.body

    const product = await Product.findByIdAndUpdate(
      id,
      {
        name,
        displayName,
        description,
        icon,
        color,
        isActive,
      },
      {
        new: true,
        runValidators: true,
      }
    )

    if (!product) {
      throw new CustomError('Product not found', 404)
    }

    res.status(200).json({
      status: 'success',
      data: {
        product,
      },
    })
  } catch (error) {
    next(error)
  }
}
