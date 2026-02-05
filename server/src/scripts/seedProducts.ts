import { connectDatabase } from '../config/database.js'
import { Product } from '../modules/product/models/Product.js'

const products = [
  {
    name: 'Restaurant',
    slug: 'restaurant',
    displayName: 'Restaurant Management',
    description: 'Manage restaurant operations, orders, and menus',
    icon: '🍽️',
    color: '#f59e0b',
    databaseName: 'restaurant_db',
  },
  {
    name: 'LiveNotes',
    slug: 'livenotes',
    displayName: 'Live Notes',
    description: 'Real-time note-taking and collaboration platform',
    icon: '📝',
    color: '#3b82f6',
    databaseName: 'livenotes_db',
  },
  {
    name: 'Rental Cab Booking',
    slug: 'rentalcabbooking',
    displayName: 'Rental Cab Booking',
    description: 'Taxi and cab booking management system',
    icon: '🚕',
    color: '#10b981',
    databaseName: 'rentalcabbooking_db',
  },
  {
    name: 'WhatsApp API',
    slug: 'whatsappapi',
    displayName: 'WhatsApp API',
    description: 'WhatsApp messaging and automation API',
    icon: '💬',
    color: '#25d366',
    databaseName: 'whatsappapi_db',
  },
  {
    name: 'CRM',
    slug: 'crm',
    displayName: 'Customer Relationship Management',
    description: 'Manage customer relationships and sales pipeline',
    icon: '👥',
    color: '#8b5cf6',
    databaseName: 'crm_db',
  },
]

const seedProducts = async (): Promise<void> => {
  try {
    console.log('🌱 Seeding products...')

    // Connect to main database
    await connectDatabase()

    // Clear existing products (optional - comment out if you want to keep existing)
    // await Product.deleteMany({})

    // Insert products
    for (const productData of products) {
      const existingProduct = await Product.findOne({ slug: productData.slug })

      if (existingProduct) {
        console.log(`⏭️  Product '${productData.slug}' already exists, skipping...`)
      } else {
        await Product.create(productData)
        console.log(`✅ Created product: ${productData.displayName} (${productData.slug})`)
      }
    }

    console.log('\n🎉 Products seeded successfully!')
    console.log(`📦 Total products: ${await Product.countDocuments()}`)
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding products:', error)
    process.exit(1)
  }
}

seedProducts()
