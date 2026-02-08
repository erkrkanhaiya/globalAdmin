#!/bin/bash

# Fix mismatched quotes in all TypeScript files
# Changes .js' to .js" at end of import statements

echo "Fixing mismatched quotes in import statements..."

cd "$(dirname "$0")/src/products"

# Find all .ts files (excluding .bak files) and fix the quote issue
find . -name "*.ts" -not -name "*.bak" -type f -print0 | while IFS= read -r -d '' file; do
  # Use perl for in-place editing (more reliable than sed on macOS)
  perl -i -pe 's/\.js'\''$/\.js"/g' "$file"
done

echo "✅ Fixed all mismatched quotes!"
echo "Files fixed: $(grep -r '\.js'\''$' --include="*.ts" --exclude="*.bak" . 2>/dev/null | wc -l | tr -d ' ') files still need fixing"
