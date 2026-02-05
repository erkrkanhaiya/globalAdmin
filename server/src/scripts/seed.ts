import mongoose from 'mongoose'
import { connectDatabase } from '../config/database.js'
import { User } from '../modules/auth/models/User.js'
import { Agent } from '../modules/agent/models/Agent.js'
import { Property } from '../modules/property/models/Property.js'

const seedDatabase = async (): Promise<void> => {
  try {
    await connectDatabase()

    // Clear existing data (optional - be careful in production!)
    await User.deleteMany({})
    await Agent.deleteMany({})
    await Property.deleteMany({})

    console.log('🌱 Seeding database...')

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin',
      authProvider: 'email',
      isActive: true,
      isVerified: true,
    })

    // Create manager user
    const manager = await User.create({
      name: 'Manager One',
      email: 'manager@example.com',
      password: 'manager123',
      role: 'admin', // Changed from 'manager' to 'admin' for Swagger access
      authProvider: 'email',
      isActive: true,
      isVerified: true,
    })

    // Create regular user
    const user = await User.create({
      name: 'John Doe',
      email: 'user@example.com',
      password: 'user123',
      role: 'customer',
      authProvider: 'email',
      isActive: true,
      isVerified: true,
    })

    console.log('✅ Users created')

    // Create agents
    const agents = await Agent.insertMany([
      {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@example.com',
        phone: '+1-555-0101',
        status: 'active',
        rating: 4.5,
        totalProperties: 12,
        city: 'New York',
        state: 'NY',
        country: 'USA',
      },
      {
        name: 'Michael Chen',
        email: 'michael.chen@example.com',
        phone: '+1-555-0102',
        status: 'active',
        rating: 4.8,
        totalProperties: 18,
        city: 'Los Angeles',
        state: 'CA',
        country: 'USA',
      },
      {
        name: 'Emily Rodriguez',
        email: 'emily.rodriguez@example.com',
        phone: '+1-555-0103',
        status: 'active',
        rating: 4.6,
        totalProperties: 9,
        city: 'Chicago',
        state: 'IL',
        country: 'USA',
      },
    ])

    console.log('✅ Agents created')

    // Create properties
    const properties = await Property.insertMany([
      {
        name: 'Willow Brook Valley',
        type: 'house',
        address: '1668 Lincoln Drive',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        price: 83500,
        priceRange: '$80,675-$86,564',
        bedrooms: 4,
        bathrooms: 2,
        area: 1400,
        areaUnit: 'sqft',
        status: 'available',
        agentId: agents[0]._id,
        rating: 4.5,
        reviews: 187,
        images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800'],
      },
      {
        name: 'Serent Residence',
        type: 'apartment',
        address: '245 Maple Street',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90001',
        country: 'USA',
        price: 82500,
        priceRange: '$80,675-$86,564',
        bedrooms: 4,
        bathrooms: 2,
        area: 1400,
        areaUnit: 'sqft',
        status: 'available',
        agentId: agents[1]._id,
        rating: 4.5,
        reviews: 187,
        images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
      },
      {
        name: 'Riverbend Retreat',
        type: 'villa',
        address: '789 Oak Avenue',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        country: 'USA',
        price: 86000,
        priceRange: '$80,675-$86,564',
        bedrooms: 4,
        bathrooms: 2,
        area: 1400,
        areaUnit: 'sqft',
        status: 'available',
        agentId: agents[2]._id,
        rating: 4.5,
        reviews: 187,
        images: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800'],
      },
    ])

    console.log('✅ Properties created')

    console.log('\n🎉 Database seeded successfully!')
    console.log('\n📋 Login Credentials:')
    console.log('Admin: admin@example.com / admin123')
    console.log('Manager: manager@example.com / manager123')
    console.log('User: user@example.com / user123')

    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

seedDatabase()

