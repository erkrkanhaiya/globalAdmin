#!/usr/bin/env node
/**
 * Convert all relative imports to absolute imports for all products
 * Products: crm, livenotes, whatsappapi, rentalcabooking
 */

const fs = require('fs')
const path = require('path')

const PRODUCTS = ['crm', 'livenotes', 'whatsappapi', 'rentalcabooking']
const SRC_DIR = path.join(__dirname, 'src')
const PRODUCTS_DIR = path.join(SRC_DIR, 'products')

function convertToAbsolute(relativePath, currentFile) {
  // Remove .js extension for path calculation
  const cleanPath = relativePath.replace(/\.js$/, '')
  
  // Resolve relative path
  const currentDir = path.dirname(currentFile)
  const resolved = path.resolve(currentDir, cleanPath)
  
  // Get path relative to src/
  try {
    const relToSrc = path.relative(SRC_DIR, resolved)
    // Convert to forward slashes and add .js
    return `@/${relToSrc.replace(/\\/g, '/')}.js`
  } catch (error) {
    // If path is outside src/, keep it as is
    return relativePath
  }
}

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8')
    const original = content
    
    // Pattern to match import/export statements with relative paths
    const pattern = /(import|export)(\s+.*?\s+from\s+['"])(\.\.?\/[^'"]+)(['"])/g
    
    content = content.replace(pattern, (match, keyword, prefix, relPath, quote) => {
      // Skip if already absolute or node_modules
      if (relPath.startsWith('@/') || !relPath.startsWith('.')) {
        return match
      }
      
      try {
        const absPath = convertToAbsolute(relPath, filePath)
        return `${keyword}${prefix}${absPath}${quote}`
      } catch (error) {
        console.warn(`⚠️  Error converting ${relPath} in ${filePath}: ${error.message}`)
        return match
      }
    })
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf-8')
      return true
    }
    return false
  } catch (error) {
    console.error(`❌ Error processing ${filePath}: ${error.message}`)
    return false
  }
}

function findTsFiles(dir, excludeBak = true) {
  const files = []
  
  function walk(currentPath) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name)
      
      if (entry.isDirectory()) {
        walk(fullPath)
      } else if (entry.isFile() && entry.name.endsWith('.ts')) {
        if (!excludeBak || !entry.name.endsWith('.bak')) {
          files.push(fullPath)
        }
      }
    }
  }
  
  walk(dir)
  return files
}

function main() {
  console.log('🔄 Converting relative imports to absolute imports for all products...\n')
  
  let totalUpdated = 0
  
  for (const product of PRODUCTS) {
    const productDir = path.join(PRODUCTS_DIR, product)
    
    if (!fs.existsSync(productDir)) {
      console.log(`⚠️  Directory ${productDir} not found, skipping...`)
      continue
    }
    
    console.log(`\n📦 Processing ${product}...`)
    const tsFiles = findTsFiles(productDir)
    let updated = 0
    
    for (const file of tsFiles) {
      if (processFile(file)) {
        const relPath = path.relative(PRODUCTS_DIR, file)
        console.log(`  ✅ ${relPath}`)
        updated++
      }
    }
    
    console.log(`  📊 Updated ${updated} files`)
    totalUpdated += updated
  }
  
  console.log(`\n✅ Conversion complete! Updated ${totalUpdated} files across all products.`)
}

if (require.main === module) {
  main()
}

module.exports = { convertToAbsolute, processFile }
