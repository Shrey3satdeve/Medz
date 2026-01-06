# 🔐 Google Sign-In Setup Guide for LabDash

## Overview
This guide explains how to set up Google Sign-In for your LabDash application.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top and select **"New Project"**
3. Enter your project name (e.g., "LabDash") and click **Create**

## Step 2: Enable APIs

1. In the Google Cloud Console, go to **APIs & Services > Library**
2. Search for and enable these APIs:
   - **Google+ API**
   - **Google Identity Toolkit API**

## Step 3: Configure OAuth Consent Screen

1. Go to **APIs & Services > OAuth consent screen**
2. Select **External** (for public app) or **Internal** (for organization only)
3. Fill in the required fields:
   - **App name**: LabDash
   - **User support email**: Your email
   - **Developer contact email**: Your email
4. Click **Save and Continue**
5. Add scopes (click "Add or Remove Scopes"):
   - `email`
   - `profile`
   - `openid`
6. Click **Save and Continue** until finished

## Step 4: Create OAuth 2.0 Credentials

1. Go to **APIs & Services > Credentials**
2. Click **Create Credentials > OAuth 2.0 Client IDs**
3. Select **Web application**
4. Configure:
   - **Name**: LabDash Web Client
   - **Authorized JavaScript origins**:
     ```
     http://localhost:3000
     http://localhost:5000
     http://127.0.0.1:5500
     https://your-production-domain.com
     ```
   - **Authorized redirect URIs**:
     ```
     http://localhost:3000/auth/google/callback
     http://localhost:5000/api/auth/google/callback
     https://your-production-domain.com/auth/google/callback
     ```
5. Click **Create**
6. Copy the **Client ID** and **Client Secret**

## Step 5: Update Frontend Files

### Update `login.html`:
Find this line and replace with your Client ID:
```javascript
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
```

### Update `signup.html`:
Find this line and replace with your Client ID:
```javascript
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';
```

## Step 6: Update Backend Environment

Add these variables to your `.env` file:
```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

## Step 7: Update Database (if using Supabase)

Run this SQL to add Google authentication columns:
```sql
-- Add Google authentication columns to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_picture TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS auth_provider VARCHAR(50) DEFAULT 'email';
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create index for faster Google ID lookups
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
```

## How Google Sign-In Works

### Flow:
1. User clicks "Continue with Google" button
2. Google's popup appears for authentication
3. User selects their Google account
4. Google returns a credential token
5. Token is sent to backend `/api/auth/google`
6. Backend verifies token and creates/updates user
7. JWT token is returned for authentication
8. User is redirected to dashboard

### Security Features:
- ✅ Token verification on backend
- ✅ Secure credential handling
- ✅ Automatic user creation/linking
- ✅ Profile picture synchronization
- ✅ JWT session management

## Testing

### Local Testing:
1. Start your backend server: `npm start`
2. Open `login.html` in browser
3. Click "Continue with Google"
4. Complete Google sign-in
5. Check console for any errors

### Debug Mode:
Open browser console and check for:
- Google SDK loading
- Credential response
- API response

## Troubleshooting

### Error: "popup_closed_by_user"
- User closed the Google popup manually
- No action needed, normal user behavior

### Error: "access_denied"
- User denied permission
- Check OAuth consent screen configuration

### Error: "Invalid origin"
- Add your domain to Authorized JavaScript origins
- Make sure URL matches exactly (with/without www)

### Error: "Network error"
- Backend server not running
- Check CORS configuration
- Verify API endpoint URL

### Error: "Token expired"
- Google token has expired
- User needs to sign in again

## API Endpoint

### POST `/api/auth/google`

**Request:**
```json
{
  "credential": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
OR
```json
{
  "googleId": "1234567890",
  "email": "user@gmail.com",
  "name": "User Name",
  "picture": "https://lh3.googleusercontent.com/...",
  "accessToken": "ya29..."
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Google authentication successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "name": "User Name",
    "email": "user@gmail.com",
    "role": "user",
    "profilePicture": "https://..."
  }
}
```

## Production Checklist

- [ ] Replace `YOUR_GOOGLE_CLIENT_ID` in all frontend files
- [ ] Add production domain to Google Cloud Console
- [ ] Set up HTTPS for production
- [ ] Update CORS settings for production domain
- [ ] Test on multiple browsers
- [ ] Test on mobile devices

## Files Modified

1. `frontend/login.html` - Added Google Sign-In button and logic
2. `frontend/signup.html` - Added Google Sign-Up button and logic
3. `backend/controllers/auth.controller.js` - Added `googleAuth` function
4. `backend/routes/auth.routes.js` - Added `/google` route
5. `backend/database/auth-tables.sql` - Added Google-related columns

---

## Need Help?

If you encounter any issues:
1. Check browser console for errors
2. Check backend logs
3. Verify Google Cloud Console configuration
4. Ensure all URLs match exactly

Happy coding! 🚀
