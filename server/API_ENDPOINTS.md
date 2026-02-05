# API Endpoints Documentation

## 📚 Swagger UI

Access Swagger documentation at: `http://localhost:5000/api-docs`

## 🔐 Admin APIs

**Base URL:** `/api/v1/admin`  
**Access:** Admin/Super Admin only (Bearer token required)

### User Management
- `GET /users` - Get all users (with filters: role, status, search, pagination)
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id/role` - Update user role (Super Admin only)
- `PATCH /users/:id/status` - Update user status (active/inactive)

### Agent Management
- `POST /agents` - Create new agent
- `POST /users/:id/convert-to-agent` - Convert customer to agent
- `POST /users/:id/verify` - Verify agent/doctor (approve/reject)

## 📱 Mobile APIs

**Base URL:** `/api/v1/mobile`  
**Access:** Public (register) or Authenticated (others)

### Authentication
- `POST /auth/register` - Register new customer (mobile/web)

### Profile
- `GET /profile` - Get user profile (authenticated)
- `PATCH /profile` - Update user profile (authenticated)

### Verification
- `POST /agents/request-verification` - Request agent verification
- `POST /doctors/request-verification` - Request doctor verification
- `GET /verification/status` - Get verification status

## 🔑 Standard Auth APIs

**Base URL:** `/api/v1/auth`

- `POST /register` - Register user
- `POST /login` - Login user
- `GET /me` - Get current user

## 🏢 Business APIs

**Base URL:** `/api/v1`

- `/agents` - Agent management
- `/properties` - Property management
- `/auction-requests` - Auction management
- `/payments` - Payment management

## 👥 User Roles

### Admin Roles
- `super_admin` - Full system access
- `admin` - Admin access
- `subadmin_support` - Support subadmin
- `subadmin_agent` - Agent management subadmin
- `subadmin_reseller` - Reseller management subadmin
- `subadmin_marketing` - Marketing subadmin

### User Roles
- `agent` - Real estate agent (requires verification)
- `doctor` - Doctor (requires verification)
- `customer` - Regular customer (from mobile/web)

## 🔐 Authentication

All protected routes require JWT token in header:
```
Authorization: Bearer <token>
```

## 📝 Example Requests

### Register Customer (Mobile)
```bash
POST /api/v1/mobile/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "password123",
  "source": "mobile"
}
```

### Create Agent (Admin)
```bash
POST /api/v1/admin/agents
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Jane Agent",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "password": "password123",
  "agentCode": "AGT-12345678"
}
```

### Request Agent Verification (Mobile)
```bash
POST /api/v1/mobile/agents/request-verification
Authorization: Bearer <customer_token>
Content-Type: application/json

{
  "documents": [
    "https://example.com/doc1.pdf",
    "https://example.com/doc2.pdf"
  ]
}
```

### Verify Agent (Admin)
```bash
POST /api/v1/admin/users/:id/verify
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "approved",
  "notes": "Documents verified successfully"
}
```

