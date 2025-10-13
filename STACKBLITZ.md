# Running on StackBlitz

This project is configured to work in StackBlitz with Next.js 14 and React 18, which are more stable in WebContainer environments.

## 🚀 Quick Start in StackBlitz

Simply run:
```bash
npm install && npm run dev
```

The project is pre-configured with:
- ✅ Next.js 14.2.18 (stable in StackBlitz)
- ✅ React 18.3.1 (stable in StackBlitz)
- ✅ SWC disabled (native binaries not available in WebContainers)
- ✅ Request/Response polyfills loaded automatically
- ✅ Webpack fallbacks for Node.js modules

## ⚠️ Known StackBlitz Limitations

### 1. SWC Binary Not Available
**Issue:** `Failed to load SWC binary for linux/x64`

**Solution:** Already configured! `swcMinify: false` in `next.config.mjs` uses Babel instead.

### 2. Fetch Not Defined (Node.js)
**Issue:** `ReferenceError: fetch is not defined` during Next.js startup

**Solution:** Already fixed! `polyfills.js` provides `global.fetch` using `undici` package.

### 3. Next.js 15 Incompatibility
**Issue:** `workUnitAsyncStorage` error with Next.js 15

**Solution:** Already using Next.js 14 for StackBlitz compatibility.

### 4. Native Node.js Modules
**Issue:** Native addons (like undici, crypto) don't load properly

**Solution:** Webpack fallbacks and polyfills are configured automatically.

## 📋 Environment Variables Required

Set these in StackBlitz's environment variables settings:

```env
SERVICENOW_INSTANCE_URL=https://your-instance.service-now.com
SERVICENOW_CLIENT_ID=your_client_id
SERVICENOW_CLIENT_SECRET=your_client_secret
SERVICENOW_REDIRECT_URI=http://localhost:3000/api/auth/callback/servicenow
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

**Note:** Adjust the port in `NEXTAUTH_URL` and `SERVICENOW_REDIRECT_URI` if StackBlitz assigns a different port (e.g., 4200).

## 🔄 Switching Between Environments

### Currently Active: StackBlitz-Compatible Setup
- Next.js 14.2.18
- React 18.3.1
- SWC disabled
- Polyfills enabled

### For Local Development or Vercel (Next.js 15)
If you want to use the latest versions locally:

1. **Backup StackBlitz config:**
   ```bash
   mv package.json package.stackblitz.backup.json
   ```

2. **Create a new package.json with Next.js 15:**
   ```json
   {
     "dependencies": {
       "next": "15.5.4",
       "react": "^19.1.0",
       "react-dom": "^19.1.0",
       "eslint": "^9"
     }
   }
   ```

3. **Update next.config.mjs to enable SWC:**
   ```javascript
   swcMinify: true
   ```

## 🎯 Recommended Platforms by Use Case

| Platform | Best For | Next.js 15 | Notes |
|----------|---------|------------|-------|
| **StackBlitz** | Quick demos, sharing | ❌ (use v14) | WebContainer limitations |
| **Vercel** | Production deployments | ✅ | Full support, recommended |
| **Local Dev** | Development | ✅ | Full control |
| **CodeSandbox** | Demos, prototypes | ⚠️ Partial | Better than StackBlitz |
| **GitHub Codespaces** | Cloud development | ✅ | Full Linux environment |

## 🐛 Troubleshooting

### Server Won't Start
```bash
# Kill any existing processes
lsof -ti:3000 | xargs kill -9
# or
pkill -f "next dev"

# Clear cache and restart
rm -rf .next
npm install
npm run dev
```

### Build Errors
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Polyfill Issues
The `polyfills.js` file is automatically loaded via `node -r ./polyfills.js` in package.json scripts. If you see `Request is not defined` or similar errors:

1. Check that `polyfills.js` exists in the project root
2. Verify `undici` is installed: `npm list undici`
3. Restart the dev server

## 📚 Additional Resources

- [Next.js in StackBlitz](https://nextjs.org/docs/advanced-features/debugging)
- [WebContainer Limitations](https://webcontainers.io/guides/limitations)
- [Next.js SWC](https://nextjs.org/docs/advanced-features/compiler)

---

**Ready to go!** Just run `npm install && npm run dev` in StackBlitz 🎉
