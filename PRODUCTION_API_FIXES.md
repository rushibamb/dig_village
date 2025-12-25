# Production API Connectivity & CORS Fixes

## Summary of Changes

This document outlines all the fixes applied to resolve production API connectivity and CORS issues.

## ✅ Changes Made

### 1. Frontend API Configuration (`client/src/services/api.js`)

**Problem**: 
- Used `VITE_API_BASE_URL` with `http://localhost:5000` as fallback
- This caused production deployments to try connecting to localhost, resulting in `ERR_CONNECTION_REFUSED`

**Fix**:
- Changed to use `VITE_API_URL` environment variable
- Removed localhost fallback - now fails explicitly if not set
- Added URL normalization to handle URLs with or without `/api` suffix
- Improved error logging to help debug missing environment variables

**Key Changes**:
```javascript
// Before
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// After
const API_BASE_URL = import.meta.env.VITE_API_URL;
// No fallback - explicit error if not set
```

### 2. Backend CORS Configuration (`server/src/index.js`)

**Problem**:
- Missing production Vercel URL in CORS origins
- CORS middleware was correctly placed, but origins were incomplete
- Missing some HTTP methods and headers

**Fix**:
- Added `https://dig-village.vercel.app` to allowed origins
- Kept existing `https://dig-village-rushikesh-bambs-projects.vercel.app`
- Added `PATCH` and `OPTIONS` methods
- Added explicit `allowedHeaders` configuration
- Added Vite dev server port (5173) for local development

**Key Changes**:
```javascript
app.use(cors({
  origin: [
    "https://dig-village.vercel.app",  // Added
    "https://dig-village-rushikesh-bambs-projects.vercel.app",
    "http://localhost:3000",
    "http://localhost:5173"  // Added for Vite
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],  // Added PATCH, OPTIONS
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]  // Added
}));
```

### 3. Cloudinary Secure Configuration (`server/src/controllers/mediaUploadController.js`)

**Problem**:
- Cloudinary was not configured with `secure: true`
- This could cause mixed content issues (HTTP images on HTTPS pages)

**Fix**:
- Added `secure: true` to Cloudinary configuration
- This ensures all Cloudinary URLs use HTTPS

**Key Changes**:
```javascript
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true  // Added - forces HTTPS URLs
});
```

## 📋 Required Environment Variables

### Frontend (Vercel)
Set in Vercel project settings → Environment Variables:
```
VITE_API_URL=https://dig-village.onrender.com
```

### Backend (Render)
Ensure these are set in Render environment variables:
```
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## 🔍 Verification Steps

1. **Frontend API Calls**:
   - Check browser console for API configuration log (dev mode)
   - Verify network requests go to `https://dig-village.onrender.com/api/*`
   - No `ERR_CONNECTION_REFUSED` errors

2. **CORS**:
   - Test API calls from production frontend
   - Check browser console for CORS errors
   - Verify preflight OPTIONS requests succeed

3. **Cloudinary**:
   - Upload an image through the app
   - Verify the returned URL uses `https://` protocol
   - Check that images load correctly on HTTPS pages

## 🚨 Important Notes

1. **No Localhost Fallback**: The frontend will now fail explicitly if `VITE_API_URL` is not set. This prevents silent failures in production.

2. **Environment Variable Naming**: Changed from `VITE_API_BASE_URL` to `VITE_API_URL` for consistency.

3. **URL Normalization**: The API client automatically handles URLs with or without `/api` suffix, but it's recommended to set the base URL without `/api`.

4. **CORS Order**: CORS middleware is correctly placed before all routes in `server/src/index.js`.

## 📝 Next Steps

1. **Set Environment Variables**:
   - Add `VITE_API_URL` in Vercel project settings
   - Redeploy frontend

2. **Test Production**:
   - Deploy and test all API endpoints
   - Verify image uploads return HTTPS URLs
   - Check browser console for any remaining errors

3. **Monitor**:
   - Watch for CORS errors in production
   - Monitor API connection errors
   - Verify all Cloudinary URLs use HTTPS

