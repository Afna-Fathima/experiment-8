# 🚀 Quick Start Guide

## ✅ Project Status

Your **Fitness Training & Diet Planning App** is now:
- ✅ Completely redesigned with plan selection interface
- ✅ Code pushed to GitHub: https://github.com/Afna-Fathima/experiment-8
- ✅ Ready for live deployment
- ✅ Secured with proper git configuration

---

## 📱 Current Features

### User Profile Management
- Set your name, fitness level, and fitness goal
- Profile automatically saved and persists across sessions

### Browse & Select Plans
- **16 Training Plans** - Browse by difficulty and category
- **13 Diet Plans** - Browse by fitness goal
- Click "View Details" for complete plan information
- Click "Select Plan" to add to your collection

### My Selected Plans
- View all selected training and diet plans in one dashboard
- Remove plans anytime
- See total count of selected plans

### Smart Filtering
- Filter training plans by difficulty level and category
- Filter diet plans by fitness goal
- Real-time results

---

## 🏃 Run Locally

### Option 1: Using Node/npm

```bash
cd "c:\Users\agust\Downloads\exp 8"
npm install
npm start
```

Then open: **http://localhost:3000** (or the port shown in terminal)

### Option 2: Using Windows Command Prompt

```cmd
cd "c:\Users\agust\Downloads\exp 8"
npm install
npm start
```

---

## 🌐 Deploy Live (Pick One)

### ⭐ Recommended: Render.com (Free)

1. Go to https://render.com
2. Sign up with GitHub
3. Create Web Service
4. Select: `Afna-Fathima/experiment-8`
5. Add environment variables:
   ```
   MONGODB_URI=mongodb+srv://afnafathima:afrin@cluster0.w0cnd1t.mongodb.net/?appName=Cluster0
   NODE_ENV=production
   DB_NAME=fitness_db
   ```
6. Deploy!

**Your app will be live at:** `https://fitness-diet-app.onrender.com`

See **DEPLOYMENT.md** for more options (Heroku, Railway, etc.)

---

## 📁 Project Files

```
experiment-8/
├── server.js              # Backend (Node/Express)
├── package.json           # Dependencies
├── .env                   # Configuration (MongoDB URI, Port)
├── README.md              # Full documentation
├── DEPLOYMENT.md          # Deployment instructions
├── QUICK_START.md         # This file
│
└── public/
    ├── index.html         # UI (Plan selection interface)
    ├── app.js             # Logic (Select/track plans)
    └── styles.css         # Styling (Responsive design)
```

---

## 🔑 Important Configuration

### `.env` file contains:
```
MONGODB_URI=mongodb+srv://afnafathima:afrin@cluster0.w0cnd1t.mongodb.net/?appName=Cluster0
PORT=3000
NODE_ENV=development
DB_NAME=fitness_db
```

- ✅ Already configured with your MongoDB Atlas
- ⚠️ Keep `.env` file safe and don't share it
- ⚠️ `.env` is in `.gitignore` so it won't be pushed to GitHub

---

## 🔒 GitHub Security

Your repository is configured with:
- ✅ Author: **afna-fathima**
- ✅ Email: **afnafathima@karunya.edu.in**
- ✅ Privacy: Only you can contribute (no other collaborators)
- ✅ All files properly committed and pushed

---

## 🎯 Next Steps

### To Deploy Now:
1. Follow the **Render.com** deployment steps above
2. Share your live URL with friends
3. Your app will be accessible 24/7

### To Customize Further:
1. Edit `public/index.html` for UI changes
2. Edit `public/app.js` for logic changes
3. Edit `server.js` for backend changes
4. Push changes: `git add .` → `git commit -m "..."` → `git push origin main`
5. Render auto-deploys with each push!

### To Add New Features:
- User authentication (login/signup)
- Workout logging with dates
- Progress tracking
- Community features
- Mobile app

---

## 📊 API Endpoints

Your backend provides:

```
GET  /api/trainings              - Get all training plans
GET  /api/trainings?difficulty=Beginner&category=Cardio
GET  /api/trainings/:id          - Get single training
GET  /api/diets                  - Get all diet plans
GET  /api/diets?goal=Muscle%20Gain
GET  /api/diets/:id              - Get single diet
GET  /api/health                 - Health check
```

---

## 🐛 Troubleshooting

### "Port 3000 is already in use"
- The app automatically tries other ports (3001, 3002, etc.)
- Or: Stop other services using port 3000

### "Cannot connect to MongoDB"
- Check `.env` file has correct connection string
- Verify MongoDB Atlas cluster is running
- Check IP whitelist in MongoDB Atlas

### "API endpoints return 404"
- Verify server is running
- Check browser console for error messages
- Try accessing http://localhost:3000/api/health

---

## 📞 Support

- **GitHub:** https://github.com/Afna-Fathima/experiment-8
- **Email:** afnafathima@karunya.edu.in
- **Render Docs:** https://render.com/docs
- **MongoDB Docs:** https://docs.mongodb.com

---

## ✨ What Makes This App Great

✅ **No Framework Bloat** - Pure HTML/CSS/JavaScript  
✅ **Cloud Database** - Secure MongoDB Atlas  
✅ **Mobile Responsive** - Works on all devices  
✅ **Easy Deployment** - One-click deploy on Render  
✅ **Professional UI** - Beautiful gradient design  
✅ **User Profile** - Personalized experience  
✅ **Plan Selection** - Smart filtering and selection  
✅ **Persistent Storage** - Data saved locally  

---

## 🎉 You're All Set!

Your project is:
- ✅ Code-complete with new selection interface
- ✅ Uploaded to GitHub
- ✅ Ready for live deployment
- ✅ Fully documented

**Next: Deploy to Render and go live! 🚀**

---

**Created:** October 2025  
**Status:** ✅ Production Ready
