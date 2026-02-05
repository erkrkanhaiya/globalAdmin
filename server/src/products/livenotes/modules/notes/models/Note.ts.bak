import { Schema, model, Document } from 'mongoose'

export interface INote extends Document {
  title: string
  content: string
  userId: string
  isPublic: boolean
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export const NoteSchema = new Schema<INote>(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
)

// Export function to create model with connection
export const createNoteModel = (connection: any) => {
  return connection.model('Note', NoteSchema)
}
