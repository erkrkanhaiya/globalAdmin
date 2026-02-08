#!/usr/bin/env python3
"""
Fix all mismatched quotes in TypeScript import statements
Changes .js' to .js" at the end of import lines
"""

import os
import re
import sys

def fix_quotes_in_file(filepath):
    """Fix mismatched quotes in a single file"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Count occurrences before fix
        before_count = len(re.findall(r"\.js'$", content, re.MULTILINE))
        
        # Replace .js' with .js" at end of lines
        fixed = re.sub(r"\.js'$", r'.js"', content, flags=re.MULTILINE)
        
        if content != fixed:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(fixed)
            return before_count
        return 0
    except Exception as e:
        print(f"Error processing {filepath}: {e}")
        return 0

def main():
    """Main function to fix all TypeScript files"""
    root = 'src/products'
    if not os.path.exists(root):
        print(f"Error: {root} directory not found!")
        print("Run this script from the server directory")
        sys.exit(1)
    
    fixed_count = 0
    total_files = 0
    total_fixes = 0
    
    print("🔍 Scanning for files with mismatched quotes...")
    print("")
    
    for root_dir, dirs, files in os.walk(root):
        for file in files:
            if file.endswith('.ts') and not file.endswith('.bak'):
                filepath = os.path.join(root_dir, file)
                total_files += 1
                fixes = fix_quotes_in_file(filepath)
                if fixes > 0:
                    fixed_count += 1
                    total_fixes += fixes
                    print(f"✅ Fixed {fixes} issue(s) in: {filepath}")
    
    print("")
    print("=" * 60)
    print(f"✅ Fixed {total_fixes} quote issue(s) in {fixed_count} file(s)")
    print(f"📁 Scanned {total_files} total TypeScript files")
    print("=" * 60)
    print("")
    print("🚀 You can now start the servers!")

if __name__ == '__main__':
    main()
