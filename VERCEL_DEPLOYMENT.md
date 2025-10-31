# Vercel Deployment Guide

## Prerequisites
- Vercel account (free tier works fine)
- MongoDB Atlas account (for production database)

## Environment Variables Setup

Before deploying, set up these environment variables in Vercel:

### Backend Environment Variables (.env)
```
PORT=5000
MONGO_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-production-secret-key-change-this
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASS=your-secure-admin-password
EMAIL_FROM=noreply@yourdomain.com
NODE_ENV=production
FRONTEND_URL=https://your-vercel-app.vercel.app
```

### Frontend Environment Variables
```
REACT_APP_API_URL=/api
```

## Deployment Steps

### Option 1: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from project root**
   ```bash
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy: Yes
   - Which scope: Your account
   - Link to existing project: No
   - Project name: campus-event-portal
   - Directory: ./
   - Override settings: No

5. **For production deployment:**
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard

1. **Connect GitHub Repository**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Select `Campus-Event-Management-portal`

2. **Configure Build Settings**
   - Framework Preset: Create React App
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

3. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all the environment variables listed above
   - Make sure to add them for Production, Preview, and Development

4. **Deploy**
   - Click "Deploy"
   - Wait for the deployment to complete

## MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for free

2. **Create a Cluster**
   - Choose a free tier cluster
   - Select a cloud provider and region

3. **Create Database User**
   - Database Access → Add New Database User
   - Create username and password
   - Grant read/write access

4. **Whitelist IP Addresses**
   - Network Access → Add IP Address
   - Allow access from anywhere (0.0.0.0/0) for Vercel

5. **Get Connection String**
   - Clusters → Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Use this as your `MONGO_URI` in Vercel

## Post-Deployment

1. **Update CORS Settings**
   - Your Vercel URL will be automatically allowed via the CORS regex
   - Or manually add your Vercel URL to `FRONTEND_URL` environment variable

2. **Test the Application**
   - Visit your Vercel URL
   - Test all features:
     - User registration/login
     - Event creation (admin)
     - Event registration
     - Contact form

3. **Custom Domain (Optional)**
   - Go to Project Settings → Domains
   - Add your custom domain
   - Update DNS records as instructed

## Troubleshooting

### Common Issues

1. **API Routes Not Working**
   - Check that all environment variables are set in Vercel
   - Verify MongoDB connection string is correct
   - Check Vercel function logs

2. **CORS Errors**
   - Ensure `FRONTEND_URL` environment variable is set
   - Check that the frontend is using the correct API URL

3. **Build Failures**
   - Check build logs in Vercel dashboard
   - Ensure all dependencies are in package.json
   - Verify Node version compatibility

4. **Database Connection Issues**
   - Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
   - Check database user credentials
   - Ensure network access is configured

## Local Development

To run locally:

1. **Install dependencies**
   ```bash
   npm install
   cd backend && npm install
   ```

2. **Set up local environment variables**
   - Copy `.env.example` to `.env` in backend folder
   - Update values with your local MongoDB and SMTP settings

3. **Run development servers**
   ```bash
   # Terminal 1: Start backend
   cd backend
   npm run dev

   # Terminal 2: Start frontend
   npm start
   ```

## Notes

- The backend will run as serverless functions on Vercel
- Frontend static files will be served from Vercel's CDN
- MongoDB Atlas is recommended for production database
- Free tier has limits on serverless function execution time (10s)
- Consider upgrading for production use with higher traffic

## Support

For issues related to:
- Vercel deployment: [Vercel Documentation](https://vercel.com/docs)
- MongoDB Atlas: [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
