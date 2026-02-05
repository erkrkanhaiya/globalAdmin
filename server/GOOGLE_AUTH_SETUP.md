# Google Authentication Setup

## Overview
This document describes the Google Sign-In implementation for user registration and login.

## Features Implemented

### 1. User Registration
- **Email/Password Registration**: Users can register with full name, email, password, and optional mobile number with country code
- **Google Sign-In Registration**: Users can register using their Google account
- **Mobile Support**: Optional mobile number with country code (e.g., +1, +91)

### 2. User Login
- **Email Login**: Login using email and password
- **Mobile Login**: Login using mobile number (with country code) and password
- **Google Login**: Login using Google ID token

## API Endpoints

### Register User
```
POST /api/v1/user/auth/register
```

**Request Body (Email/Password):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "mobile": "1234567890",
  "countryCode": "+1",
  "source": "web"
}
```

**Request Body (Google Sign-In):**
```json
{
  "googleIdToken": "google_id_token_here",
  "name": "John Doe",  // Optional, will use Google name if not provided
  "mobile": "1234567890",  // Optional
  "countryCode": "+1",  // Optional
  "source": "web"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "mobile": {
        "number": "1234567890",
        "countryCode": "+1",
        "fullNumber": "+11234567890"
      },
      "role": "customer",
      "avatar": "profile_picture_url",
      "authProvider": "email", // or "google"
      "source": "web"
    },
    "token": "jwt_token_here"
  }
}
```

### Login User
```
POST /api/v1/user/auth/login
```

**Request Body (Email/Password):**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Request Body (Mobile/Password):**
```json
{
  "mobile": "1234567890",
  "countryCode": "+1",
  "password": "password123"
}
```

**Request Body (Google Login):**
```json
{
  "googleIdToken": "google_id_token_here"
}
```

**Response:**
```json
{
  "status": "success",
  "message": "Logged in successfully",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "mobile": {
        "number": "1234567890",
        "countryCode": "+1",
        "fullNumber": "+11234567890"
      },
      "role": "customer",
      "avatar": "profile_picture_url",
      "authProvider": "email",
      "source": "web"
    },
    "token": "jwt_token_here"
  }
}
```

## User Model Updates

### New Fields
- `googleId`: Google user ID (unique, sparse index)
- `authProvider`: Either 'email' or 'google'
- `mobile`: Object containing:
  - `number`: Mobile number
  - `countryCode`: Country code (default: '+1')
  - `fullNumber`: Auto-generated full number (countryCode + number)

### Updated Fields
- `password`: Now optional (required only for email auth)
- `avatar`: Can be set from Google profile picture

## Environment Variables

Add these to your `.env` file:

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Choose "Web application" as the application type
6. Add authorized JavaScript origins:
   - `http://localhost:5173` (for development)
   - Your production domain
7. Add authorized redirect URIs:
   - `http://localhost:5173/auth/callback` (for development)
   - Your production callback URL
8. Copy the Client ID and Client Secret to your `.env` file

## Frontend Integration

### Google Sign-In Button (React Example)

```jsx
import { GoogleLogin } from '@react-oauth/google';

function LoginPage() {
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/user/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          googleIdToken: credentialResponse.credential,
        }),
      });
      const data = await response.json();
      // Store token and redirect
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleGoogleSuccess}
      onError={() => {
        console.log('Login Failed');
      }}
    />
  );
}
```

## Features

1. **Account Linking**: If a user registers with email and later signs in with Google using the same email, the Google ID will be linked to the existing account
2. **Mobile Number Support**: Users can register/login with mobile number and country code
3. **Automatic Avatar**: Google profile picture is automatically set as avatar
4. **Flexible Authentication**: Users can switch between email and Google authentication (if linked)

## Error Handling

- `400`: Validation error or user already exists
- `401`: Invalid credentials or Google token verification failed
- `404`: User not found (for Google login)
- `500`: Google OAuth not configured

## Security Notes

1. Google ID tokens are verified server-side for security
2. Passwords are hashed using bcrypt
3. JWT tokens are used for authentication
4. All sensitive operations require authentication

