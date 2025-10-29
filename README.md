# 💪 Professional Fitness Training & Diet Planner

A comprehensive full-stack web application for managing professional fitness training plans and personalized diet plans using Node.js, Express, and MongoDB Atlas.

## ✨ Key Features

### 🏋️ Professional Training Management
- **7 Pre-loaded Training Plans** with detailed information
- Categories: Full Body, Upper Body, Lower Body, Cardio, Shoulders/Core, Recovery
- Difficulty Levels: Beginner, Intermediate, Advanced
- Track exercises, target muscles, duration, intensity, calories burned
- Smart filtering by category and difficulty
- Frequency recommendations and detailed notes
- Example plans:
  - Beginner Full Body (45 min, Low Intensity)
  - Chest & Triceps Power (60 min, High Intensity)
  - Back & Biceps Mass Builder (65 min, High Intensity)
  - Leg Day Destroyer (75 min, Very High Intensity)
  - HIIT Cardio Burn (30 min, Very High Intensity)
  - Shoulders & Abs Specialist (50 min, Moderate Intensity)
  - Active Recovery Yoga (40 min, Low Intensity)

### 🍽️ Advanced Diet Planning
- **6 Pre-loaded Diet Plans** optimized for different goals
- Goals: Muscle Gain, Fat Loss, Maintenance, Endurance
- Macronutrient tracking (Protein, Carbs, Fats)
- Detailed meal plans with specific foods
- Supplement recommendations
- Calorie targets based on fitness goals
- Example diets:
  - Muscle Gain - High Protein (2800 kcal)
  - Fat Loss - Moderate Carbs (1800 kcal)
  - Maintenance - Balanced (2200 kcal)
  - Endurance Athlete (3000 kcal)
  - Keto - Low Carb (1900 kcal)
  - Vegan Muscle Building (2700 kcal)

### 🎯 Advanced Features
- **Smart Filtering**: Filter by category, difficulty, and fitness goals
- **Responsive Design**: Beautiful UI with gradient backgrounds
- **Real-time Operations**: Create, read, update, delete plans
- **Data Persistence**: All data stored in MongoDB Atlas
- **Professional UI**: Emoji icons, organized cards, detailed information
- **Mobile Friendly**: Works perfectly on all devices
- **Alert System**: User-friendly notifications for all actions

## 🏗️ Professional Architecture

### Database Design
```
fitness_db/
├── trainings (collection)
│   ├── name
│   ├── description
│   ├── duration
│   ├── intensity
│   ├── difficulty
│   ├── category
│   ├── exercises
│   ├── targetMuscles
│   ├── caloriesBurned
│   ├── frequency
│   └── notes
│
├── diets (collection)
│   ├── name
│   ├── description
│   ├── goal
│   ├── calorieTarget
│   ├── macros
│   ├── meals
│   ├── mealCount
│   ├── supplements
│   └── notes
│
└── user_progress (collection - for future enhancements)
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (cloud-hosted MongoDB)
- npm or yarn

### Installation

1. **Navigate to project directory:**
```bash
cd "c:\Users\agust\Downloads\exp 8"
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure MongoDB Connection** (Already configured in `.env`):
```
MONGODB_URI=mongodb+srv://afnafathima:afrin@cluster0.w0cnd1t.mongodb.net/?appName=Cluster0
PORT=5001
NODE_ENV=development
DB_NAME=fitness_db
```

### Running the Application

**Start the server:**
```bash
npm start
```

Notes about port and URLs
- The server will try to bind to the port set in your `.env` (PORT). If that port is in use, the server will automatically try the next few ports and then let the OS pick a free port.
- The server serves the frontend from the same origin, so the client calls the API using a relative path (`/api`). You can open the URL printed in the server logs (for example `http://localhost:7000`) to use the app.

