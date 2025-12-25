# 🐛 Debugging Production API Issues

## Current Error Analysis

You're seeing these errors in production:
```
localhost:5000/api/homepage/site-settings:1 Failed to load resource: net::ERR_CONNECTION_REFUSED
localhost:5000/api/homepage/facilities:1 Failed to load resource: net::ERR_CONNECTION_REFUSED
localhost:5000/api/villagers/stats:1 Failed to load resource: net::ERR_CONNECTION_REFUSED
```

## Root Cause

The error shows `localhost:5000` which means:
1. ❌ `VITE_API_URL` environment variable is **NOT set** in Vercel
2. ❌ OR the build was done **before** the environment variable was set
3. ❌ OR the build is using a **cached version** without the variable

## Why This Happens

Vite environment variables are **baked into the JavaScript bundle at build time**. This means:
- If `VITE_API_URL` is not set during build → it becomes `undefined`
- The code falls back to `/api` (relative URL)
- But somehow the browser is resolving it to `localhost:5000` (likely from old cached code or service worker)

## Immediate Fix

### 1. Set Environment Variable in Vercel
Follow the steps in `VERCEL_ENV_SETUP.md`

### 2. Force a Fresh Build
After setting the variable:
- Go to Vercel Dashboard → Your Project → Deployments
- Click "..." on latest deployment → "Redeploy"
- Make sure to select "Use existing Build Cache" = **OFF** (unchecked)

### 3. Clear Browser Cache
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Or open DevTools → Application → Clear Storage → Clear site data

## Verification Steps

### Step 1: Check Console on Production Site
Open your production site and check the browser console. You should see:

**✅ CORRECT (after fix):**
```
🔌 API Configuration (Production): {
  baseURL: "https://dig-village.onrender.com/api",
  envVar: "https://dig-village.onrender.com",
  mode: "production",
  isProduction: true
}
```

**❌ WRONG (current state):**
```
🔌 API Configuration (Production): {
  baseURL: "NOT SET - API CALLS WILL FAIL",
  envVar: "not set",
  mode: "production",
  isProduction: true
}
```

### Step 2: Check Network Tab
1. Open DevTools → Network tab
2. Refresh the page
3. Look for API requests
4. Check the request URL:
   - ✅ Should be: `https://dig-village.onrender.com/api/...`
   - ❌ Should NOT be: `localhost:5000/api/...`

### Step 3: Check Vercel Build Logs
1. Go to Vercel Dashboard → Your Project → Deployments
2. Click on the latest deployment
3. Check the build logs
4. Look for environment variables being loaded
5. Verify `VITE_API_URL` is available during build

## Code Changes Made

The updated `client/src/services/api.js` now:
1. ✅ Logs API configuration in production (for debugging)
2. ✅ Detects `localhost:5000` in error URLs and warns about it
3. ✅ Provides clear error messages with solution steps
4. ✅ Fails fast with helpful error messages if `VITE_API_URL` is not set

## Expected Behavior After Fix

Once `VITE_API_URL` is set and the app is redeployed:

1. **Console Log**: Shows the correct API URL
2. **Network Requests**: All go to `https://dig-village.onrender.com/api/*`
3. **No Errors**: No more `ERR_CONNECTION_REFUSED` errors
4. **Data Loading**: All API endpoints work correctly

## If Issues Persist

### Check 1: Environment Variable Name
- Must be exactly: `VITE_API_URL` (case-sensitive)
- Vite only exposes variables prefixed with `VITE_`

### Check 2: Environment Variable Value
- Should be: `https://dig-village.onrender.com`
- Should NOT include `/api` (code adds it automatically)
- Should NOT have trailing slash

### Check 3: Build Environment
- Make sure the variable is set for **Production** environment
- Also set for **Preview** if you want preview deployments to work

### Check 4: Service Workers / Cache
- Clear service workers: DevTools → Application → Service Workers → Unregister
- Clear all caches: DevTools → Application → Clear Storage

### Check 5: Backend CORS
- Verify backend CORS includes your Vercel domain
- Check `server/src/index.js` CORS configuration

## Quick Test

After setting the variable and redeploying, open browser console and run:

```javascript
// This should show the API base URL
console.log('API Base URL:', import.meta.env.VITE_API_URL);
```

If it shows `undefined`, the environment variable is not set correctly.

