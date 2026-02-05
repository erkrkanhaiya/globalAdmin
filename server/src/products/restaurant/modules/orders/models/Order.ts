import { Schema, model, Document } from 'mongoose'

export interface IOrder extends Document {
  orderNumber: string
  customerName: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  total: number
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled'
  createdAt: Date
  updatedAt: Date
}

export const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    items: [
      {
        name: String,
        quantity: Number,
        price: Number,
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'preparing', 'ready', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
)

// Export function to create model with connection
export const createOrderModel = (connection: any) => {
  return connection.model('Order', OrderSchema)
}
