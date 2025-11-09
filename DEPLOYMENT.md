# Deployment Guide

## 🚀 Deploy Frontend to Vercel

### Option 1: Deploy via Vercel Website (Easiest)

1. **Go to Vercel**: https://vercel.com/new

2. **Import Your GitHub Repository**
   - Click "Import Git Repository"
   - Search for `maydeploy/event-feedback-app`
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

4. **Environment Variables**
   - Click "Environment Variables"
   - Add: `VITE_API_URL` = `YOUR_BACKEND_URL` (we'll add this after deploying backend)
   - For now, you can leave it blank or use `http://localhost:5000/api`

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - You'll get a URL like: `https://event-feedback-app-xxx.vercel.app`

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend
cd frontend

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? event-feedback-app
# - Directory? ./
# - Override settings? No
```

---

## 🗄️ Deploy Backend (Recommended: Railway)

⚠️ **Important**: Vercel's serverless platform doesn't work well with SQLite (file-based databases).
We recommend **Railway** or **Render** for the backend.

### Deploy to Railway (Recommended)

1. **Go to Railway**: https://railway.app/new

2. **Deploy from GitHub**
   - Click "Deploy from GitHub repo"
   - Select `maydeploy/event-feedback-app`
   - Railway will auto-detect the backend

3. **Configure**
   - **Root Directory**: Leave blank (Railway auto-detects)
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`

4. **Environment Variables**
   Click "Variables" and add:
   ```
   NODE_ENV=production
   PORT=5000
   ADMIN_PASSWORD_HASH=$2b$10$0/AzWv.dSRoLc0LCAHSPLO3nBEZPOGXIjRrRJn5tJZliWWw6wgCWO
   SESSION_SECRET=your_random_secret_key_change_this_123456789
   CORS_ORIGIN=https://your-frontend-url.vercel.app
   ```

5. **Deploy**
   - Click "Deploy"
   - You'll get a URL like: `https://event-feedback-app-production.up.railway.app`

6. **Update Frontend**
   - Go back to Vercel
   - Update environment variable: `VITE_API_URL` = `https://your-backend-url.railway.app/api`
   - Redeploy frontend

### Alternative: Deploy to Render

1. **Go to Render**: https://render.com/

2. **New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repo
   - Select `maydeploy/event-feedback-app`

3. **Configure**
   - **Name**: event-feedback-backend
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run db:migrate`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. **Environment Variables** (same as Railway)

---

## 🔄 Update Environment Variables After Deployment

### Frontend (Vercel)
1. Go to your Vercel project
2. Settings → Environment Variables
3. Update `VITE_API_URL` to your backend URL
4. Redeploy

### Backend (Railway/Render)
1. Go to your backend project
2. Update `CORS_ORIGIN` to your frontend URL
3. Redeploy

---

## ✅ Deployment Checklist

- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Railway/Render
- [ ] Frontend environment variable updated with backend URL
- [ ] Backend CORS updated with frontend URL
- [ ] Test the live app
- [ ] Admin login works (password: admin123)
- [ ] Forms submit successfully
- [ ] Browse page loads submissions

---

## 📝 Important Notes

### Database
- SQLite file will persist on Railway/Render
- For production, consider migrating to PostgreSQL (Railway offers free PostgreSQL)

### Admin Password
- Change the admin password after deployment
- Run: `node src/utils/hashPassword.js YOUR_NEW_PASSWORD`
- Update `ADMIN_PASSWORD_HASH` environment variable

### Custom Domain
- Both Vercel and Railway support custom domains
- Add your domain in project settings

---

## 🐛 Troubleshooting

**Frontend build fails:**
- Check that `frontend` is set as root directory
- Ensure all dependencies are in package.json

**Backend doesn't start:**
- Check environment variables are set correctly
- Check logs for errors
- Ensure DATABASE_URL is set (if using PostgreSQL)

**CORS errors:**
- Verify CORS_ORIGIN matches your frontend URL exactly
- Include `https://` protocol
- No trailing slash

**API calls fail:**
- Check VITE_API_URL includes `/api` at the end
- Verify backend is running and accessible

---

## 🎉 Your App is Live!

After deployment:
- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-app.railway.app
- **Admin**: https://your-app.vercel.app/admin (password: admin123)

Share your app with the world! 🚀