**Access the application:**
- Open the URL printed in the terminal after server startup (e.g. http://localhost:7000)
- API endpoints: use the same origin, e.g. http://localhost:7000/api (the frontend uses `/api` internally)

### Development Mode (with auto-reload):
```bash
npm run dev
```

## 📡 API Documentation

### Training Endpoints

#### Get All Trainings
```bash
GET /api/trainings
Query Parameters:
  - category: Filter by category (Full Body, Upper Body, Lower Body, Cardio, Shoulders/Core, Recovery)
  - difficulty: Filter by difficulty (Beginner, Intermediate, Advanced)
  - intensity: Filter by intensity (Low, Moderate, High, Very High)
  - sort: Sort by field (duration, calories)

Example: /api/trainings?category=Upper Body&difficulty=Advanced
```

#### Get Training by ID
```bash
GET /api/trainings/:id
```

#### Create Training
```bash
POST /api/trainings
Content-Type: application/json

Body: {
  "name": "Chest Day",
  "description": "Advanced chest workout",
  "duration": 60,
  "intensity": "High",
  "difficulty": "Advanced",
  "category": "Upper Body",
  "exercises": ["Barbell Bench Press", "Incline Press"],
  "targetMuscles": ["Chest", "Triceps"],
  "caloriesBurned": 280,
  "frequency": "2x per week",
  "notes": "Rest 2-3 minutes between heavy sets"
}
```

#### Update Training
```bash
PUT /api/trainings/:id
```

#### Delete Training
```bash
DELETE /api/trainings/:id
```

### Diet Endpoints

#### Get All Diets
```bash
GET /api/diets
Query Parameters:
  - goal: Filter by goal (Muscle Gain, Fat Loss, Maintenance, Endurance)
  - sort: Sort by calories (calories)

Example: /api/diets?goal=Muscle Gain
```

#### Get Diet by ID
```bash
GET /api/diets/:id
```

#### Create Diet
```bash
POST /api/diets
Content-Type: application/json

Body: {
  "name": "Muscle Gain - High Protein",
  "description": "Caloric surplus diet",
  "goal": "Muscle Gain",
  "calorieTarget": 2800,
  "macros": {
    "protein": 200,
    "carbs": 320,
    "fats": 95
  },
  "meals": ["Breakfast: 4 eggs, toast", "Lunch: Grilled chicken, rice"],
  "supplements": ["Whey Protein", "Creatine"],
  "notes": "Maintain 500 calorie surplus"
}
```

#### Update Diet
```bash
PUT /api/diets/:id
```

#### Delete Diet
```bash
DELETE /api/diets/:id
```

### Health Check
```bash
GET /api/health
Response: { "status": "Server is running" }
```

## 📊 Example Workflow

### 1. View Pre-loaded Training Plans
```bash
curl http://localhost:5001/api/trainings
```

### 2. Filter by Difficulty
```bash
curl "http://localhost:5001/api/trainings?difficulty=Beginner"
```

### 3. View Pre-loaded Diet Plans
```bash
curl http://localhost:5001/api/diets
```

### 4. Filter by Goal
```bash
curl "http://localhost:5001/api/diets?goal=Muscle%20Gain"
```

### 5. Create Custom Training Plan
```bash
curl -X POST http://localhost:5001/api/trainings \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Arm Blaster",
    "duration": 45,
    "intensity": "High",
    "difficulty": "Intermediate",
    "category": "Upper Body",
    "exercises": ["Barbell Curls", "Tricep Dips"],
    "targetMuscles": ["Biceps", "Triceps"],
    "caloriesBurned": 200,
    "frequency": "2x per week"
  }'
```

## 🎨 User Interface Highlights

### Professional Design
- **Gradient backgrounds** with purple/blue theme
- **Smooth animations** and hover effects
- **Emoji icons** for visual clarity
- **Color-coded badges** for categories and levels
- **Responsive grid layout** that adapts to screen size

### Interactive Components
- **Tab navigation** for Training and Diet sections
- **Smart filters** with real-time results
- **Detailed cards** showing all information
- **Action buttons** for edit and delete
- **Form validation** for data integrity
- **Alert notifications** for user feedback

## 📱 Responsive Design

Works seamlessly on:
- 💻 Desktop computers
- 🖥️ Tablets
- 📱 Mobile phones

## 🔄 Data Flow

```
Client (HTML/CSS/JS)
         ↓
    Browser
         ↓
    HTTP Requests
         ↓
    Express Server (Node.js)
         ↓
    API Routes & Logic
         ↓
    MongoDB Driver
         ↓
    MongoDB Atlas (Cloud Database)
```

## 🛡️ Error Handling

The API includes comprehensive error handling:
- Missing required fields validation
- Proper HTTP status codes
- Descriptive error messages
- Connection error handling
- Database operation error handling

## 📦 Project Structure

```
fitness-diet-planner/
├── server.js                 # Express server with API routes
├── package.json              # Dependencies and scripts
├── .env                      # Environment configuration
├── .gitignore               # Git ignore file
├── README.md                # Documentation
│
└── public/
    ├── index.html           # Main HTML page
    ├── styles.css           # Responsive CSS styling
    └── app.js               # Client-side JavaScript logic
```

## 🔧 Technologies Used

- **Backend**: Node.js, Express.js 4.18.2
- **Database**: MongoDB 5.8.0 (MongoDB Atlas)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Middleware**: CORS, body-parser (Express)
- **Environment**: dotenv for configuration
- **Development**: nodemon for auto-reload

## 🚀 Performance Features

- **Indexed database queries** for fast filtering
- **Efficient data retrieval** with MongoDB
- **Client-side caching** for better UX
- **Minimal payload sizes**
- **RESTful API design** for scalability

## 🔐 Security Considerations

- Environment variables for sensitive data
- MongoDB Atlas connection string secured
- CORS enabled for cross-origin requests
- Input validation on all endpoints
- Error messages that don't expose sensitive info

## 📈 Future Enhancements

- [ ] User authentication and profiles
- [ ] Edit functionality for all plans
- [ ] Progress tracking over time
- [ ] Exercise library with form videos
- [ ] Meal recipes database
- [ ] Statistics and analytics dashboard
- [ ] Workout timer and counter
- [ ] Mobile app version
- [ ] Notification system for workouts
- [ ] Integration with fitness wearables

## 🆘 Troubleshooting

### Connection Issues
- Verify MongoDB Atlas connection string
- Check network connectivity
- Ensure firewall allows port 5001

### Port Already in Use
- Change PORT in .env file
- Or kill existing process on port 5001

### Missing Collections
- Collections auto-create on first run
- Sample data loads automatically

## 📞 Support

For issues or questions:
1. Check error messages in browser console
2. Review server logs in terminal
3. Verify MongoDB Atlas connection
4. Check network requests in browser DevTools

## 📝 License

ISC

---

**Version**: 1.0.0  
**Last Updated**: October 2025  
**Status**: Production Ready ✅

