# Railway Deployment Setup

## 🚂 Deploy Backend to Railway

### Step 1: Create Railway Account

1. Go to https://railway.app/
2. Sign up with your GitHub account
3. Authorize Railway to access your repositories

### Step 2: Create New Project

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose **`maydeploy/event-feedback-app`**
4. Railway will auto-detect the Node.js backend

### Step 3: Configure Root Directory

Since the backend is in a subdirectory:

1. After deployment starts, click on the service
2. Go to **Settings** → **General**
3. Find **"Root Directory"**
4. Click **"Configure"**
5. Enter: `backend`
6. Click **"Update"**

### Step 4: Add Environment Variables

Click on **"Variables"** tab and add these:

```
NODE_ENV=production
PORT=5000
ADMIN_PASSWORD_HASH=$2b$10$0/AzWv.dSRoLc0LCAHSPLO3nBEZPOGXIjRrRJn5tJZliWWw6wgCWO
SESSION_SECRET=change_this_to_random_secret_key_123456789
CORS_ORIGIN=https://your-frontend.vercel.app
```

**Important Notes:**
- Replace `SESSION_SECRET` with a random string (use password generator)
- `CORS_ORIGIN` should match your Vercel frontend URL exactly
- The `ADMIN_PASSWORD_HASH` is for password: `admin123`

### Step 5: Deploy

1. Railway will automatically deploy
2. Wait 2-3 minutes for build to complete
3. Check the **"Deployments"** tab for status
4. Once deployed, click **"Settings"** → **"Networking"**
5. Click **"Generate Domain"** to get your public URL

### Step 6: Get Your Backend URL

You'll get a URL like:
```
https://event-feedback-app-production.up.railway.app
```

Copy this URL - you'll need it for the frontend!

---

## 🔗 Connect Frontend to Backend

### Update Vercel Environment Variable

1. Go to https://vercel.com/dashboard
2. Select your `event-feedback-app` project
3. Click **Settings** → **Environment Variables**
4. Add new variable:
   - **Name**: `VITE_API_URL`
   - **Value**: `https://your-backend.railway.app/api` (add `/api` at the end!)
   - **Environment**: All environments

5. Click **"Save"**
6. Go to **Deployments** tab
7. Click the **"..."** menu on latest deployment
8. Click **"Redeploy"**

---

## 🔄 Update Backend CORS

After frontend is deployed:

1. Go to Railway → Your project
2. Click **"Variables"** tab
3. Update `CORS_ORIGIN` with your Vercel URL:
   ```
   CORS_ORIGIN=https://your-app.vercel.app
   ```
4. Railway will automatically redeploy

---

## ✅ Verify Deployment

### Test Backend

Visit: `https://your-backend.railway.app/api/health`

You should see:
```json
{
  "status": "ok",
  "timestamp": "2024-..."
}
```

### Test Full App

1. Visit your Vercel URL
2. Submit a feedback or idea
3. Login to admin (password: `admin123`)
4. Approve the submission
5. Check Browse Ideas page

---

## 🗄️ Database

Railway uses the SQLite database file (`event_feedback.db`) that persists with your deployment.

### Upgrade to PostgreSQL (Optional)

For better performance and scalability:

1. In Railway, click **"New"** → **"Database"** → **"PostgreSQL"**
2. Copy the `DATABASE_URL` from variables
3. Update your backend code to use PostgreSQL instead of SQLite
4. Update environment variables

---

## 🔐 Change Admin Password

**Important**: Change the default password after deployment!

1. On your local machine, run:
   ```bash
   cd backend
   node src/utils/hashPassword.js YOUR_NEW_PASSWORD
   ```

2. Copy the hash output

3. In Railway:
   - Go to **Variables**
   - Update `ADMIN_PASSWORD_HASH` with the new hash
   - Railway will redeploy automatically

---

## 📊 Monitor Your App

Railway provides:
- **Metrics**: CPU, Memory, Network usage
- **Logs**: Real-time application logs (click "View Logs")
- **Deployments**: History of all deployments
- **Observability**: Track errors and performance

---

## 💰 Railway Pricing

- **Starter Plan**: $5/month
- Includes $5 in usage credits
- Pay for what you use beyond that
- SQLite backend typically uses minimal resources

---

## 🐛 Troubleshooting

### Deployment fails
- Check logs in Railway dashboard
- Verify root directory is set to `backend`
- Ensure all environment variables are set

### CORS errors
- Make sure `CORS_ORIGIN` exactly matches Vercel URL
- Include `https://` protocol
- No trailing slash
- Redeploy backend after changing

### Database not persisting
- Railway automatically persists the SQLite file
- Check logs for database errors
- Consider upgrading to PostgreSQL for production

### Admin login not working
- Verify `ADMIN_PASSWORD_HASH` is set correctly
- Check `SESSION_SECRET` is configured
- Look for errors in Railway logs

---

## 🎉 Your App is Live!

Once both are deployed:

- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-app.railway.app
- **Admin**: https://your-app.vercel.app/admin

Share it with your community! 🚀
