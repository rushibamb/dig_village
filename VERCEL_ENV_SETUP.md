# 🔧 Vercel Environment Variable Setup Guide

## Problem
You're seeing `localhost:5000` errors in production because `VITE_API_URL` is not set in Vercel.

## Solution: Set Environment Variable in Vercel

### Step-by-Step Instructions

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Log in to your account
   - Select your project (`dig-village` or similar)

2. **Navigate to Settings**
   - Click on your project
   - Click **"Settings"** in the top navigation
   - Click **"Environment Variables"** in the left sidebar

3. **Add the Environment Variable**
   - Click **"Add New"** button
   - **Key**: `VITE_API_URL`
   - **Value**: `https://dig-village.onrender.com`
   - **Environment**: Select all three:
     - ✅ Production
     - ✅ Preview
     - ✅ Development
   - Click **"Save"**

4. **Redeploy Your Application**
   - Go to **"Deployments"** tab
   - Click the **"..."** menu on your latest deployment
   - Click **"Redeploy"**
   - OR push a new commit to trigger a new deployment

### Important Notes

- ⚠️ **Environment variables are baked into the build at build time**
- ⚠️ **You MUST redeploy after adding/changing environment variables**
- ⚠️ **The variable name must be exactly**: `VITE_API_URL` (case-sensitive)
- ⚠️ **The value should NOT include `/api`** - the code will add it automatically

### Verification

After redeploying, check the browser console on your production site. You should see:

```
🔌 API Configuration (Production): {
  baseURL: "https://dig-village.onrender.com/api",
  envVar: "https://dig-village.onrender.com",
  mode: "production",
  isProduction: true
}
```

If you see `NOT SET` or `localhost:5000`, the environment variable is not configured correctly.

### Troubleshooting

**Still seeing `localhost:5000`?**
1. Verify the environment variable is set in Vercel
2. Make sure you redeployed after setting it
3. Clear browser cache and hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
4. Check the build logs in Vercel to ensure the variable was available during build

**Getting CORS errors?**
- Make sure your backend CORS is configured correctly (already done in `server/src/index.js`)
- Verify the backend URL in CORS matches your frontend URL

**API calls still failing?**
- Check browser Network tab to see the actual URL being called
- Verify the backend is running and accessible at `https://dig-village.onrender.com`
- Check backend logs for any errors

## Quick Reference

| Variable Name | Value | Required |
|--------------|-------|----------|
| `VITE_API_URL` | `https://dig-village.onrender.com` | ✅ Yes |

## Alternative: Using Vercel CLI

If you prefer using the CLI:

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Login to Vercel
vercel login

# Link your project (if not already linked)
vercel link

# Add environment variable
vercel env add VITE_API_URL production
# When prompted, enter: https://dig-village.onrender.com

# Redeploy
vercel --prod
```

