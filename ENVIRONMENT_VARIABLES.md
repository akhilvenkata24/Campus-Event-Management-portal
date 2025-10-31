# Environment Variables Setup Guide

## 🎯 Two Deployment Strategies

### Strategy 1: Single Vercel Project (Recommended - Simpler)
Deploy both frontend and backend together in one Vercel project.

### Strategy 2: Separate Vercel Projects
Deploy frontend and backend as separate Vercel projects.

---

## 📦 Strategy 1: Single Vercel Project (Monorepo)

### Frontend Environment Variables
**None required!** The frontend will use `/api` routes which will be handled by the backend in the same project.

### Backend Environment Variables
Set these in Vercel Project Settings → Environment Variables:

```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/campus-event-portal

# JWT Secret
JWT_SECRET=your-super-secure-jwt-secret-key-at-least-32-chars

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
EMAIL_FROM=noreply@yourdomain.com

# Admin Credentials
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASS=your-secure-admin-password

# Environment
NODE_ENV=production

# Frontend URL (for CORS) - Your Vercel app URL
FRONTEND_URL=https://your-app-name.vercel.app
```

**Note:** With this setup, the `vercel.json` in the root handles routing both frontend and backend.

---

## 📦 Strategy 2: Separate Vercel Projects

If you deploy frontend and backend separately:

### Backend Project Environment Variables
Same as Strategy 1 above, but add:

```env
# All the variables from Strategy 1, plus:
FRONTEND_URL=https://your-frontend-app.vercel.app
```

### Frontend Project Environment Variables
Set these in your **Frontend** Vercel project:

```env
# Backend API URL - IMPORTANT!
REACT_APP_API_URL=https://your-backend-app.vercel.app/api
```

### How to Deploy Separately:

#### Backend Deployment:
1. Create a new Vercel project for backend
2. Set Root Directory to: `backend`
3. Add all backend environment variables listed above
4. Deploy

#### Frontend Deployment:
1. Create a separate Vercel project for frontend
2. Root Directory: `./` (root)
3. Add environment variable:
   ```
   REACT_APP_API_URL=https://your-backend-app.vercel.app/api
   ```
4. Deploy

---

## 🔑 How to Get These Values

### 1. MongoDB Atlas URI (`MONGO_URI`)
```bash
# Format:
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database-name>

# Example:
mongodb+srv://admin:myPassword123@cluster0.abc123.mongodb.net/campus-event-portal
```

**Steps:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Database Access → Add Database User
4. Network Access → Add IP Address → Allow from Anywhere (0.0.0.0/0)
5. Clusters → Connect → Connect your application → Copy connection string
6. Replace `<password>` with your database user password

### 2. JWT Secret (`JWT_SECRET`)
Generate a secure random string:
```bash
# Using Node.js (run in terminal):
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or online: Use a password generator to create a 32+ character string
```

### 3. Gmail SMTP Configuration

#### Get Gmail App Password:
1. Go to Google Account settings
2. Security → 2-Step Verification (must be enabled)
3. App passwords → Select app: Mail → Select device: Other
4. Generate password
5. Use this 16-character password for `SMTP_PASS`

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=youremail@gmail.com
SMTP_PASS=abcd efgh ijkl mnop  # 16-char app password
EMAIL_FROM=noreply@campus-events.com
```

### 4. Admin Credentials
```env
ADMIN_EMAIL=admin@yourdomain.com  # Email to login to admin panel
ADMIN_PASS=YourSecurePassword123!  # Choose a strong password
```

### 5. Frontend URL (`FRONTEND_URL`)
```env
# After deploying to Vercel, you'll get a URL like:
FRONTEND_URL=https://campus-event-portal.vercel.app

# Or with your custom domain:
FRONTEND_URL=https://events.yourdomain.com
```

---

## 🚀 Setting Environment Variables in Vercel

### Via Vercel Dashboard:
1. Go to your project in Vercel
2. Settings → Environment Variables
3. Add each variable:
   - **Name**: Variable name (e.g., `MONGO_URI`)
   - **Value**: The actual value
   - **Environment**: Select Production, Preview, and Development (check all for consistency)
4. Click "Save"

### Via Vercel CLI:
```bash
# Add a single variable
vercel env add MONGO_URI production

# Pull environment variables locally (for testing)
vercel env pull .env.local
```

---

## 🧪 Testing Locally with Environment Variables

### Backend (.env file):
Create `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/campus-event-portal
JWT_SECRET=local-dev-secret-key-change-in-production
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
EMAIL_FROM=noreply@campus-events.com
ADMIN_EMAIL=admin@123
ADMIN_PASS=admin123
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env file):
Create `.env` in root (optional for local development):
```env
# Only needed if backend runs on different port
REACT_APP_API_URL=http://localhost:5000/api
```

---

## ✅ Verification Checklist

Before deploying, ensure you have:

- [ ] MongoDB Atlas cluster created and connection string copied
- [ ] MongoDB Network Access allows 0.0.0.0/0
- [ ] MongoDB Database User created with read/write permissions
- [ ] Gmail App Password generated (not regular password)
- [ ] JWT Secret generated (32+ characters)
- [ ] Admin credentials decided
- [ ] All environment variables added to Vercel project
- [ ] Environment variables set for Production, Preview, and Development

---

## 🔧 Common Issues

### Issue 1: "Cannot connect to database"
- Check `MONGO_URI` is correct
- Verify MongoDB Network Access allows 0.0.0.0/0
- Test connection string locally first

### Issue 2: "CORS errors"
- Ensure `FRONTEND_URL` matches your actual Vercel URL
- Include https:// in the URL
- Check for typos

### Issue 3: "Email not sending"
- Verify Gmail App Password (not regular password)
- Ensure 2-Factor Authentication is enabled on Google account
- Check `SMTP_USER` and `SMTP_PASS` are correct

### Issue 4: "Environment variable not found"
- Variables must start with `REACT_APP_` for React frontend
- Rebuild/redeploy after adding environment variables
- Check environment variable scope (Production/Preview/Development)

---

## 📝 Quick Reference

| Variable | Required | Used By | Example |
|----------|----------|---------|---------|
| `MONGO_URI` | Yes | Backend | `mongodb+srv://...` |
| `JWT_SECRET` | Yes | Backend | `a1b2c3d4e5f6...` |
| `SMTP_HOST` | Yes | Backend | `smtp.gmail.com` |
| `SMTP_PORT` | Yes | Backend | `587` |
| `SMTP_USER` | Yes | Backend | `email@gmail.com` |
| `SMTP_PASS` | Yes | Backend | `abcd efgh ijkl mnop` |
| `ADMIN_EMAIL` | Yes | Backend | `admin@domain.com` |
| `ADMIN_PASS` | Yes | Backend | `SecurePass123!` |
| `FRONTEND_URL` | Yes | Backend | `https://app.vercel.app` |
| `EMAIL_FROM` | Yes | Backend | `noreply@domain.com` |
| `NODE_ENV` | Yes | Backend | `production` |
| `REACT_APP_API_URL` | Only if separate | Frontend | `https://api.vercel.app/api` |

---

## 💡 Recommendation

**Use Strategy 1 (Single Vercel Project)** for simplicity. It's easier to manage and doesn't require setting `REACT_APP_API_URL` since the frontend and backend share the same domain.
