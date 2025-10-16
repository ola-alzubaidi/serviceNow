# Running on StackBlitz

This project uses Next.js 15 and React 19, which have limited support in StackBlitz due to the `workUnitAsyncStorage` error.

## Option 1: Use StackBlitz-Compatible Versions

To run this project in StackBlitz, you need to downgrade to Next.js 14 and React 18:

```bash
# Backup current package.json
mv package.json package.original.json

# Use StackBlitz-compatible package.json
mv package.stackblitz.json package.json

# Install dependencies
npm install

# Run the dev server
npm run dev
```

## Option 2: Use Alternative Platforms

For the best experience with Next.js 15, consider using:

1. **Local Development**: Clone the repo and run locally
2. **Vercel**: Deploy directly to Vercel (recommended)
3. **CodeSandbox**: Better Next.js 15 support than StackBlitz
4. **GitHub Codespaces**: Full development environment in the cloud

## Environment Variables Required

Make sure to set these environment variables in StackBlitz:

```env
SERVICENOW_INSTANCE_URL=https://your-instance.service-now.com
SERVICENOW_CLIENT_ID=your_client_id
SERVICENOW_CLIENT_SECRET=your_client_secret
SERVICENOW_REDIRECT_URI=http://localhost:3000/api/auth/callback/servicenow
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

## Known Issues in StackBlitz

- `workUnitAsyncStorage` error: Next.js 15's async storage doesn't work in StackBlitz's Node.js environment
- Turbopack: Not supported in StackBlitz
- React 19: Limited support

## Recommended Approach

**For StackBlitz Demo:**
- Use the downgraded versions (Next.js 14, React 18)
- Remove Turbopack from scripts
- Use the provided `package.stackblitz.json`

**For Production:**
- Use the original `package.json` with Next.js 15
- Deploy to Vercel for full feature support

