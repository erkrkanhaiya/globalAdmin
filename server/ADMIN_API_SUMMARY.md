# Admin API Summary

## ✅ All Admin APIs Created and Connected

All admin endpoints are now available under `/api/v1/admin/` and require **Admin** or **Super Admin** authentication.

### 📊 Dashboard
- `GET /admin/dashboard` - Dashboard statistics

### 👥 Users Management (7 endpoints)
- `GET /admin/users` - Get all users (with filters)
- `GET /admin/users/:id` - Get user by ID
- `PATCH /admin/users/:id/role` - Update user role (Super Admin only)
- `PATCH /admin/users/:id/status` - Update user status
- `POST /admin/users/:id/verify` - Verify agent/doctor
- `POST /admin/users/:id/convert-to-agent` - Convert customer to agent
- `POST /admin/agents` - Create user with agent role (from adminController)

### 🏠 Properties Management (5 endpoints)
- `GET /admin/properties` - Get all properties
- `GET /admin/properties/:id` - Get property by ID
- `POST /admin/properties` - Create property
- `PUT /admin/properties/:id` - Update property
- `DELETE /admin/properties/:id` - Delete property

### 👤 Agents Management - Agent Documents (5 endpoints)
- `GET /admin/agents` - Get all agents (Agent documents)
- `GET /admin/agents/:id` - Get agent by ID
- `POST /admin/agents` - Create agent document
- `PUT /admin/agents/:id` - Update agent
- `DELETE /admin/agents/:id` - Delete agent

### 💰 Payments Management (4 endpoints)
- `GET /admin/payments` - Get all payments
- `GET /admin/payments/stats` - Get payment statistics
- `GET /admin/payments/:id` - Get payment by ID
- `PATCH /admin/payments/:id/status` - Update payment status

### 🔨 Auction Requests Management (5 endpoints)
- `GET /admin/auction-requests` - Get all auction requests
- `GET /admin/auction-requests/:id` - Get request by ID
- `POST /admin/auction-requests/:id/approve` - Approve request
- `POST /admin/auction-requests/:id/decline` - Decline request
- `DELETE /admin/auction-requests/:id` - Delete request

### 🎫 Support Tickets Management (5 endpoints)
- `GET /admin/support/tickets` - Get all tickets
- `GET /admin/support/tickets/:id` - Get ticket by ID
- `PATCH /admin/support/tickets/:id/status` - Update ticket status
- `POST /admin/support/tickets/:id/reply` - Add reply to ticket
- `DELETE /admin/support/tickets/:id` - Delete ticket

## 📊 Total: 31 Admin Endpoints

All endpoints are:
- ✅ Protected with authentication
- ✅ Require Admin or Super Admin role
- ✅ Properly documented with Swagger
- ✅ Connected and ready to use

## 🔗 Base URL

All endpoints: `http://localhost:3000/api/v1/admin/...`

## 📚 Swagger Documentation

View all endpoints: `http://localhost:3000/api-docs`

