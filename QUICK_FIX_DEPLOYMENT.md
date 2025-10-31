# QUICK FIX: Vercel Deployment Issue

## Problem
You're seeing source code (`index.js`) instead of the built React application.

## Root Cause
Vercel is not building your React app - it's serving raw source files.

## Solution: Redeploy with Correct Settings

### Step 1: Delete Current Deployment (Recommended)
1. Go to Vercel Dashboard
2. Select your project
3. Go to **Settings** → **General** 
4. Scroll down and click **Delete Project** (or just delete the deployment)

### Step 2: Import Fresh from GitHub
1. Go to Vercel Dashboard → **Add New** → **Project**
2. Import your repository: `akhilvenkata24/Campus-Event-Management-portal`
3. **IMPORTANT:** Configure these settings:

```
Framework Preset: Create React App

Root Directory: ./
(Leave blank or click "Edit" and clear it - DO NOT put "frontend" or "src")

Build Command: npm run build
(or leave it to auto-detect)

Output Directory: build

Install Command: npm install
(or leave it to auto-detect)
```

### Step 3: Add Environment Variables (BEFORE deploying)
Click **Environment Variables** and add:

**For Backend:**
```
MONGO_URI=your-mongodb-atlas-uri
JWT_SECRET=your-secret-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASS=your-password
EMAIL_FROM=noreply@campus-events.com
NODE_ENV=production
```

### Step 4: Deploy
Click **Deploy** and wait for build to complete.

---

## What Should Happen

### Build Process:
```
✓ Installing dependencies (npm install)
✓ Building React app (npm run build)
✓ Deploying backend serverless functions
✓ Deploying built frontend
```

### Expected Build Output:
```
Creating an optimized production build...
Compiled successfully.

File sizes after gzip:

  XX.XX kB  build/static/js/main.xxxxx.js
  XX.XX kB  build/static/css/main.xxxxx.css

The build folder is ready to be deployed.
```

### What You Should See:
- ✅ Your Campus Event Hub homepage
- ✅ Working navigation
- ✅ Proper styling
- ❌ NOT raw source code

---

## If It Still Shows Source Code

This means Vercel is configured wrong. Try this:

### Manual Build Test Locally:
```bash
# In your project root
npm install
npm run build

# This should create a "build" folder
# Check if it exists and has index.html
```

### Then in Vercel Settings:
- Framework: **Create React App** (not "Other")
- Build Command: **npm run build** (exactly this)
- Output Directory: **build** (exactly this, lowercase)
- Root Directory: **Leave BLANK** (very important!)

---

## Common Mistakes

❌ **Wrong:** Root Directory = `src`
✅ **Right:** Root Directory = `.` or blank

❌ **Wrong:** Output Directory = `public`
✅ **Right:** Output Directory = `build`

❌ **Wrong:** Framework = Other
✅ **Right:** Framework = Create React App

---

## Quick Checklist

Before deploying, verify:
- [ ] Framework Preset is "Create React App"
- [ ] Root Directory is blank or `./`
- [ ] Build Command is `npm run build`
- [ ] Output Directory is `build`
- [ ] You're importing from the ROOT of your repo, not a subfolder
- [ ] `package.json` exists in the root with `react-scripts build` script

---

## Still Not Working?

Share this information:
1. Screenshot of your Vercel Build & Development Settings
2. The build logs from Vercel (copy the full output)
3. What URL pattern you see (is it showing /src/index.js or just code in browser?)
