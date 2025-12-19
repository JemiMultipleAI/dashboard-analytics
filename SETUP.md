# Unified Analytics - Setup Guide

This guide will help you set up the Unified Analytics dashboard for testing.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- A Google Cloud Project with APIs enabled
- ngrok (for local development with OAuth)

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Google Cloud Console Setup

### 2.1 Create or Select a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your Project ID

### 2.2 Enable Required APIs

Enable the following APIs in your Google Cloud Project:

1. **Google Analytics Data API** (for GA4)
2. **Google Analytics Admin API** (for GA4 property discovery)
3. **Google Search Console API** (for Search Console)
4. **Google Ads API** (for Google Ads) - Optional
5. **Google Sheets API** (for Google Sheets integration) - Optional

**How to enable:**
- Go to **APIs & Services** → **Library**
- Search for each API and click **Enable**

### 2.3 Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. If prompted, configure the OAuth consent screen:
   - Choose **External** (for testing)
   - Fill in required fields (App name, User support email, Developer contact)
   - Add scopes:
     - `https://www.googleapis.com/auth/analytics.readonly`
     - `https://www.googleapis.com/auth/webmasters.readonly`
     - `https://www.googleapis.com/auth/adwords` (if using Google Ads)
   - Add test users (your email)
   - Save and continue
4. Create OAuth client ID:
   - Application type: **Web application**
   - Name: `Unified Analytics`
   - Authorized redirect URIs: (see Step 3 for ngrok setup)
5. Copy the **Client ID** and **Client Secret**

### 2.4 (Optional) Google Ads Setup

If you want to use Google Ads:

1. Get a **Developer Token** from Google Ads
   - Apply at: https://ads.google.com/aw/apicenter
   - This can take 1-2 business days for approval
2. Get your **Customer ID** from Google Ads account
   - Format: `270-641-8609` or `2706418609`

### 2.5 (Optional) Google Sheets API Key

If you want to use Google Sheets:

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **API Key**
3. Restrict the API key (recommended):
   - Application restrictions: **HTTP referrers**
   - API restrictions: **Restrict key** → Select **Google Sheets API**
4. Copy the **API Key**

## Step 3: ngrok Setup (for Local Development)

### 3.1 Install ngrok

Download from [ngrok.com](https://ngrok.com/download) or use package manager:

```bash
# Windows (with Chocolatey)
choco install ngrok

# Mac (with Homebrew)
brew install ngrok

# Or download from ngrok.com
```

### 3.2 Start Your Next.js Server

```bash
npm run dev
```

Your app should be running on `http://localhost:3000` (or port 3004 based on your config)

### 3.3 Start ngrok Tunnel

```bash
ngrok http 3000
```

Or if using port 3004:
```bash
ngrok http 3004
```

### 3.4 Copy Your ngrok URL

You'll see something like:
```
Forwarding  https://abc123xyz.ngrok-free.app -> http://localhost:3000
```

Copy the HTTPS URL (e.g., `https://abc123xyz.ngrok-free.app`)

### 3.5 Update Google Cloud Console

1. Go back to **APIs & Services** → **Credentials**
2. Edit your OAuth 2.0 Client ID
3. Add to **Authorized redirect URIs**:
   ```
   https://your-ngrok-url.ngrok-free.app/api/auth/google/callback
   ```
4. Save

**Note:** If your ngrok URL changes, you'll need to update this in Google Cloud Console.

## Step 4: Environment Variables

Create a `.env.local` file in the root directory:

```env
# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-client-id-here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here

# Redirect URI (use your ngrok URL)
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=https://your-ngrok-url.ngrok-free.app/api/auth/google/callback
NEXT_PUBLIC_BASE_URL=https://your-ngrok-url.ngrok-free.app

# Google Ads (Optional)
GOOGLE_ADS_DEVELOPER_TOKEN=your-developer-token
GOOGLE_ADS_CUSTOMER_ID=2706418609

# Google Sheets (Optional)
GOOGLE_SHEETS_API_KEY=your-api-key-here
```

**Important:** 
- Replace all placeholder values with your actual credentials
- Never commit `.env.local` to version control
- Keep your credentials secure

## Step 5: Start the Application

1. Make sure ngrok is running
2. Start the development server:

```bash
npm run dev
```

3. Open your browser to the ngrok URL (e.g., `https://abc123xyz.ngrok-free.app`)

## Step 6: Connect Your Accounts

1. **Login** with the test credentials:
   - Email: `testuser@gmail.com`
   - Password: `Test1234!`

2. **Connect Google Analytics:**
   - Click "Connect" on the Google Analytics card
   - Authorize the app in Google
   - You'll be redirected back to the dashboard

3. **Connect Google Search Console:**
   - Click "Connect" on the Search Console card
   - Authorize the app
   - Ensure you have at least one property in Search Console

4. **Connect Google Ads (Optional):**
   - Requires Developer Token and Customer ID in `.env.local`
   - Click "Connect" and authorize

## Troubleshooting

### "Not authenticated" Error
- Make sure you've connected the account from the dashboard
- Check that OAuth tokens are stored in cookies
- Try disconnecting and reconnecting

### "API Quota Exceeded" Error
- Google APIs have rate limits
- Wait for the quota to reset (usually under an hour)
- The app uses caching to reduce API calls (10-15 minute cache)

### "No property found" Error (GA4)
- Ensure you have a GA4 property set up
- Check that Analytics Admin API is enabled
- Verify you have access to the property

### "No sites found" Error (Search Console)
- Add a property to Google Search Console first
- Verify the property is verified in Search Console

### ngrok URL Changed
- Update `NEXT_PUBLIC_GOOGLE_REDIRECT_URI` in `.env.local`
- Update the redirect URI in Google Cloud Console
- Restart the Next.js server

### CORS Errors
- Make sure you're using the ngrok HTTPS URL, not localhost
- Verify the redirect URI matches exactly in Google Cloud Console

## Features

### Data Caching
- Data is cached for 10-15 minutes to reduce API calls
- Cached data is shown immediately while fresh data loads in background
- Helps prevent quota exhaustion

### Dashboard Persistence
- Custom dashboards are saved to browser localStorage
- Dashboards persist across page refreshes
- Connection status is also persisted

### Mock Data
- If APIs fail or aren't connected, mock data is shown
- Allows testing the UI without API access

## Testing Checklist

- [ ] Can login with test credentials
- [ ] Can connect Google Analytics
- [ ] Can connect Google Search Console
- [ ] Can view analytics data
- [ ] Can create custom dashboard
- [ ] Custom dashboard persists after refresh
- [ ] Data loads from cache (check console logs)
- [ ] Error messages are clear and helpful

## Support

If you encounter issues:
1. Check the browser console for errors
2. Check the server terminal for API errors
3. Verify all environment variables are set correctly
4. Ensure all required APIs are enabled in Google Cloud Console

## Next Steps

After setup:
- Test all dashboard features
- Create custom dashboards
- Test with different date ranges
- Verify data accuracy

---

**Note:** This is a development/testing setup. For production, you'll need:
- Proper database for dashboard storage
- Server-side caching (Redis)
- Production OAuth credentials
- Proper error monitoring
- Rate limiting

