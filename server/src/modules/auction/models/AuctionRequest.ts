import mongoose, { Schema, Document } from 'mongoose'

export interface IAuctionRequest extends Document {
  propertyId: mongoose.Types.ObjectId
  propertyOwnerId: mongoose.Types.ObjectId
  reservePrice: number
  description?: string
  photos: string[]
  status: 'pending' | 'approved' | 'declined'
  auctionDate?: Date
  paymentLink?: string
  declineReason?: string
  reviewedBy?: mongoose.Types.ObjectId
  reviewedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const AuctionRequestSchema = new Schema<IAuctionRequest>(
  {
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    propertyOwnerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reservePrice: {
      type: Number,
      required: [true, 'Please provide a reserve price'],
      min: 0,
    },
    description: {
      type: String,
      default: '',
    },
    photos: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'declined'],
      default: 'pending',
    },
    auctionDate: {
      type: Date,
    },
    paymentLink: {
      type: String,
      default: '',
    },
    declineReason: {
      type: String,
      default: '',
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

export const AuctionRequest = mongoose.model<IAuctionRequest>('AuctionRequest', AuctionRequestSchema)

