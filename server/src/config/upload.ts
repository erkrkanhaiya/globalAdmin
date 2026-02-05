import multer from 'multer'
import path from 'path'
import { nanoid } from 'nanoid'
import { config } from './env.js'

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.UPLOAD_PATH || './uploads')
  },
  filename: (req, file, cb) => {
    const uniqueName = `${nanoid()}-${Date.now()}${path.extname(file.originalname)}`
    cb(null, uniqueName)
  },
})

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = (config.ALLOWED_FILE_TYPES || 'jpg,jpeg,png,gif,pdf,doc,docx')
    .split(',')
    .map((type) => type.trim())

  const ext = path.extname(file.originalname).toLowerCase().replace('.', '')

  if (allowedTypes.includes(ext)) {
    cb(null, true)
  } else {
    cb(new Error(`File type .${ext} is not allowed. Allowed types: ${allowedTypes.join(', ')}`))
  }
}

export const upload = multer({
  storage,
  limits: {
    fileSize: config.MAX_FILE_SIZE || 5 * 1024 * 1024, // 5MB default
  },
  fileFilter,
})

export const uploadSingle = (fieldName: string) => upload.single(fieldName)
export const uploadMultiple = (fieldName: string, maxCount: number = 10) =>
  upload.array(fieldName, maxCount)
export const uploadFields = (fields: multer.Field[]) => upload.fields(fields)

