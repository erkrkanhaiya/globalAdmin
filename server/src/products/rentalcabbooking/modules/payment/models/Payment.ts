import mongoose, { Schema, Document } from 'mongoose'

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId
  propertyId?: mongoose.Types.ObjectId
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  paymentMethod: 'credit_card' | 'debit_card' | 'bank_transfer' | 'paypal' | 'stripe'
  transactionId?: string
  paymentIntentId?: string
  metadata?: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

const PaymentSchema = new Schema<IPayment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: 'Property',
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'debit_card', 'bank_transfer', 'paypal', 'stripe'],
      required: true,
    },
    transactionId: {
      type: String,
    },
    paymentIntentId: {
      type: String,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
)

export const Payment = mongoose.model<IPayment>('Payment', PaymentSchema)

