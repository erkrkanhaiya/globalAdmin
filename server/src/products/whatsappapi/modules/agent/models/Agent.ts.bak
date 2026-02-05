import mongoose, { Schema, Document } from 'mongoose'

export interface IAgent extends Document {
  name: string
  email: string
  phone: string
  avatar?: string
  bio?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
  country?: string
  socialMedia?: {
    facebook?: string
    twitter?: string
    linkedin?: string
    instagram?: string
  }
  status: 'active' | 'inactive' | 'pending'
  rating?: number
  totalProperties?: number
  createdAt: Date
  updatedAt: Date
}

const AgentSchema = new Schema<IAgent>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
    },
    avatar: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      default: '',
    },
    city: {
      type: String,
      default: '',
    },
    state: {
      type: String,
      default: '',
    },
    zipCode: {
      type: String,
      default: '',
    },
    country: {
      type: String,
      default: 'USA',
    },
    socialMedia: {
      facebook: String,
      twitter: String,
      linkedin: String,
      instagram: String,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'pending'],
      default: 'pending',
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalProperties: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

export const Agent = mongoose.model<IAgent>('Agent', AgentSchema)

