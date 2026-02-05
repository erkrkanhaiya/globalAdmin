import mongoose, { Schema, Document } from 'mongoose'
import bcrypt from 'bcryptjs'

export type UserRole = 
  | 'super_admin' 
  | 'admin' 
  | 'subadmin_support' 
  | 'subadmin_agent' 
  | 'subadmin_reseller' 
  | 'subadmin_marketing'
  | 'agent'
  | 'doctor'
  | 'customer'

export interface IUser extends Document {
  name: string
  email: string
  phone?: string
  mobile?: {
    number: string
    countryCode: string
    fullNumber?: string // Combined countryCode + number
  }
  password?: string
  googleId?: string
  authProvider: 'email' | 'google'
  role: UserRole
  avatar?: string
  isActive: boolean
  isVerified: boolean
  verificationStatus?: 'pending' | 'approved' | 'rejected'
  verificationDocuments?: string[]
  verificationNotes?: string
  verifiedBy?: mongoose.Types.ObjectId
  verifiedAt?: Date
  lastLogin?: Date
  source?: 'web' | 'mobile'
  parentId?: mongoose.Types.ObjectId // For agents created by admin
  metadata?: {
    licenseNumber?: string // For doctors
    specialization?: string // For doctors
    agentCode?: string // For agents
    resellerCode?: string // For resellers
  }
  createdAt: Date
  updatedAt: Date
  comparePassword(candidatePassword: string): Promise<boolean>
}

const UserSchema = new Schema<IUser>(
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
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: function(this: IUser) {
        return this.authProvider === 'email'
      },
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    googleId: {
      type: String,
      sparse: true, // Allows multiple null values
      unique: true,
    },
    authProvider: {
      type: String,
      enum: ['email', 'google'],
      default: 'email',
      required: true,
    },
    role: {
      type: String,
      enum: [
        'super_admin',
        'admin',
        'subadmin_support',
        'subadmin_agent',
        'subadmin_reseller',
        'subadmin_marketing',
        'agent',
        'doctor',
        'customer',
      ],
      default: 'customer',
    },
    phone: {
      type: String,
      default: '',
    },
    mobile: {
      number: {
        type: String,
        trim: true,
      },
      countryCode: {
        type: String,
        trim: true,
        default: '+1',
      },
      fullNumber: {
        type: String,
        trim: true,
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    verificationDocuments: {
      type: [String],
      default: [],
    },
    verificationNotes: {
      type: String,
      default: '',
    },
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    verifiedAt: {
      type: Date,
    },
    source: {
      type: String,
      enum: ['web', 'mobile'],
      default: 'web',
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    metadata: {
      licenseNumber: String,
      specialization: String,
      agentCode: String,
      resellerCode: String,
    },
    avatar: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

UserSchema.pre('save', async function (next) {
  // Hash password only if it's modified and user is using email auth
  if (this.isModified('password') && this.password && this.authProvider === 'email') {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
  }

  // Generate fullNumber from countryCode and number
  if (this.isModified('mobile')) {
    if (this.mobile?.countryCode && this.mobile?.number) {
      this.mobile.fullNumber = `${this.mobile.countryCode}${this.mobile.number}`
    }
  }

  next()
})

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) {
    return false
  }
  return bcrypt.compare(candidatePassword, this.password)
}

export const User = mongoose.model<IUser>('User', UserSchema)

