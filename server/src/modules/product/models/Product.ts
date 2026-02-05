import mongoose, { Schema, Document } from 'mongoose'

export interface IProduct extends Document {
  name: string
  slug: string // restaurant, livenotes, rentalcabbooking, etc.
  displayName: string
  description?: string
  icon?: string
  color?: string
  databaseName: string // Separate database for each product
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      unique: true,
    },
    slug: {
      type: String,
      required: [true, 'Product slug is required'],
      unique: true,
      lowercase: true,
      match: [/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'],
    },
    displayName: {
      type: String,
      required: [true, 'Display name is required'],
    },
    description: {
      type: String,
    },
    icon: {
      type: String,
    },
    color: {
      type: String,
      default: '#6366f1',
    },
    databaseName: {
      type: String,
      required: [true, 'Database name is required'],
      unique: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

export const Product = mongoose.model<IProduct>('Product', ProductSchema)
