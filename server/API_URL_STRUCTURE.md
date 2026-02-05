# API URL Structure

## 📡 API Base URL
`http://localhost:3000/api/v1`

## 🔐 Authentication Endpoints
**Base:** `/api/v1/auth`

- `POST /auth/register` - Register user
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user

## 👤 User Endpoints (Regular Users - Mobile/Web)
**Base:** `/api/v1/user`

All user-facing endpoints for customers, agents, and doctors:

### Registration & Profile
- `POST /user/auth/register` - Register customer
- `GET /user/profile` - Get user profile
- `PATCH /user/profile` - Update profile

### Verification
- `POST /user/agents/request-verification` - Request agent verification
- `POST /user/doctors/request-verification` - Request doctor verification
- `GET /user/verification/status` - Get verification status

**Access:** Public (register) or Authenticated (others)

## 👑 Admin Endpoints (Admin/Super Admin Only)
**Base:** `/api/v1/admin`

All admin management endpoints:

### Dashboard
- `GET /admin/dashboard` - Dashboard statistics

### Users Management
- `GET /admin/users` - Get all users
- `GET /admin/users/:id` - Get user by ID
- `PATCH /admin/users/:id/role` - Update role (Super Admin only)
- `PATCH /admin/users/:id/status` - Update status
- `POST /admin/users/:id/verify` - Verify agent/doctor
- `POST /admin/users/:id/convert-to-agent` - Convert customer to agent
- `POST /admin/agents` - Create user with agent role

### Properties Management
- `GET /admin/properties` - Get all properties
- `GET /admin/properties/:id` - Get property by ID
- `POST /admin/properties` - Create property
- `PUT /admin/properties/:id` - Update property
- `DELETE /admin/properties/:id` - Delete property

### Agents Management
- `GET /admin/agents` - Get all agents
- `GET /admin/agents/:id` - Get agent by ID
- `POST /admin/agents` - Create agent
- `PUT /admin/agents/:id` - Update agent
- `DELETE /admin/agents/:id` - Delete agent

### Payments Management
- `GET /admin/payments` - Get all payments
- `GET /admin/payments/stats` - Payment statistics
- `GET /admin/payments/:id` - Get payment by ID
- `PATCH /admin/payments/:id/status` - Update payment status

### Auction Requests Management
- `GET /admin/auction-requests` - Get all requests
- `GET /admin/auction-requests/:id` - Get request by ID
- `POST /admin/auction-requests/:id/approve` - Approve request
- `POST /admin/auction-requests/:id/decline` - Decline request
- `DELETE /admin/auction-requests/:id` - Delete request

### Support Tickets Management
- `GET /admin/support/tickets` - Get all tickets
- `GET /admin/support/tickets/:id` - Get ticket by ID
- `PATCH /admin/support/tickets/:id/status` - Update status
- `POST /admin/support/tickets/:id/reply` - Add reply
- `DELETE /admin/support/tickets/:id` - Delete ticket

**Access:** Admin/Super Admin only (Bearer token required)

## 📊 Business Routes (Protected)
**Base:** `/api/v1`

- `/agents` - Agent operations
- `/properties` - Property operations
- `/auction-requests` - Auction operations
- `/payments` - Payment operations
- `/support` - Support operations

## ✅ Summary

- **`/auth`** - Authentication (Public/Protected)
- **`/user`** - User endpoints (Public/Protected)
- **`/admin`** - Admin endpoints (Admin/Super Admin only)
- **`/agents`, `/properties`, etc.** - Business routes (Protected)

All endpoints are properly organized and separated by user type!

