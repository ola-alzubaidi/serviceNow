# 🚀 CodeSandbox Setup Guide

CodeSandbox has **much better Next.js support** than StackBlitz! Here's how to get your app running.

## Quick Setup Steps

### 1. **Set Environment Variables**

CodeSandbox needs your environment variables. Click the "Server Control Panel" or "Environment" tab and add:

```env
SERVICENOW_INSTANCE_URL=https://dev274518.service-now.com
SERVICENOW_CLIENT_ID=your_client_id
SERVICENOW_CLIENT_SECRET=your_client_secret
SERVICENOW_REDIRECT_URI=https://YOUR_CODESANDBOX_URL/api/auth/callback/servicenow
NEXTAUTH_URL=https://YOUR_CODESANDBOX_URL
NEXTAUTH_SECRET=Njlg5GwJ1G2JWPBhOg95mvToFgkZNk9FBC1ChvvpqAI=
```

**Important:** Replace `YOUR_CODESANDBOX_URL` with your actual CodeSandbox URL (e.g., `https://abc123.csb.app`)

### 2. **Update ServiceNow Redirect URI**

Go to your ServiceNow instance and update the OAuth application's Redirect URI to match your CodeSandbox URL:

```
https://YOUR_CODESANDBOX_URL/api/auth/callback/servicenow
```

### 3. **Install Dependencies**

In the CodeSandbox terminal:
```bash
npm install
```

### 4. **Start the Dev Server**

```bash
npm run dev
```

## Common Issues & Fixes

### Issue: "This page could not be found" when clicking sign in

**Cause:** Environment variables not set or NextAuth routes not loading

**Fix:**
1. Check that all environment variables are set (see step 1 above)
2. Restart the dev server
3. Hard refresh your browser (Cmd+Shift+R or Ctrl+Shift+F5)
4. Check the terminal for any error messages

### Issue: Redirect loop or authentication fails

**Cause:** `NEXTAUTH_URL` doesn't match your CodeSandbox URL

**Fix:**
1. Find your CodeSandbox preview URL (e.g., `https://abc123.csb.app`)
2. Update `NEXTAUTH_URL` to match exactly
3. Update `SERVICENOW_REDIRECT_URI` to `{NEXTAUTH_URL}/api/auth/callback/servicenow`
4. Update the redirect URI in ServiceNow OAuth app
5. Restart the server

### Issue: 500 Internal Server Error

**Cause:** Missing `NEXTAUTH_SECRET`

**Fix:**
```bash
# Generate a secret
openssl rand -base64 32

# Or use this one:
NEXTAUTH_SECRET=Njlg5GwJ1G2JWPBhOg95mvToFgkZNk9FBC1ChvvpqAI=
```

## Debugging in CodeSandbox

### Check if NextAuth routes are working:

Visit these URLs in your browser:
- `https://YOUR_CODESANDBOX_URL/api/auth/providers` - Should return JSON
- `https://YOUR_CODESANDBOX_URL/api/auth/csrf` - Should return JSON
- `https://YOUR_CODESANDBOX_URL/auth/signin` - Should show sign-in page

### Check the terminal logs:

Look for:
```
✓ Compiled /api/auth/[...nextauth] in 448ms
GET /api/auth/session 200 in 687ms
```

If you see 404 errors, the routes aren't loading properly.

## Alternative: Use Direct Sign-In Page

Instead of clicking "Sign in with ServiceNow" on the dashboard, navigate directly to:

```
https://YOUR_CODESANDBOX_URL/auth/signin
```

This bypasses the `signIn('servicenow')` call and goes straight to the custom sign-in page.

## Verifying Your Setup

### ✅ Checklist:

- [ ] All 6 environment variables are set in CodeSandbox
- [ ] `NEXTAUTH_URL` matches your CodeSandbox URL exactly
- [ ] ServiceNow OAuth app redirect URI matches CodeSandbox URL
- [ ] `npm install` completed successfully
- [ ] Dev server is running (`npm run dev`)
- [ ] No error messages in terminal
- [ ] Can access `/auth/signin` directly

## Still Having Issues?

### Quick Test:

1. **Go directly to:** `https://YOUR_CODESANDBOX_URL/auth/signin`
2. **Enter your ServiceNow credentials**
3. **Click "Sign in to ServiceNow"**

If this works, the issue is with the Dashboard's `signIn()` call, not the actual authentication.

### Alternative Solution:

If you keep getting "page not found", try restarting CodeSandbox:

1. Stop the dev server (Ctrl+C)
2. Clear the cache: `rm -rf .next`
3. Restart: `npm run dev`
4. Hard refresh your browser

## Why CodeSandbox > StackBlitz

CodeSandbox uses **real Docker containers** with full Node.js support:
- ✅ Async hooks work
- ✅ Request context available
- ✅ Native modules supported (with Docker)
- ✅ Better Next.js compatibility

Unlike StackBlitz's browser-based WebContainer, CodeSandbox can run your app properly!

## Need Help?

Check the browser console (F12) and terminal for error messages. The most common issues are:
1. Missing environment variables
2. URL mismatch between NEXTAUTH_URL and actual URL
3. ServiceNow redirect URI not updated

---

**Your app should work perfectly in CodeSandbox once the environment variables are configured!** 🎉

