# Multi-Host Deployment Guide

This guide explains how to deploy each product on separate hosts/servers.

## Overview

Each product can now run as a standalone server on its own host, port, and domain. This allows for:
- Independent scaling
- Separate deployments
- Different hosting providers
- Isolated environments

## Product Ports (Default)

- **Restaurant**: Port 5002
- **LiveNotes**: Port 5003
- **RentalCabBooking**: Port 5004
- **WhatsAppAPI**: Port 5005
- **CRM**: Port 5006

## Local Development

### Run Individual Products

```bash
# Restaurant
npm run dev:restaurant
# Runs on http://localhost:5002

# LiveNotes
npm run dev:livenotes
# Runs on http://localhost:5003

# RentalCabBooking
npm run dev:rentalcabbooking
# Runs on http://localhost:5004

# WhatsAppAPI
npm run dev:whatsappapi
# Runs on http://localhost:5005

# CRM
npm run dev:crm
# Runs on http://localhost:5006
```

### Run All Products (Development)

You can run multiple products simultaneously in separate terminals.

## Production Deployment

### 1. Build the Project

```bash
npm run build
```

This compiles all TypeScript files, including standalone server files.

### 2. Environment Configuration

Create separate `.env` files for each product or use environment variables:

#### Restaurant (.env.restaurant)
```env
NODE_ENV=production
PORT=5002
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=restaurant_db
JWT_SECRET=your-jwt-secret
JWT_EXPIRE=30d
CORS_ORIGIN=https://restaurant.yourdomain.com
```

#### LiveNotes (.env.livenotes)
```env
NODE_ENV=production
PORT=5003
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=livenotes_db
JWT_SECRET=your-jwt-secret
JWT_EXPIRE=30d
CORS_ORIGIN=https://livenotes.yourdomain.com
```

Repeat for other products with their respective ports and database names.

### 3. Start Individual Products

```bash
# Restaurant
PORT=5002 node dist/products/restaurant/server.js

# LiveNotes
PORT=5003 node dist/products/livenotes/server.js

# RentalCabBooking
PORT=5004 node dist/products/rentalcabbooking/server.js

# WhatsAppAPI
PORT=5005 node dist/products/whatsappapi/server.js

# CRM
PORT=5006 node dist/products/crm/server.js
```

Or use PM2 for process management:

```bash
# Install PM2
npm install -g pm2

# Start Restaurant
pm2 start dist/products/restaurant/server.js --name restaurant --env PORT=5002

# Start LiveNotes
pm2 start dist/products/livenotes/server.js --name livenotes --env PORT=5003

# Start RentalCabBooking
pm2 start dist/products/rentalcabbooking/server.js --name rentalcabbooking --env PORT=5004

# Start WhatsAppAPI
pm2 start dist/products/whatsappapi/server.js --name whatsappapi --env PORT=5005

# Start CRM
pm2 start dist/products/crm/server.js --name crm --env PORT=5006

# Save PM2 configuration
pm2 save

# Setup PM2 to start on system boot
pm2 startup
```

### 4. Using PM2 Ecosystem File

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [
    {
      name: 'restaurant',
      script: 'dist/products/restaurant/server.js',
      env: {
        PORT: 5002,
        NODE_ENV: 'production',
        MONGODB_DB_NAME: 'restaurant_db',
      },
    },
    {
      name: 'livenotes',
      script: 'dist/products/livenotes/server.js',
      env: {
        PORT: 5003,
        NODE_ENV: 'production',
        MONGODB_DB_NAME: 'livenotes_db',
      },
    },
    {
      name: 'rentalcabbooking',
      script: 'dist/products/rentalcabbooking/server.js',
      env: {
        PORT: 5004,
        NODE_ENV: 'production',
        MONGODB_DB_NAME: 'rentalcabbooking_db',
      },
    },
    {
      name: 'whatsappapi',
      script: 'dist/products/whatsappapi/server.js',
      env: {
        PORT: 5005,
        NODE_ENV: 'production',
        MONGODB_DB_NAME: 'whatsappapi_db',
      },
    },
    {
      name: 'crm',
      script: 'dist/products/crm/server.js',
      env: {
        PORT: 5006,
        NODE_ENV: 'production',
        MONGODB_DB_NAME: 'crm_db',
      },
    },
  ],
}
```

Then run:
```bash
pm2 start ecosystem.config.js
pm2 save
```

## Docker Deployment

### Dockerfile for Individual Products

Create `Dockerfile.restaurant`:

```dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy built files
COPY dist/ ./dist/

# Set environment
ENV NODE_ENV=production
ENV PORT=5002

# Expose port
EXPOSE 5002

