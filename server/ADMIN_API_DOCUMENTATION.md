# Admin API Documentation

All admin endpoints are under `/api/v1/admin` and require **Admin** or **Super Admin** role.

## 🔐 Authentication

All endpoints require JWT token:
```
Authorization: Bearer <token>
```

## 📊 Dashboard

### Get Dashboard Statistics
```
GET /api/v1/admin/dashboard
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "stats": {
      "users": { "total": 100, "active": 85, "byRole": [...] },
      "properties": { "total": 250, "available": 180, "byStatus": [...] },
      "agents": { "total": 50, "active": 45 },
      "payments": { "total": 500, "completed": 450, "revenue": 5000000 },
      "auctions": { "pending": 10 },
      "support": { "open": 5 }
    },
    "recent": {
      "payments": [...],
      "users": [...]
    }
  }
}
```

## 👥 Users Management

### Get All Users
```
GET /api/v1/admin/users?role=agent&status=active&search=john&page=1&limit=20
```

**Query Parameters:**
- `role` - Filter by role
- `status` - Filter by status (active/inactive/verified/pending)
- `search` - Search in name, email, phone
- `page` - Page number
- `limit` - Items per page

### Get User by ID
```
GET /api/v1/admin/users/:id
```

### Update User Role (Super Admin only)
```
PATCH /api/v1/admin/users/:id/role
Body: { "role": "admin" }
```

### Update User Status
```
PATCH /api/v1/admin/users/:id/status
Body: { "isActive": true }
```

### Verify User (Agent/Doctor)
```
POST /api/v1/admin/users/:id/verify
Body: { "status": "approved", "notes": "Documents verified" }
```

### Convert Customer to Agent
```
POST /api/v1/admin/users/:id/convert-to-agent
Body: { "agentCode": "AGT-12345678" } (optional)
```

### Create Agent (User with agent role)
```
POST /api/v1/admin/agents
Body: {
  "name": "John Agent",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "password123",
  "agentCode": "AGT-12345678" (optional)
}
```

## 🏠 Properties Management

### Get All Properties
```
GET /api/v1/admin/properties?status=available&type=house&search=New York&page=1&limit=20
```

### Get Property by ID
```
GET /api/v1/admin/properties/:id
```

### Create Property
```
POST /api/v1/admin/properties
Body: {
  "name": "Luxury Villa",
  "type": "villa",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "price": 500000,
  "bedrooms": 4,
  "bathrooms": 3,
  "area": 2500,
  "images": ["url1", "url2"],
  "agentId": "agent_id"
}
```

### Update Property
```
PUT /api/v1/admin/properties/:id
Body: { "price": 550000, "status": "sold" }
```

### Delete Property
```
DELETE /api/v1/admin/properties/:id
```

## 👤 Agents Management (Agent Documents)

### Get All Agents
```
GET /api/v1/admin/agents?status=active&search=john&page=1&limit=20
```

### Get Agent by ID
```
GET /api/v1/admin/agents/:id
```

### Create Agent Document
```
POST /api/v1/admin/agents
Body: {
  "name": "John Agent",
  "email": "john@example.com",
  "phone": "+1234567890",
  "bio": "Experienced real estate agent",
  "address": "123 Main St",
  "city": "New York",
  "status": "active"
}
```

### Update Agent
```
PUT /api/v1/admin/agents/:id
Body: { "status": "inactive", "rating": 4.5 }
```

### Delete Agent
```
DELETE /api/v1/admin/agents/:id
```

## 💰 Payments Management

### Get All Payments
```
GET /api/v1/admin/payments?status=completed&userId=user_id&page=1&limit=20
```

**Query Parameters:**
- `status` - Filter by status
- `userId` - Filter by user
- `propertyId` - Filter by property
- `page` - Page number
- `limit` - Items per page

### Get Payment Statistics
```
GET /api/v1/admin/payments/stats?startDate=2024-01-01&endDate=2024-12-31
```

### Get Payment by ID
```
GET /api/v1/admin/payments/:id
```

### Update Payment Status
```
PATCH /api/v1/admin/payments/:id/status
Body: { "status": "completed" }
```

## 🔨 Auction Requests Management

### Get All Auction Requests
```
GET /api/v1/admin/auction-requests?status=pending&page=1&limit=20
```

### Get Auction Request by ID
```
GET /api/v1/admin/auction-requests/:id
```

### Approve Auction Request
```
POST /api/v1/admin/auction-requests/:id/approve
Body: {
  "auctionDate": "2024-12-25T10:00:00Z",
  "paymentLink": "https://payment.link"
}
```

### Decline Auction Request
```
POST /api/v1/admin/auction-requests/:id/decline
Body: { "declineReason": "Insufficient documentation" }
```

### Delete Auction Request
```
DELETE /api/v1/admin/auction-requests/:id
```

## 🎫 Support Tickets Management

### Get All Support Tickets
```
GET /api/v1/admin/support/tickets?status=open&category=technical&priority=high&page=1&limit=20
```

### Get Ticket by ID
```
GET /api/v1/admin/support/tickets/:id
```

### Update Ticket Status
```
PATCH /api/v1/admin/support/tickets/:id/status
Body: {
  "status": "resolved",
  "assignedTo": "user_id" (optional)
}
```

### Add Reply to Ticket
```
POST /api/v1/admin/support/tickets/:id/reply
Body: { "message": "Issue resolved. Please check your account." }
```

### Delete Ticket
```
DELETE /api/v1/admin/support/tickets/:id
```

## 📝 Example Requests

### Create Property
```bash
POST /api/v1/admin/properties
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Modern Apartment",
  "type": "apartment",
  "address": "456 Park Ave",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "price": 300000,
  "bedrooms": 2,
  "bathrooms": 2,
  "area": 1200,
  "images": ["https://example.com/image1.jpg"],
  "agentId": "64f8a1b2c3d4e5f6a7b8c9d0"
}
```

### Approve Auction Request
```bash
POST /api/v1/admin/auction-requests/64f8a1b2c3d4e5f6a7b8c9d0/approve
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "auctionDate": "2024-12-25T10:00:00Z",
  "paymentLink": "https://payment.example.com/pay/123"
}
```

### Update Payment Status
```bash
PATCH /api/v1/admin/payments/64f8a1b2c3d4e5f6a7b8c9d0/status
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "status": "completed"
}
```

## ✅ All Admin APIs Connected

All admin endpoints are now properly connected and available under `/api/v1/admin/`:

- ✅ Dashboard statistics
- ✅ Users management (CRUD + verification)
- ✅ Properties management (CRUD)
- ✅ Agents management (CRUD)
- ✅ Payments management (view, update status, stats)
- ✅ Auction requests management (view, approve, decline, delete)
- ✅ Support tickets management (view, update, reply, delete)

