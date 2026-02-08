import { Response, NextFunction } from 'express'
import { Agent } from '@/modules/agent/models/Agent.js'
import { CustomError } from "@/middleware/errorHandler.js"
import { AuthRequest } from "@/middleware/auth.js"

// @desc    Get all agents (Admin)
// @route   GET /api/v1/admin/agents
// @access  Private (Admin)
export const getAllAgents = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query

    const query: any = {}

    if (status) query.status = status

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ]
    }

    const skip = (Number(page) - 1) * Number(limit)

    const agents = await Agent.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))

    const total = await Agent.countDocuments(query)

    res.status(200).json({
      status: 'success',
      data: {
        agents,
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

// @desc    Get agent by ID (Admin)
// @route   GET /api/v1/admin/agents/:id
// @access  Private (Admin)
export const getAgentById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const agent = await Agent.findById(req.params.id)

    if (!agent) {
      throw new CustomError('Agent not found', 404)
    }

    res.status(200).json({
      status: 'success',
      data: {
        agent,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create agent (Admin)
// @route   POST /api/v1/admin/agents
// @access  Private (Admin)
export const createAgent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const agent = await Agent.create(req.body)

    res.status(201).json({
      status: 'success',
      data: {
        agent,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update agent (Admin)
// @route   PUT /api/v1/admin/agents/:id
// @access  Private (Admin)
export const updateAgent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const agent = await Agent.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!agent) {
      throw new CustomError('Agent not found', 404)
    }

    res.status(200).json({
      status: 'success',
      data: {
        agent,
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete agent (Admin)
// @route   DELETE /api/v1/admin/agents/:id
// @access  Private (Admin)
export const deleteAgent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const agent = await Agent.findByIdAndDelete(req.params.id)

    if (!agent) {
      throw new CustomError('Agent not found', 404)
    }

    res.status(200).json({
      status: 'success',
      message: 'Agent deleted successfully',
    })
  } catch (error) {
    next(error)
  }
}

