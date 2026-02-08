# Fix Mismatched Quotes in Import Statements

## Problem
Many TypeScript files have mismatched quotes in import statements:
- They start with double quotes `"` but end with single quotes `'`
- Example: `import { protect } from "../../../../middleware/auth.js'` ❌
- Should be: `import { protect } from "../../../../middleware/auth.js"` ✅

## Solution

Run this command in your terminal to fix all files:

```bash
cd /Users/victor/Documents/MydreamWorkspace/Ai/liveNotesWorkpace/globaladmin/server/src/products

# Fix all .ts files (excluding .bak files)
find . -name "*.ts" -not -name "*.bak" -type f -exec perl -i -pe "s/\.js'\$/\.js\"/g" {} \;
```

Or use this Python script:

```python
import os
import re

def fix_quotes_in_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace .js' with .js" at end of lines
    fixed = re.sub(r"\.js'$", r'.js"', content, flags=re.MULTILINE)
    
    if content != fixed:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(fixed)
        return True
    return False

# Fix all TypeScript files
root = 'server/src/products'
fixed_count = 0
for root_dir, dirs, files in os.walk(root):
    for file in files:
        if file.endswith('.ts') and not file.endswith('.bak'):
            filepath = os.path.join(root_dir, file)
            if fix_quotes_in_file(filepath):
                fixed_count += 1
                print(f"Fixed: {filepath}")

print(f"\n✅ Fixed {fixed_count} files!")
```

## Manual Fix (if script doesn't work)

The critical files that need to be fixed are:
1. All `server.ts` files in each product
2. All `routes/index.ts` files
3. All controller and route files in modules

The pattern to fix: Change `.js'` to `.js"` at the end of import statements.
