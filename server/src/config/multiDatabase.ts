import mongoose, { Connection } from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017'
const connections: Map<string, Connection> = new Map()

/**
 * Get or create a database connection for a specific product
 * @param productSlug - The product slug (e.g., 'restaurant', 'livenotes')
 * @param databaseName - The database name for this product
 * @returns Mongoose connection for the product database
 */
export const getProductConnection = async (
  productSlug: string,
  databaseName: string
): Promise<Connection> => {
  // Check if connection already exists
  if (connections.has(productSlug)) {
    const conn = connections.get(productSlug)!
    if (conn.readyState === 1) {
      return conn
    }
  }

  // Create new connection
  const connectionString = `${MONGODB_URI}/${databaseName}`
  
  try {
    const conn = mongoose.createConnection(connectionString, {
      retryWrites: true,
      w: 'majority',
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: true,
    })

    // Wait for connection
    await conn.asPromise()

    // Store connection
    connections.set(productSlug, conn)

    console.log(`✅ Connected to product database: ${databaseName} (${productSlug})`)

    // Handle disconnection
    conn.on('disconnected', () => {
      console.log(`⚠️  Disconnected from product database: ${databaseName} (${productSlug})`)
      connections.delete(productSlug)
    })

    conn.on('error', (err) => {
      console.error(`❌ Error in product database ${databaseName} (${productSlug}):`, err)
    })

    return conn
  } catch (error: any) {
    console.error(`❌ Failed to connect to product database ${databaseName} (${productSlug}):`, error.message)
    throw error
  }
}

/**
 * Get all active product connections
 */
export const getAllProductConnections = (): Map<string, Connection> => {
  return connections
}

/**
 * Close a specific product connection
 */
export const closeProductConnection = async (productSlug: string): Promise<void> => {
  const conn = connections.get(productSlug)
  if (conn) {
    await conn.close()
    connections.delete(productSlug)
    console.log(`✅ Closed connection for product: ${productSlug}`)
  }
}

/**
 * Close all product connections
 */
export const closeAllProductConnections = async (): Promise<void> => {
  const closePromises = Array.from(connections.entries()).map(([slug, conn]) => {
    return conn.close().then(() => {
      console.log(`✅ Closed connection for product: ${slug}`)
    })
  })
  await Promise.all(closePromises)
  connections.clear()
}
