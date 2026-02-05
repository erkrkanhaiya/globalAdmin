/**
 * Seed script to create admin users for different products
 * 
 * Usage: npm run seed:admins
 * Or: tsx src/scripts/seedAdmins.ts
 */

import mongoose from 'mongoose'
import { config } from '../config/env.js'
import { connectDatabase } from '../config/database.js'
import { User } from '../modules/auth/models/User.js'
import { Product } from '../modules/product/models/Product.js'
import bcrypt from 'bcryptjs'

const seedAdmins = async () => {
  try {
    await connectDatabase()
    console.log('✅ Connected to database')

    // Get all products
    const products = await Product.find({ isActive: true })
    console.log(`📦 Found ${products.length} products`)

    if (products.length === 0) {
      console.log('⚠️  No products found. Please run seed:products first.')
      process.exit(1)
    }

    const productSlugs = products.map(p => p.slug)
    console.log('Available products:', productSlugs.join(', '))

    // Super Admin - Access to all products
    const superAdminEmail = 'superadmin@example.com'
    let superAdmin = await User.findOne({ email: superAdminEmail })
    
    if (!superAdmin) {
      const hashedPassword = await bcrypt.hash('superadmin123', 10)
      superAdmin = await User.create({
        name: 'Super Admin',
        email: superAdminEmail,
        password: hashedPassword,
        role: 'super_admin',
        isActive: true,
        isVerified: true,
        verificationStatus: 'approved',
        assignedProducts: [], // Empty = access to all products
        source: 'web',
      })
      console.log('✅ Created Super Admin:', superAdminEmail)
    } else {
      console.log('⏭️  Super Admin already exists')
    }

    // Product-specific admins
    const adminConfigs = [
      {
        name: 'Restaurant Admin',
        email: 'restaurant@admin.com',
        password: 'restaurant123',
        products: ['restaurant'],
      },
      {
        name: 'LiveNotes Admin',
        email: 'livenotes@admin.com',
        password: 'livenotes123',
        products: ['livenotes'],
      },
      {
        name: 'RentalCab Admin',
        email: 'rentalcab@admin.com',
        password: 'rentalcab123',
        products: ['rentalcabbooking'],
      },
      {
        name: 'WhatsAppAPI Admin',
        email: 'whatsapp@admin.com',
        password: 'whatsapp123',
        products: ['whatsappapi'],
      },
      {
        name: 'CRM Admin',
        email: 'crm@admin.com',
        password: 'crm123',
        products: ['crm'],
      },
      {
        name: 'Multi Product Admin',
        email: 'multi@admin.com',
        password: 'multi123',
        products: ['restaurant', 'livenotes'], // Access to multiple products
      },
    ]

    for (const adminConfig of adminConfigs) {
      let admin = await User.findOne({ email: adminConfig.email })
      
      if (!admin) {
        const hashedPassword = await bcrypt.hash(adminConfig.password, 10)
        admin = await User.create({
          name: adminConfig.name,
          email: adminConfig.email,
          password: hashedPassword,
          role: 'admin',
          isActive: true,
          isVerified: true,
          verificationStatus: 'approved',
          assignedProducts: adminConfig.products, // Specific products only
          source: 'web',
        })
        console.log(`✅ Created ${adminConfig.name}:`, adminConfig.email, `(Products: ${adminConfig.products.join(', ')})`)
      } else {
        // Update existing admin's product assignments
        admin.assignedProducts = adminConfig.products
        await admin.save()
        console.log(`🔄 Updated ${adminConfig.name}:`, adminConfig.email, `(Products: ${adminConfig.products.join(', ')})`)
      }
    }

    console.log('\n✅ Admin seeding completed!')
    console.log('\n📋 Login Credentials:')
    console.log('Super Admin:')
    console.log('  Email: superadmin@example.com')
    console.log('  Password: superadmin123')
    console.log('  Access: All products')
    console.log('\nProduct Admins:')
    adminConfigs.forEach(admin => {
      console.log(`  ${admin.name}:`)
      console.log(`    Email: ${admin.email}`)
      console.log(`    Password: ${admin.password}`)
      console.log(`    Products: ${admin.products.join(', ')}`)
    })

    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding admins:', error)
    process.exit(1)
  }
}

seedAdmins()
