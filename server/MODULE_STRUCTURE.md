# Module-Based Architecture

The codebase is now organized into feature modules. Each module contains all related code for that feature.

## 📁 Module Structure

```
server/src/
├── modules/
│   ├── auth/              # Authentication & User Management
│   │   ├── models/
│   │   │   └── User.ts
│   │   ├── controllers/
│   │   │   └── authController.ts
│   │   ├── routes/
│   │   │   └── authRoutes.ts
│   │   └── index.ts
│   │
│   ├── admin/             # Admin Operations
│   │   ├── controllers/
│   │   │   └── adminController.ts
│   │   ├── routes/
│   │   │   └── adminRoutes.ts
│   │   └── index.ts
│   │
│   ├── mobile/            # Mobile App Endpoints
│   │   ├── controllers/
│   │   │   └── mobileController.ts
│   │   ├── routes/
│   │   │   └── mobileRoutes.ts
│   │   └── index.ts
│   │
│   ├── agent/             # Agent Management
│   │   ├── models/
│   │   │   └── Agent.ts
│   │   ├── controllers/
│   │   │   └── agentController.ts
│   │   ├── routes/
│   │   │   └── agentRoutes.ts
│   │   └── index.ts
│   │
│   ├── property/          # Property Management
│   │   ├── models/
│   │   │   └── Property.ts
│   │   ├── controllers/
│   │   │   └── propertyController.ts
│   │   ├── routes/
│   │   │   └── propertyRoutes.ts
│   │   └── index.ts
│   │
│   ├── payment/           # Payment Processing
│   │   ├── models/
│   │   │   └── Payment.ts
│   │   ├── controllers/
│   │   │   └── paymentController.ts
│   │   ├── routes/
│   │   │   └── paymentRoutes.ts
│   │   └── index.ts
│   │
│   ├── auction/           # Auction Management
│   │   ├── models/
│   │   │   └── AuctionRequest.ts
│   │   ├── controllers/
│   │   │   └── auctionController.ts
│   │   ├── routes/
│   │   │   └── auctionRoutes.ts
│   │   └── index.ts
│   │
│   └── support/           # Support Ticket System
│       ├── models/
│       │   └── SupportTicket.ts
│       ├── controllers/
│       │   └── supportController.ts
│       ├── routes/
│       │   └── supportRoutes.ts
│       └── index.ts
│
├── config/                # Shared Configuration
├── middleware/            # Shared Middleware
├── utils/                 # Shared Utilities
└── routes/
    └── index.ts           # Main Route Aggregator
```

## 📦 Module Details

### 1. Auth Module (`/modules/auth`)
**Purpose:** User authentication and user model

**Contains:**
- User model (with all roles: super_admin, admin, subadmin_*, agent, doctor, customer)
- Authentication controllers (register, login, getMe)
- Authentication routes (`/api/v1/auth`)

**Exports:**
- `User` model
- `IUser`, `UserRole` types
- Auth controllers
- `authRoutes`

### 2. Admin Module (`/modules/admin`)
**Purpose:** Admin-only operations

**Contains:**
- Admin controllers (user management, agent creation, verification)
- Admin routes (`/api/v1/admin`)

**Dependencies:**
- Uses `User` from auth module

**Exports:**
- Admin controllers
- `adminRoutes`

### 3. Mobile Module (`/modules/mobile`)
**Purpose:** Mobile app specific endpoints

**Contains:**
- Mobile controllers (customer registration, profile, verification requests)
- Mobile routes (`/api/v1/mobile`)

**Dependencies:**
- Uses `User` from auth module

**Exports:**
- Mobile controllers
- `mobileRoutes`

### 4. Agent Module (`/modules/agent`)
**Purpose:** Agent management

**Contains:**
- Agent model
- Agent controllers (CRUD operations)
- Agent routes (`/api/v1/agents`)

**Exports:**
- `Agent` model
- `IAgent` type
- Agent controllers
- `agentRoutes`

### 5. Property Module (`/modules/property`)
**Purpose:** Property management

**Contains:**
- Property model
- Property controllers (CRUD operations)
- Property routes (`/api/v1/properties`)

**Exports:**
- `Property` model
- `IProperty` type
- Property controllers
- `propertyRoutes`

### 6. Payment Module (`/modules/payment`)
**Purpose:** Payment processing

**Contains:**
- Payment model
- Payment controllers (create, get, update status)
- Payment routes (`/api/v1/payments`)

**Exports:**
- `Payment` model
- `IPayment` type
- Payment controllers
- `paymentRoutes`

### 7. Auction Module (`/modules/auction`)
**Purpose:** Auction request management

**Contains:**
- AuctionRequest model
- Auction controllers (submit, approve, decline)
- Auction routes (`/api/v1/auction-requests`)

**Exports:**
- `AuctionRequest` model
- `IAuctionRequest` type
- Auction controllers
- `auctionRoutes`

### 8. Support Module (`/modules/support`)
**Purpose:** Support ticket system

**Contains:**
- SupportTicket model
- Support controllers (create, get, reply, update status)
- Support routes (`/api/v1/support`)

**Exports:**
- `SupportTicket` model
- `ISupportTicket` type
- Support controllers
- `supportRoutes`

## 🔗 Module Dependencies

```
auth (base module)
  ├── admin (uses User)
  ├── mobile (uses User)
  ├── auction (uses User for propertyOwnerId)
  └── support (uses User for userId)

property (standalone)
agent (standalone)
payment (standalone, uses User via userId)
```

## 📝 Adding a New Module

1. Create module directory:
```bash
mkdir -p server/src/modules/newmodule/{models,controllers,routes}
```

2. Create model (if needed):
```typescript
// server/src/modules/newmodule/models/NewModel.ts
export const NewModel = mongoose.model('NewModel', NewModelSchema)
```

3. Create controller:
```typescript
// server/src/modules/newmodule/controllers/newController.ts
export const newController = async (req, res, next) => { ... }
```

4. Create routes:
```typescript
// server/src/modules/newmodule/routes/newRoutes.ts
router.get('/', newController)
export default router
```

5. Create index.ts:
```typescript
// server/src/modules/newmodule/index.ts
export * from './controllers/newController.js'
export { default as newRoutes } from './routes/newRoutes.js'
```

6. Add to main routes:
```typescript
// server/src/routes/index.ts
import { newRoutes } from '../modules/newmodule/index.js'
router.use('/new', newRoutes)
```

## ✅ Benefits

1. **Organization:** Related code grouped together
2. **Maintainability:** Easy to find and update feature code
3. **Scalability:** Easy to add new modules
4. **Reusability:** Modules can import from each other
5. **Clear Dependencies:** Each module's dependencies are explicit

