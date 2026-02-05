import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/admin_panel'
const DB_NAME = process.env.MONGODB_DB_NAME || 'admin_panel'

export const connectDatabase = async (): Promise<void> => {
  try {
    // Build connection options with performance optimizations
    const options: mongoose.ConnectOptions = {
      // If database name is in URI, don't override it
      // Otherwise use the DB_NAME from env
      ...(MONGODB_URI.includes('/' + DB_NAME) || MONGODB_URI.includes('/' + DB_NAME + '?') 
        ? {} 
        : { dbName: DB_NAME }
      ),
      retryWrites: true,
      w: 'majority',
      // Connection pool optimization
      maxPoolSize: 10, // Maximum number of connections in the pool
      minPoolSize: 5, // Minimum number of connections in the pool
      maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
      serverSelectionTimeoutMS: 5000, // How long to try selecting a server
      socketTimeoutMS: 45000, // How long a send or receive on a socket can take before timeout
      family: 4, // Use IPv4, skip trying IPv6
      // Enable mongoose buffering to allow operations before connection
      bufferCommands: true,
    }

    // Log connection attempt (without password)
    const uriWithoutPassword = MONGODB_URI.replace(/:\/\/[^:]+:[^@]+@/, '://***:***@')
    const isLocal = MONGODB_URI.includes('localhost') || MONGODB_URI.includes('127.0.0.1')
    console.log(`🔌 Attempting to connect to ${isLocal ? 'Local MongoDB' : 'MongoDB Atlas'}...`)
    console.log(`📡 URI: ${uriWithoutPassword}`)

    await mongoose.connect(MONGODB_URI, options)
    
    console.log(`✅ MongoDB Connected ${isLocal ? '(Local)' : '(Atlas)'}`)
    console.log(`📦 Database: ${mongoose.connection.db?.databaseName || DB_NAME}`)
    console.log(`🔗 Connection State: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`)
  } catch (error: any) {
    console.error('❌ MongoDB connection error:', error.message)
    if (error.message.includes('authentication failed')) {
      console.error('💡 Please verify:')
      console.error('   1. Username: staging')
      console.error('   2. Password: staging@123 (should be URL-encoded as staging%40123)')
      console.error('   3. Check MongoDB Atlas Network Access (IP Whitelist)')
      console.error('   4. Verify database user has correct permissions')
    }
    if (error.message.includes('ENOTFOUND') || error.message.includes('NXDOMAIN')) {
      console.error('💡 DNS Error: MongoDB hostname cannot be resolved')
      console.error('   Please verify the MongoDB connection string is correct')
      console.error('   Current URI:', MONGODB_URI.replace(/:\/\/[^:]+:[^@]+@/, '://***:***@'))
    }
    console.error('⚠️  Server will continue without MongoDB connection. Some features may not work.')
    // Don't exit - allow server to start without DB for now
    // process.exit(1)
  }
}

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected')
})

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err)
})

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close()
  console.log('MongoDB connection closed through app termination')
  process.exit(0)
})

