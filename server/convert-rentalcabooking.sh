#!/bin/bash

# Convert all relative imports to absolute imports in rentalcabooking folder

cd "$(dirname "$0")"
RENTAL_DIR="src/products/rentalcabooking"

if [ ! -d "$RENTAL_DIR" ]; then
    echo "❌ Directory $RENTAL_DIR not found"
    exit 1
fi

echo "🔄 Converting imports in rentalcabooking folder..."
echo ""

# Find all .ts files (excluding .bak)
find "$RENTAL_DIR" -name "*.ts" -not -name "*.bak" -type f | while read file; do
    echo "Processing: $file"
    
    # Convert server.ts imports
    if [[ "$file" == *"server.ts" ]]; then
        sed -i '' \
            -e "s|from '../../config/env.js'|from '@/config/env.js'|g" \
            -e "s|from '../../config/database.js'|from '@/config/database.js'|g" \
            -e "s|from '../../config/multiDatabase.js'|from '@/config/multiDatabase.js'|g" \
            -e "s|from '../../modules/product/models/Product.js'|from '@/modules/product/models/Product.js'|g" \
            -e "s|from \"../../middleware/errorHandler.js\"|from \"@/middleware/errorHandler.js\"|g" \
            -e "s|from \"../../middleware/requestLogger.js\"|from \"@/middleware/requestLogger.js\"|g" \
            -e "s|from '../../config/swagger.rentalcabooking.js'|from '@/config/swagger.rentalcabooking.js'|g" \
            -e "s|from './routes/index.js'|from '@/products/rentalcabooking/routes/index.js'|g" \
            "$file"
    fi
    
    # Convert middleware imports (6 levels up)
    sed -i '' \
        -e "s|from '../../../../../middleware/auth.js'|from '@/middleware/auth.js'|g" \
        -e "s|from \"../../../../../middleware/auth.js\"|from \"@/middleware/auth.js\"|g" \
        -e "s|from '../../../../../middleware/errorHandler.js'|from '@/middleware/errorHandler.js'|g" \
        -e "s|from \"../../../../../middleware/errorHandler.js\"|from \"@/middleware/errorHandler.js\"|g" \
        -e "s|from '../../../../../middleware/basicAuth.js'|from '@/middleware/basicAuth.js'|g" \
        -e "s|from \"../../../../../middleware/basicAuth.js\"|from \"@/middleware/basicAuth.js\"|g" \
        -e "s|from '../../../../../middleware/validator.js'|from '@/middleware/validator.js'|g" \
        -e "s|from \"../../../../../middleware/validator.js\"|from \"@/middleware/validator.js\"|g" \
        -e "s|from '../../../../../middleware/requestLogger.js'|from '@/middleware/requestLogger.js'|g" \
        -e "s|from \"../../../../../middleware/requestLogger.js\"|from \"@/middleware/requestLogger.js\"|g" \
        "$file"
    
    # Convert config imports (6 levels up)
    sed -i '' \
        -e "s|from '../../../../../config/rateLimit.js'|from '@/config/rateLimit.js'|g" \
        -e "s|from \"../../../../../config/rateLimit.js\"|from \"@/config/rateLimit.js\"|g" \
        -e "s|from '../../../../../config/env.js'|from '@/config/env.js'|g" \
        -e "s|from \"../../../../../config/env.js\"|from \"@/config/env.js\"|g" \
        "$file"
    
    # Convert cross-module imports (2 levels up to modules)
    sed -i '' \
        -e "s|from '../../auth/models/User.js'|from '@/products/rentalcabooking/modules/auth/models/User.js'|g" \
        -e "s|from '../../property/models/Property.js'|from '@/products/rentalcabooking/modules/property/models/Property.js'|g" \
        -e "s|from '../../agent/models/Agent.js'|from '@/products/rentalcabooking/modules/agent/models/Agent.js'|g" \
        -e "s|from '../../payment/models/Payment.js'|from '@/products/rentalcabooking/modules/payment/models/Payment.js'|g" \
        -e "s|from '../../support/models/SupportTicket.js'|from '@/products/rentalcabooking/modules/support/models/SupportTicket.js'|g" \
        -e "s|from '../../auction/models/AuctionRequest.js'|from '@/products/rentalcabooking/modules/auction/models/AuctionRequest.js'|g" \
        "$file"
    
    # Convert routes/index.ts imports
    if [[ "$file" == *"routes/index.ts" ]]; then
        sed -i '' \
            -e "s|from '../modules/|from '@/products/rentalcabooking/modules/|g" \
            -e "s|from '../controllers/|from '@/products/rentalcabooking/controllers/|g" \
            "$file"
    fi
    
    # Convert index.ts exports
    if [[ "$file" == *"/index.ts" ]] && [[ "$file" != *"routes/index.ts" ]]; then
        sed -i '' \
            -e "s|from './routes/index.js'|from '@/products/rentalcabooking/routes/index.js'|g" \
            "$file"
    fi
done

echo ""
echo "✅ Conversion complete!"
echo ""
echo "Verifying changes..."
find "$RENTAL_DIR" -name "*.ts" -not -name "*.bak" -exec grep -l "from.*\.\./" {} \; | wc -l | xargs -I {} echo "Files with remaining relative imports: {}"
