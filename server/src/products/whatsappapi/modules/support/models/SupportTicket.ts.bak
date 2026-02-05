import mongoose, { Schema, Document } from 'mongoose'

export interface ISupportTicket extends Document {
  userId: mongoose.Types.ObjectId
  subject: string
  message: string
  category: 'technical' | 'billing' | 'general' | 'account' | 'property'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignedTo?: mongoose.Types.ObjectId
  replies?: Array<{
    userId: mongoose.Types.ObjectId
    message: string
    createdAt: Date
  }>
  attachments?: string[]
  resolvedAt?: Date
  resolvedBy?: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const SupportTicketSchema = new Schema<ISupportTicket>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    subject: {
      type: String,
      required: [true, 'Please provide a subject'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Please provide a message'],
      trim: true,
    },
    category: {
      type: String,
      enum: ['technical', 'billing', 'general', 'account', 'property'],
      default: 'general',
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved', 'closed'],
      default: 'open',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    replies: [
      {
        userId: {
          type: Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        message: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    attachments: {
      type: [String],
      default: [],
    },
    resolvedAt: {
      type: Date,
    },
    resolvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
)

export const SupportTicket = mongoose.model<ISupportTicket>('SupportTicket', SupportTicketSchema)

