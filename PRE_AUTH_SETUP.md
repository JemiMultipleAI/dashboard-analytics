# Pre-Authentication Setup Guide

This guide explains how to set up pre-authentication for Google accounts using refresh tokens, so users don't need to go through the OAuth flow every time.

## How It Works

When refresh tokens are stored in environment variables, the app will automatically:
1. Use them to authenticate API requests
2. Auto-connect accounts on dashboard load
3. Refresh access tokens when they expire

## Setup Instructions

### Step 1: Get Refresh Tokens

**Option A: From OAuth Flow (Recommended)**
1. Go to your dashboard and click "Connect" for each Google service (GA4, GSC, or Google Ads)
2. Complete the OAuth flow once
3. Check your server logs - the refresh token will be printed in development mode:
   ```
   🔑 Refresh Token for GA4:
   GOOGLE_GA4_REFRESH_TOKEN=1//0g...
   ```
4. Copy the refresh token from the logs

**Option B: Extract from Cookies**
1. After connecting via OAuth, the refresh token is stored in cookies
2. Use browser dev tools to extract it (requires technical knowledge)

### Step 2: Add to Environment Variables

Add the refresh tokens to your `.env.local` file (or `.env.production` for production):

```env
# Google OAuth Refresh Tokens for Pre-Authentication
GOOGLE_GA4_REFRESH_TOKEN=your_ga4_refresh_token_here
GOOGLE_GSC_REFRESH_TOKEN=your_gsc_refresh_token_here
GOOGLE_ADS_REFRESH_TOKEN=your_ads_refresh_token_here
```

### Step 3: Restart Your Application

After adding the refresh tokens:
```bash
# For development
npm run dev

# For production
pm2 restart unified-analytics
```

## Features

### Auto-Connect on Dashboard Load
When refresh tokens are configured, the dashboard will automatically:
- Connect accounts on first load
- No need to click "Connect" buttons
- Works seamlessly in the background

### Automatic Token Refresh
The app automatically:
- Uses refresh tokens to get new access tokens when they expire
- Handles token refresh transparently
- Falls back to environment tokens if cookies don't have them

### Manual Pre-Authentication
You can also manually trigger pre-authentication via API:

```bash
curl -X POST http://localhost:3004/api/auth/google/pre-auth \
  -H "Content-Type: application/json" \
  -d '{"service": "ga4"}'
```

Supported services: `ga4`, `gsc`, `ads`

## Security Notes

⚠️ **Important Security Considerations:**

1. **Never commit refresh tokens to version control**
   - Keep them in `.env.local` (already in `.gitignore`)
   - Don't share them in public repositories

2. **Refresh tokens are long-lived**
   - They last up to 1 year
   - Treat them as sensitive credentials

3. **Rotate tokens if compromised**
   - Revoke access in Google Cloud Console
   - Generate new tokens through OAuth flow

4. **Use environment variables in production**
   - Set them securely on your VPS
   - Use your deployment platform's secrets management

## Troubleshooting

### Tokens Not Working
- Verify the refresh token is correct (no extra spaces or quotes)
- Check that OAuth client ID/secret match the ones used to generate the token
- Ensure the token hasn't been revoked in Google Cloud Console

### Auto-Connect Not Working
- Check server logs for errors
- Verify environment variables are set correctly
- Ensure the app has been restarted after adding tokens

### Token Expired
- Refresh tokens can expire if:
  - User revokes access
  - Token hasn't been used in 6 months
  - Google security policy changes
- Solution: Go through OAuth flow again to get a new refresh token

## API Endpoints

### Pre-Authenticate Service
```
POST /api/auth/google/pre-auth
Content-Type: application/json

{
  "service": "ga4" | "gsc" | "ads"
}
```

Response:
```json
{
  "success": true,
  "service": "ga4",
  "message": "GA4 account pre-authenticated successfully"
}
```

## Benefits

✅ **Better User Experience**
- No repeated OAuth flows
- Seamless authentication
- Works automatically

✅ **Production Ready**
- Server-side authentication
- No user interaction required
- Reliable and persistent

✅ **Development Friendly**
- Easy to set up
- Tokens logged in dev mode
- Quick iteration

