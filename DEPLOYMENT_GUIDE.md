# 🚀 Live Deployment Guide

This guide will help you deploy your Fitness app to make it live on the internet.

## Choose Your Hosting Platform

### ⭐ Option 1: Render (Recommended - FREE)

**Why Render?**
- Free tier perfect for your app
- Automatic deployment from GitHub
- MongoDB Atlas integration easy
- Always running server

**Steps:**

1. **Go to [render.com](https://render.com)**
   - Sign up with your GitHub account (afnafathima@karunya.edu.in)

2. **Create New Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository: `Afna-Fathima/experiment-8`
   - Choose "main" branch

3. **Configure Settings**
   - **Name**: `fitness-app` (or any name)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Region**: Choose closest to you

4. **Add Environment Variables**
   - Click "Environment"
   - Add these variables:
     ```
     MONGODB_URI = mongodb+srv://afnafathima:afrin@cluster0.w0cnd1t.mongodb.net/?appName=Cluster0
     PORT = 3000
     NODE_ENV = production
     DB_NAME = fitness_db
     ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait 2-5 minutes for deployment
   - You'll get a live URL like: `https://fitness-app.onrender.com`

6. **✅ Your app is LIVE!**
   - Share the URL: `https://fitness-app.onrender.com`

---

### Option 2: Railway (FREE)

**Steps:**

1. **Go to [railway.app](https://railway.app)**
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project" → "Deploy from GitHub repo"
   - Select `Afna-Fathima/experiment-8`

3. **Add Variables**
   - In the Variables tab, add:
     ```
     MONGODB_URI = your_connection_string
     NODE_ENV = production
     ```

4. **Deploy**
   - Railway automatically deploys
   - Get your live URL

---

### Option 3: Heroku (FREE Tier Limited)

**Steps:**

1. **Install Heroku CLI** from [heroku.com/cli](https://www.heroku.com/cli)

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create App**
   ```bash
   heroku create fitness-planner-app
   ```

4. **Set MongoDB URI**
   ```bash
   heroku config:set MONGODB_URI="mongodb+srv://afnafathima:afrin@cluster0.w0cnd1t.mongodb.net/?appName=Cluster0"
   ```

5. **Deploy**
   ```bash
   git push heroku main
   ```

6. **View Live App**
   ```bash
   heroku open
   ```

---

### Option 4: Netlify (Frontend Only)

If you want to separate frontend and backend:

1. Deploy frontend to [Netlify](https://netlify.com)
2. Deploy backend to Render/Railway
3. Update API_BASE_URL in app.js to point to backend

---

## Testing Your Live App

After deployment, test these features:

✅ **1. Load Homepage**
- Visit your live URL
- Should see the fitness app interface

✅ **2. User Profile**
- Enter name, select level and goal
- Click "Save Profile"
- Refresh page - profile should persist

✅ **3. Browse Training Plans**
- See 16+ training plans load
- Filter by difficulty/category works
- Click "View Details" modal opens

✅ **4. Browse Diet Plans**
- See 13+ diet plans load
- Filter by goal works
- Plan details visible

✅ **5. Select Plans**
- Click "Select Plan" on a training plan
- Button changes to "✓ Selected"
- Card highlights in green

✅ **6. My Selected Plans**
- Go to "⭐ My Selected Plans" tab
- Your selected plans should appear
- Can remove them

✅ **7. API Health Check**
- Visit: `https://your-app.onrender.com/api/health`
- Should return: `{"status":"Server is running"}`

---

## Troubleshooting

### App shows 502 Bad Gateway
- **Solution**: Check MongoDB connection string is correct
- Wait 5-10 minutes for deployment to complete
- Check logs in Render/Railway dashboard

### Plans not loading
- **Solution**: Verify MONGODB_URI environment variable is set
- Check MongoDB Atlas IP whitelist includes your hosting provider

### "Cannot GET /" error
- **Solution**: Make sure server.js is in root directory
- Check package.json has `"start": "node server.js"`

### Selection not saving
- **Solution**: Check browser LocalStorage is enabled
- Open DevTools → Application → LocalStorage
- Should see your selections saved

---

## Share Your Live App

Once deployed, share the link:

📱 **Share with friends:**
```
Check out my Fitness App: https://your-app.onrender.com
```

📧 **Share with instructors:**
- Live URL: `https://your-app.onrender.com`
- GitHub Repo: `https://github.com/Afna-Fathima/experiment-8`
- Author: Afna Fathima
- Email: afnafathima@karunya.edu.in

---

## Monitoring Your Live App

### Render Dashboard
- Check app status
- View logs
- Restart if needed
- Scale resources

### Railway Dashboard
- Monitor memory/CPU usage
- Check deployment logs
- Set up alerts

---

## Next Steps

After going live:

1. ✅ **Test thoroughly** on live URL
2. ✅ **Share with others** for feedback
3. ✅ **Monitor performance** from dashboard
4. ✅ **Add authentication** for user logins (future)
5. ✅ **Enable progress tracking** (future)

---

## Questions?

If deployment fails:
1. Check the deployment logs in your platform's dashboard
2. Verify MongoDB connection string
3. Ensure all environment variables are set
4. Test locally first: `npm start`

---

**Status**: Your app is ready to go live! 🚀
