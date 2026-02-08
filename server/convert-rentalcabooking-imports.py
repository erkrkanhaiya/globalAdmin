#!/usr/bin/env python3
"""
Convert all relative imports to absolute imports in rentalcabooking folder
Uses @/ prefix for src/ directory
"""

import os
import re
from pathlib import Path

RENTALCABOOKING_DIR = Path(__file__).parent / 'src/products/rentalcabooking'
SRC_DIR = Path(__file__).parent / 'src'

def relative_to_absolute(relative_path: str, current_file: Path) -> str:
    """Convert relative path to absolute path from src/"""
    # Remove .js extension for path calculation
    clean_path = relative_path.replace('.js', '')
    
    # Resolve relative path
    current_dir = current_file.parent
    try:
        resolved = (current_dir / clean_path).resolve()
        
        # Get path relative to src/
        rel_to_src = resolved.relative_to(SRC_DIR)
        # Convert to forward slashes and add .js
        return f"@/{str(rel_to_src).replace(chr(92), '/')}.js"
    except (ValueError, OSError):
        # If path is outside src/, keep it as is
        return relative_path

def process_file(file_path: Path) -> bool:
    """Process a single file and convert imports"""
    try:
        content = file_path.read_text(encoding='utf-8')
        original = content
        
        # Pattern to match import/export statements
        pattern = r"(import|export)(\s+.*?\s+from\s+['\"])(\.\.?\/[^'\"]+)(['\"])"
        
        def replace_import(match):
            keyword, prefix, rel_path, quote = match.groups()
            
            # Skip if already absolute or node_modules
            if rel_path.startswith('@/') or not rel_path.startswith('.'):
                return match.group(0)
            
            try:
                abs_path = relative_to_absolute(rel_path, file_path)
                return f"{keyword}{prefix}{abs_path}{quote}"
            except Exception as e:
                print(f"⚠️  Error converting {rel_path} in {file_path.relative_to(RENTALCABOOKING_DIR)}: {e}")
                return match.group(0)
        
        new_content = re.sub(pattern, replace_import, content)
        
        if new_content != original:
            file_path.write_text(new_content, encoding='utf-8')
            return True
        return False
    except Exception as e:
        print(f"❌ Error processing {file_path}: {e}")
        return False

def main():
    if not RENTALCABOOKING_DIR.exists():
        print(f"❌ Directory {RENTALCABOOKING_DIR} does not exist")
        return
    
    print("🔄 Converting relative imports to absolute imports...\n")
    
    ts_files = list(RENTALCABOOKING_DIR.rglob('*.ts'))
    ts_files = [f for f in ts_files if not f.name.endswith('.bak')]
    updated = 0
    
    for file in ts_files:
        if process_file(file):
            print(f"✅ Updated: {file.relative_to(RENTALCABOOKING_DIR)}")
            updated += 1
    
    print(f"\n✅ Conversion complete! Updated {updated} files.")

if __name__ == '__main__':
    main()
