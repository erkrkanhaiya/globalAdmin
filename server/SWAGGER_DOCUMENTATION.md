# Swagger API Documentation

Each product has its own separate Swagger documentation endpoint. This allows you to view and test API endpoints for each product independently.

## Swagger Endpoints

### Main API (All Products)
- **URL**: `http://localhost:5001/api-docs`
- **Description**: Main API documentation (includes all products and global endpoints)
- **Authentication**: Basic Auth (username: `admin`, password: `I9dUyVAWjVVY6Cj4`)

### Restaurant API
- **URL**: `http://localhost:5002/api-docs`
- **Port**: 5002
- **Base Path**: `/api/v1/restaurant`
- **Description**: Restaurant-specific API documentation
- **Authentication**: Basic Auth (username: `admin`, password: `I9dUyVAWjVVY6Cj4`)
- **JSON Endpoint**: `http://localhost:5002/api-docs/.json`

### LiveNotes API
- **URL**: `http://localhost:5003/api-docs`
- **Port**: 5003
- **Base Path**: `/api/v1/livenotes`
- **Description**: LiveNotes-specific API documentation
- **Authentication**: Basic Auth (username: `admin`, password: `I9dUyVAWjVVY6Cj4`)
- **JSON Endpoint**: `http://localhost:5003/api-docs/.json`

### RentalCabBooking API
- **URL**: `http://localhost:5004/api-docs`
- **Port**: 5004
- **Base Path**: `/api/v1/rentalcabbooking`
- **Description**: RentalCabBooking-specific API documentation
- **Authentication**: Basic Auth (username: `admin`, password: `I9dUyVAWjVVY6Cj4`)
- **JSON Endpoint**: `http://localhost:5004/api-docs/.json`

### WhatsAppAPI
- **URL**: `http://localhost:5005/api-docs`
- **Port**: 5005
- **Base Path**: `/api/v1/whatsappapi`
- **Description**: WhatsAppAPI-specific API documentation
- **Authentication**: Basic Auth (username: `admin`, password: `I9dUyVAWjVVY6Cj4`)
- **JSON Endpoint**: `http://localhost:5005/api-docs/.json`

### CRM API
- **URL**: `http://localhost:5006/api-docs`
- **Port**: 5006
- **Base Path**: `/api/v1/crm`
- **Description**: CRM-specific API documentation
- **Authentication**: Basic Auth (username: `admin`, password: `I9dUyVAWjVVY6Cj4`)
- **JSON Endpoint**: `http://localhost:5006/api-docs/.json`

## Accessing Swagger Documentation

### Local Development

1. **Start the product server**:
   ```bash
   # Restaurant
   npm run dev:restaurant
   
   # LiveNotes
   npm run dev:livenotes
   
   # RentalCabBooking
   npm run dev:rentalcabbooking
   
   # WhatsAppAPI
   npm run dev:whatsappapi
   
   # CRM
   npm run dev:crm
   ```

2. **Open Swagger UI**:
   - Navigate to the Swagger URL for the product (e.g., `http://localhost:5002/api-docs`)
   - Enter Basic Auth credentials when prompted:
     - Username: `admin`
     - Password: `I9dUyVAWjVVY6Cj4`

### Production

Each product's Swagger documentation is available at:
- Restaurant: `https://api.restaurant.yourdomain.com/api-docs`
- LiveNotes: `https://api.livenotes.yourdomain.com/api-docs`
- RentalCabBooking: `https://api.rentalcabbooking.yourdomain.com/api-docs`
- WhatsAppAPI: `https://api.whatsappapi.yourdomain.com/api-docs`
- CRM: `https://api.crm.yourdomain.com/api-docs`

## Swagger Configuration

### Environment Variables

Swagger can be enabled/disabled and configured via environment variables:

```env
# Enable/disable Swagger
SWAGGER_ENABLED=true

# Swagger path (default: /api-docs)
SWAGGER_PATH=/api-docs

# Swagger Basic Auth credentials
SWAGGER_USERNAME=admin
SWAGGER_PASSWORD=I9dUyVAWjVVY6Cj4
```

### Swagger Config Files

Each product has its own Swagger configuration file:
- Restaurant: `src/config/swagger.restaurant.ts`
- LiveNotes: `src/config/swagger.livenotes.ts`
- RentalCabBooking: `src/config/swagger.rentalcabbooking.ts`
- WhatsAppAPI: `src/config/swagger.whatsappapi.ts`
- CRM: `src/config/swagger.crm.ts`

## API Tags

Each product's Swagger documentation includes the following tags:

### Restaurant
- Restaurant - Auth
- Restaurant - Users
- Restaurant - Admin
- Restaurant - Orders
- Restaurant - Agents
- Restaurant - Properties
- Restaurant - Support
- Restaurant - Payments
- Restaurant - Auctions

### LiveNotes
- LiveNotes - Auth
- LiveNotes - Users
- LiveNotes - Admin
- LiveNotes - Notes
- LiveNotes - Agents
- LiveNotes - Properties
- LiveNotes - Support
- LiveNotes - Payments
- LiveNotes - Auctions

### RentalCabBooking
- RentalCabBooking - Auth
- RentalCabBooking - Users
- RentalCabBooking - Admin
- RentalCabBooking - Bookings
- RentalCabBooking - Agents
- RentalCabBooking - Properties
- RentalCabBooking - Support
- RentalCabBooking - Payments
- RentalCabBooking - Auctions

### WhatsAppAPI
- WhatsAppAPI - Auth
- WhatsAppAPI - Users
- WhatsAppAPI - Admin
- WhatsAppAPI - Messages
- WhatsAppAPI - Agents
- WhatsAppAPI - Properties
- WhatsAppAPI - Support
- WhatsAppAPI - Payments
- WhatsAppAPI - Auctions

### CRM
- CRM - Auth
- CRM - Users
- CRM - Admin
- CRM - Contacts
- CRM - Leads
- CRM - Agents
- CRM - Properties
- CRM - Support
- CRM - Payments
- CRM - Auctions

## Testing APIs in Swagger

1. **Authenticate**:
   - Use Basic Auth for public endpoints (login/register)
   - Use Bearer Token for protected endpoints

2. **Get JWT Token**:
   - Call `/api/v1/{product}/auth/login` with Basic Auth
   - Copy the token from the response
   - Click "Authorize" button in Swagger UI
   - Enter: `Bearer <your-token>`

3. **Test Endpoints**:
   - All endpoints are pre-configured with the correct base path
   - Try it out directly from Swagger UI
   - View request/response examples

## JSON Export

You can export the Swagger specification as JSON:
- Restaurant: `http://localhost:5002/api-docs/.json`
- LiveNotes: `http://localhost:5003/api-docs/.json`
- RentalCabBooking: `http://localhost:5004/api-docs/.json`
- WhatsAppAPI: `http://localhost:5005/api-docs/.json`
- CRM: `http://localhost:5006/api-docs/.json`

This JSON can be imported into:
- Postman
- Insomnia
- Other API testing tools
- API documentation generators

## Notes

- Each product's Swagger documentation only includes endpoints for that specific product
- All endpoints are automatically documented from JSDoc comments in the code
- Swagger UI persists authorization tokens across page refreshes
- Each product server must be running to access its Swagger documentation
