import { Request, Response, NextFunction } from 'express'
import { CustomError } from "@/middleware/errorHandler.js"
import { createNoteModel } from '@/products/livenotes/modules/notes/models/Note.js'

/**
 * @desc    Get all notes
 * @route   GET /api/v1/livenotes/notes
 * @access  Private
 */
export const getNotes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const productConnection = (req as any).productConnection
    const Note = createNoteModel(productConnection)
    
    const notes = await Note.find().sort({ createdAt: -1 })

    res.status(200).json({
      status: 'success',
      data: {
        notes,
      },
    })
  } catch (error) {
    next(error)
  }
}

/**
 * @desc    Create note
 * @route   POST /api/v1/livenotes/notes
 * @access  Private
 */
export const createNote = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const productConnection = (req as any).productConnection
    const Note = createNoteModel(productConnection)
    
    const note = await Note.create(req.body)

    res.status(201).json({
      status: 'success',
      data: {
        note,
      },
    })
  } catch (error) {
    next(error)
  }
}
