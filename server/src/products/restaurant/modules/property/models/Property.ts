import mongoose, { Schema, Document } from 'mongoose'

export interface IProperty extends Document {
  name: string
  description?: string
  type: 'house' | 'apartment' | 'condo' | 'villa' | 'other'
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  price: number
  priceRange?: string
  bedrooms: number
  bathrooms: number
  area: number
  areaUnit: 'sqft' | 'sqm'
  images: string[]
  status: 'available' | 'sold' | 'rented' | 'pending'
  agentId?: mongoose.Types.ObjectId
  features?: string[]
  rating?: number
  reviews?: number
  location?: {
    lat?: number
    lng?: number
  }
  createdAt: Date
  updatedAt: Date
}

const PropertySchema = new Schema<IProperty>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a property name'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: ['house', 'apartment', 'condo', 'villa', 'other'],
      required: true,
    },
    address: {
      type: String,
      required: [true, 'Please provide an address'],
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      default: 'USA',
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: 0,
    },
    priceRange: {
      type: String,
      default: '',
    },
    bedrooms: {
      type: Number,
      required: true,
      min: 0,
    },
    bathrooms: {
      type: Number,
      required: true,
      min: 0,
    },
    area: {
      type: Number,
      required: true,
      min: 0,
    },
    areaUnit: {
      type: String,
      enum: ['sqft', 'sqm'],
      default: 'sqft',
    },
    images: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['available', 'sold', 'rented', 'pending'],
      default: 'available',
    },
    agentId: {
      type: Schema.Types.ObjectId,
      ref: 'Agent',
    },
    features: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    location: {
      lat: Number,
      lng: Number,
    },
  },
  {
    timestamps: true,
  }
)

export const Property = mongoose.model<IProperty>('Property', PropertySchema)

