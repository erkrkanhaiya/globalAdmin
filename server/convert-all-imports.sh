#!/bin/bash

# Convert all relative imports to absolute imports for all products
# Products: crm, livenotes, whatsappapi, rentalcabooking

cd "$(dirname "$0")"
PRODUCTS_DIR="src/products"
PRODUCTS=("crm" "livenotes" "whatsappapi" "rentalcabooking")

echo "🔄 Converting relative imports to absolute imports for all products..."
echo ""

for product in "${PRODUCTS[@]}"; do
  product_dir="$PRODUCTS_DIR/$product"
  
  if [ ! -d "$product_dir" ]; then
    echo "⚠️  Directory $product_dir not found, skipping..."
    continue
  fi
  
  echo "📦 Processing $product..."
  
  # Find all .ts files (excluding .bak)
  find "$product_dir" -name "*.ts" -not -name "*.bak" -type f | while read file; do
    updated=false
    
    # Convert middleware imports (6 levels up)
    if sed -i '' -E 's|from ["'\'']\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/middleware/([^"'\'']+)["'\'']|from "@/middleware/\1"|g' "$file" 2>/dev/null; then
      updated=true
    fi
    
    # Convert config imports (6 levels up)
    if sed -i '' -E 's|from ["'\'']\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/config/([^"'\'']+)["'\'']|from "@/config/\1"|g' "$file" 2>/dev/null; then
      updated=true
    fi
    
    # Convert middleware imports (4 levels up)
    if sed -i '' -E 's|from ["'\'']\.\.\/\.\.\/\.\.\/\.\.\/middleware/([^"'\'']+)["'\'']|from "@/middleware/\1"|g' "$file" 2>/dev/null; then
      updated=true
    fi
    
    # Convert config imports (4 levels up)
    if sed -i '' -E 's|from ["'\'']\.\.\/\.\.\/\.\.\/\.\.\/config/([^"'\'']+)["'\'']|from "@/config/\1"|g' "$file" 2>/dev/null; then
      updated=true
    fi
    
    # Convert middleware imports (3 levels up)
    if sed -i '' -E 's|from ["'\'']\.\.\/\.\.\/\.\.\/middleware/([^"'\'']+)["'\'']|from "@/middleware/\1"|g' "$file" 2>/dev/null; then
      updated=true
    fi
    
    # Convert config imports (3 levels up)
    if sed -i '' -E 's|from ["'\'']\.\.\/\.\.\/\.\.\/config/([^"'\'']+)["'\'']|from "@/config/\1"|g' "$file" 2>/dev/null; then
      updated=true
    fi
    
    # Convert cross-module imports (2 levels up to modules)
    if sed -i '' -E "s|from ['\"]\.\.\/\.\.\/([^/]+)/index\.js['\"]|from \"@/products/$product/modules/\1/index.js\"|g" "$file" 2>/dev/null; then
      updated=true
    fi
    
    if [ "$updated" = true ]; then
      rel_path=$(echo "$file" | sed "s|^$product_dir/||")
      echo "  ✅ $rel_path"
    fi
  done
  
  echo ""
done

echo "✅ Conversion complete!"
