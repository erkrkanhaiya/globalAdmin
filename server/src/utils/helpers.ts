import { nanoid } from 'nanoid'
import { v4 as uuidv4 } from 'uuid'
import dayjs from 'dayjs'
import slugify from 'slugify'
import _ from 'lodash'

// ID Generation
export const generateId = (): string => nanoid()
export const generateUUID = (): string => uuidv4()

// Date handling
export const formatDate = (date: Date | string, format: string = 'YYYY-MM-DD'): string => {
  return dayjs(date).format(format)
}

export const addDays = (date: Date | string, days: number): Date => {
  return dayjs(date).add(days, 'day').toDate()
}

export const isExpired = (date: Date | string): boolean => {
  return dayjs(date).isBefore(dayjs())
}

// String utilities
export const createSlug = (text: string): string => {
  return slugify(text, { lower: true, strict: true })
}

export const truncate = (text: string, length: number = 100): string => {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

// Object utilities (using lodash)
export const pick = <T extends Record<string, any>>(
  object: T,
  keys: Array<keyof T>
): Partial<T> => {
  return _.pick(object, keys)
}

export const omit = <T extends Record<string, any>>(
  object: T,
  keys: Array<keyof T>
): Partial<T> => {
  return _.omit(object, keys)
}

// Validation helpers
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
  return phoneRegex.test(phone)
}

// Array utilities
export const paginate = <T>(array: T[], page: number, limit: number) => {
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  return {
    data: array.slice(startIndex, endIndex),
    pagination: {
      page,
      limit,
      total: array.length,
      pages: Math.ceil(array.length / limit),
    },
  }
}

// Error handling
export const asyncHandler = (fn: Function) => {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