# Start server
CMD ["node", "dist/products/restaurant/server.js"]
```

### Docker Compose for All Products

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  restaurant:
    build:
      context: .
      dockerfile: Dockerfile.restaurant
    ports:
      - "5002:5002"
    environment:
      - NODE_ENV=production
      - PORT=5002
      - MONGODB_URI=mongodb://mongo:27017
      - MONGODB_DB_NAME=restaurant_db
    depends_on:
      - mongo
    restart: unless-stopped

  livenotes:
    build:
      context: .
      dockerfile: Dockerfile.livenotes
    ports:
      - "5003:5003"
    environment:
      - NODE_ENV=production
      - PORT=5003
      - MONGODB_URI=mongodb://mongo:27017
      - MONGODB_DB_NAME=livenotes_db
    depends_on:
      - mongo
    restart: unless-stopped

  rentalcabbooking:
    build:
      context: .
      dockerfile: Dockerfile.rentalcabbooking
    ports:
      - "5004:5004"
    environment:
      - NODE_ENV=production
      - PORT=5004
      - MONGODB_URI=mongodb://mongo:27017
      - MONGODB_DB_NAME=rentalcabbooking_db
    depends_on:
      - mongo
    restart: unless-stopped

  whatsappapi:
    build:
      context: .
      dockerfile: Dockerfile.whatsappapi
    ports:
      - "5005:5005"
    environment:
      - NODE_ENV=production
      - PORT=5005
      - MONGODB_URI=mongodb://mongo:27017
      - MONGODB_DB_NAME=whatsappapi_db
    depends_on:
      - mongo
    restart: unless-stopped

  crm:
    build:
      context: .
      dockerfile: Dockerfile.crm
    ports:
      - "5006:5006"
    environment:
      - NODE_ENV=production
      - PORT=5006
      - MONGODB_URI=mongodb://mongo:27017
      - MONGODB_DB_NAME=crm_db
    depends_on:
      - mongo
    restart: unless-stopped

  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    restart: unless-stopped

volumes:
  mongo_data:
```

## Nginx Reverse Proxy

Configure Nginx to route different domains to different products:

```nginx
# Restaurant API
server {
    listen 80;
    server_name api.restaurant.yourdomain.com;

    location / {
        proxy_pass http://localhost:5002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# LiveNotes API
server {
    listen 80;
    server_name api.livenotes.yourdomain.com;

    location / {
        proxy_pass http://localhost:5003;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# RentalCabBooking API
server {
    listen 80;
    server_name api.rentalcabbooking.yourdomain.com;

    location / {
        proxy_pass http://localhost:5004;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# WhatsAppAPI
server {
    listen 80;
    server_name api.whatsappapi.yourdomain.com;

    location / {
        proxy_pass http://localhost:5005;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# CRM API
server {
    listen 80;
    server_name api.crm.yourdomain.com;

    location / {
        proxy_pass http://localhost:5006;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Separate Hosts/Servers

To deploy each product on completely separate servers:

1. **Clone the repository** on each server
2. **Build the project**: `npm run build`
3. **Copy only the needed product files** (optional optimization)
4. **Set environment variables** for that specific product
5. **Start the product server**: `npm run start:restaurant` (or respective product)

### Example: Deploy Restaurant on Server 1

```bash
# On Server 1 (restaurant.yourdomain.com)
git clone <your-repo>
cd <your-repo>/server
npm install
npm run build

# Set environment
export PORT=5002
export MONGODB_DB_NAME=restaurant_db
export NODE_ENV=production

# Start
npm run start:restaurant
```

### Example: Deploy LiveNotes on Server 2

```bash
# On Server 2 (livenotes.yourdomain.com)
git clone <your-repo>
cd <your-repo>/server
npm install
npm run build

# Set environment
export PORT=5003
export MONGODB_DB_NAME=livenotes_db
export NODE_ENV=production

# Start
npm run start:livenotes
```

## Health Checks

Each product server has a health check endpoint:

- Restaurant: `http://localhost:5002/health`
- LiveNotes: `http://localhost:5003/health`
- RentalCabBooking: `http://localhost:5004/health`
- WhatsAppAPI: `http://localhost:5005/health`
- CRM: `http://localhost:5006/health`

## API Endpoints

Each product exposes its API at `/api/v1`:

- Restaurant: `http://localhost:5002/api/v1/auth/login`
- LiveNotes: `http://localhost:5003/api/v1/auth/login`
- etc.

## Notes

- Each product connects to the **main database** to look up product configuration
- Each product uses its **own database** for data storage
- Products can be scaled independently
- Products can be deployed on different cloud providers
- Each product has its own health check and monitoring

## Troubleshooting

### Port Already in Use
If a port is already in use, change the PORT environment variable:
```bash
PORT=6002 npm run start:restaurant
```

### Database Connection Issues
Ensure:
1. Main database is accessible (for product lookup)
2. Product-specific database exists
3. MongoDB connection string is correct

### Module Not Found
Make sure you've built the project:
```bash
npm run build
```
