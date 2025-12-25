# Environment Variables Setup

## Required Environment Variables

Create a `.env` file in the `client/` directory with the following variable:

```env
# API Configuration
# Set this to your production API URL (without /api suffix)
# Example: https://dig-village.onrender.com
VITE_API_URL=https://dig-village.onrender.com
```

## Important Notes

1. **VITE_API_URL**: This should be set to your production backend URL without the `/api` suffix. The API client will automatically append `/api` to all requests.

2. **For Vercel Deployment**: 
   - Go to your Vercel project settings
   - Navigate to "Environment Variables"
   - Add `VITE_API_URL` with value `https://dig-village.onrender.com`
   - Redeploy your application

3. **For Local Development**:
   - Create a `.env` file in the `client/` directory
   - Set `VITE_API_URL=http://localhost:5000` for local development
   - Or leave it unset and the app will attempt to use relative URLs (which will fail if backend is on different port)

## Verification

After setting the environment variable:
1. Restart your development server if running locally
2. Check the browser console for the API configuration log (in development mode)
3. Verify that API calls are going to the correct URL

