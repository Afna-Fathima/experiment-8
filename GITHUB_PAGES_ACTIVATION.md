# ✅ GITHUB PAGES ACTIVATION - STEP BY STEP

Your fitness app is now ready for GitHub Pages hosting! Follow these steps to activate it.

## 📋 Current Setup

- ✅ Frontend files (HTML, CSS, JS) copied to `docs/` folder
- ✅ GitHub Pages configuration file (`.nojekyll`) created
- ✅ API endpoint configured for flexibility
- ✅ All files pushed to GitHub

## 🚀 Step 1: Enable GitHub Pages in Repository Settings

### On GitHub Website:
1. Go to your repository: **https://github.com/Afna-Fathima/experiment-8**
2. Click **Settings** tab (top navigation)
3. Scroll down to **"Pages"** section (left sidebar)
4. Under **"Build and deployment"**:
   - **Source**: Select **"Deploy from a branch"**
   - **Branch**: Select **"main"** and folder **"/docs"**
   - Click **Save**

### Expected Result:
You should see: _"Your site is live at https://afna-fathima.github.io/experiment-8"_

### ⏳ Wait Time:
GitHub Pages usually takes 1-2 minutes to deploy. Check the "Deployments" section for status.

---

## 🌐 Step 2: Access Your Live App

Once deployment is complete, visit:
```
https://afna-fathima.github.io/experiment-8
```

You should see your fitness app interface with:
- ✅ Profile section
- ✅ Training Plans tab
- ✅ Diet Plans tab
- ✅ My Selected Plans dashboard

---

## ⚙️ Step 3: Configure Backend Connection

**Important**: Your app currently cannot fetch plans because the backend is not connected.

### Option A: Local Development (Works on localhost only)
- The app already works when running locally with `npm start`
- Backend server runs on `http://localhost:3000`

### Option B: Production Deployment (Recommended)

For GitHub Pages to display real data, deploy your backend to a cloud platform:

#### A. Deploy to **Render** (Free tier available):
1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: fitness-api
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add environment variables:
   - **MONGODB_URI**: `mongodb+srv://afnafathima:afrin@cluster0.w0cnd1t.mongodb.net/?appName=Cluster0`
   - **PORT**: 3000
   - **NODE_ENV**: production
6. Deploy and copy your URL (e.g., `https://fitness-api.onrender.com`)

#### B. Deploy to **Railway** (Very simple):
1. Go to https://railway.app
2. Create new project → Deploy from GitHub
3. Select your repository
4. Add environment variables (same as above)
5. Copy your deployment URL

#### C. Deploy to **Heroku** (Free tier ended, but still available):
1. Go to https://www.heroku.com
2. Create new app
3. Connect GitHub repository
4. Enable automatic deploys
5. Set environment variables
6. Copy your URL

---

## 🔗 Step 4: Connect GitHub Pages to Your Backend

Once you have a backend URL (from Render/Railway/Heroku), update the API endpoint:

### Edit `docs/app.js`:
Find this section at the top of the file:
```javascript
const API_BASE_URL = '/api';

function getAPIBaseURL() {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return '/api';
    }
    
    if (window.location.hostname.includes('github.io')) {
        // Replace with your actual backend URL
        // Example: return 'https://fitness-api.onrender.com/api';
        return '/api';
    }
    
    return '/api';
}
```

**Replace the GitHub Pages section with your backend URL**:
```javascript
if (window.location.hostname.includes('github.io')) {
    return 'https://your-backend-url.onrender.com/api';  // ← Replace with your backend URL
}
```

### Commit and Push:
```bash
git add docs/app.js
git commit -m "Update API endpoint for production backend"
git push origin main
```

---

## ✨ What Works Now

### ✅ Without Backend Connection:
- Profile creation and saving (localStorage)
- Plan selection/deselection
- My Selected Plans dashboard
- All UI interactions
- LocalStorage persistence

### ❌ Won't Work (Needs Backend):
- Loading actual training plans
- Loading diet plans
- Filtering plans
- Viewing plan details

---

## 🔍 Testing Your Setup

1. **Visit**: https://afna-fathima.github.io/experiment-8
2. **Create Profile**:
   - Enter name, level, and goal
   - Click "Save Profile"
3. **Select Plans** (if backend connected):
   - Browse training/diet tabs
   - Click "Select Plan" buttons
4. **View My Plans**:
   - Go to "My Selected Plans" tab
   - Your selections should appear

---

## 🆘 Troubleshooting

### Issue: "404 Not Found" error
- **Cause**: GitHub Pages not yet enabled in repository settings
- **Solution**: Go to Settings → Pages and verify `/docs` is selected

### Issue: "Failed to load plans" error
- **Cause**: Backend not deployed or API URL not configured
- **Solution**: 
  1. Deploy backend to Render/Railway/Heroku
  2. Update API URL in `docs/app.js`
  3. Commit and push changes

### Issue: Styling looks broken
- **Cause**: CSS file not loading
- **Solution**: 
  1. Check browser console for 404 errors
  2. Verify `/docs/styles.css` exists
  3. Hard refresh page (Ctrl+Shift+R)

### Issue: Profile/selections not saving
- **Cause**: LocalStorage disabled
- **Solution**: 
  1. Enable cookies/localStorage in browser settings
  2. Use incognito window (if privacy mode blocks storage)

---

## 📊 Architecture Overview

```
Your GitHub Pages App
├── Frontend: https://afna-fathima.github.io/experiment-8
│   ├── HTML, CSS, JS files in /docs folder
│   ├── Stores data in LocalStorage
│   └── Fetches plans from backend API
│
└── Backend: https://your-backend-url.onrender.com (or Railway/Heroku)
    ├── Node.js/Express server
    ├── MongoDB database connection
    └── REST API endpoints
```

---

## 🎯 Next Steps

1. **✅ GitHub Pages activation** ← You are here
2. **Deploy backend** to Render/Railway (critical for full functionality)
3. **Update API endpoint** in `docs/app.js`
4. **Test all features** on live GitHub Pages URL
5. **Share with users** at `https://afna-fathima.github.io/experiment-8`

---

## 📞 Need Help?

If GitHub Pages doesn't activate:
1. Verify repository is public
2. Check Settings → Pages is showing your site URL
3. Check browser console (F12) for errors
4. Wait 2-3 minutes and refresh page

If plans won't load:
1. Backend must be deployed first
2. API URL must be updated in `docs/app.js`
3. Backend must be running and accessible

---

**Your app is now set up for production! 🎉**
