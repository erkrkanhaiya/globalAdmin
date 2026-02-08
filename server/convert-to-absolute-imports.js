#!/usr/bin/env node

/**
 * Script to convert all relative imports to absolute imports in restaurant folder
 * Usage: node convert-to-absolute-imports.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const restaurantDir = path.join(__dirname, 'src/products/restaurant')

// Function to convert relative path to absolute path from src/
function convertToAbsolute(relativePath, currentFile) {
  // Remove .js extension for calculation
  const cleanPath = relativePath.replace(/\.js$/, '')
  
  // Get directory of current file
  const currentDir = path.dirname(currentFile)
  
  // Resolve the relative path
  const resolvedPath = path.resolve(currentDir, cleanPath)
  
  // Get path relative to src/
  const srcDir = path.join(__dirname, 'src')
  const absolutePath = path.relative(srcDir, resolvedPath)
  
  // Convert to forward slashes and add .js extension
  return `@/${absolutePath.replace(/\\/g, '/')}.js`
}

// Function to process a file
function processFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const relativePath = path.relative(restaurantDir, filePath)
  
  // Pattern to match import/export statements with relative paths
  const importPattern = /(import|export)(\s+.*?\s+from\s+['"])(\.\.?\/[^'"]+)(['"])/g
  
  let modified = false
  const newContent = content.replace(importPattern, (match, keyword, prefix, relativePath, quote) => {
    // Skip if it's a node_modules import or already absolute
    if (relativePath.startsWith('@/') || !relativePath.startsWith('.')) {
      return match
    }
    
    try {
      const absolutePath = convertToAbsolute(relativePath, filePath)
      modified = true
      return `${keyword}${prefix}${absolutePath}${quote}`
    } catch (error) {
      console.error(`Error converting ${relativePath} in ${relativePath}:`, error.message)
      return match
    }
  })
  
  if (modified) {
    fs.writeFileSync(filePath, newContent, 'utf-8')
    console.log(`✅ Updated: ${relativePath}`)
    return true
  }
  
  return false
}

// Recursively find all TypeScript files
function findTsFiles(dir) {
  const files = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...findTsFiles(fullPath))
    } else if (entry.isFile() && entry.name.endsWith('.ts')) {
      files.push(fullPath)
    }
  }
  
  return files
}

// Main execution
console.log('🔄 Converting relative imports to absolute imports...\n')

const files = findTsFiles(restaurantDir)
let updatedCount = 0

for (const file of files) {
  if (processFile(file)) {
    updatedCount++
  }
}

console.log(`\n✅ Conversion complete! Updated ${updatedCount} files.`)
