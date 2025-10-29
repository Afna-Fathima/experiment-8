const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = process.env.DB_NAME || 'fitness_db';

if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI is not defined in .env file');
  process.exit(1);
}

let db;
let trainingCollection;
let dietCollection;
let userProgressCollection;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection
async function connectDB() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ Connected to MongoDB Atlas');
    
    db = client.db(DB_NAME);
    trainingCollection = db.collection('trainings');
    dietCollection = db.collection('diets');
    userProgressCollection = db.collection('user_progress');
    
    // Create indexes
    await trainingCollection.createIndex({ createdAt: 1 });
    await trainingCollection.createIndex({ difficulty: 1 });
    await trainingCollection.createIndex({ category: 1 });
    
    await dietCollection.createIndex({ createdAt: 1 });
    await dietCollection.createIndex({ goal: 1 });
    
    await userProgressCollection.createIndex({ userId: 1, date: -1 });
    
    // Initialize sample data if collections are empty
    await initializeSampleData();
    
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  }
}

// Initialize sample fitness data
async function initializeSampleData() {
  try {
    const trainingCount = await trainingCollection.countDocuments();
    const dietCount = await dietCollection.countDocuments();
    
    // Add sample trainings if collection is empty
    if (trainingCount === 0) {
      const sampleTrainings = [
        // BEGINNER PROGRAMS
        {
          name: 'Beginner Full Body (3 Days/Week)',
          description: 'Perfect for beginners starting their fitness journey. Builds foundation strength and endurance.',
          duration: 45,
          intensity: 'Low',
          difficulty: 'Beginner',
          category: 'Full Body',
          level: 'Week 1-4',
          exercises: ['Squats', 'Push-ups', 'Rows', 'Planks', 'Lunges'],
          targetMuscles: ['Legs', 'Chest', 'Back', 'Core'],
          caloriesBurned: 150,
          frequency: '3x per week (Mon/Wed/Fri)',
          restDays: 'Min 1 day between sessions',
          equipment: 'Dumbbells, Bodyweight',
          notes: 'Focus on proper form over speed. Rest 60 seconds between sets. No weight needed - use bodyweight.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Beginner Upper Body (2 Days/Week)',
          description: 'Builds upper body strength and muscle endurance for beginners.',
          duration: 40,
          intensity: 'Low',
          difficulty: 'Beginner',
          category: 'Upper Body',
          level: 'Week 1-3',
          exercises: ['Dumbbell Bench Press', 'Bent Over Rows', 'Shoulder Press', 'Bicep Curls', 'Tricep Extensions'],
          targetMuscles: ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps'],
          caloriesBurned: 120,
          frequency: '2x per week (Tue/Fri)',
          restDays: 'Minimum 3 days between sessions',
          equipment: 'Dumbbells (5-15 lbs)',
          notes: 'Use light weights. Perfect form is essential. Start with 3 sets of 12-15 reps.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Beginner Lower Body (2 Days/Week)',
          description: 'Develops leg strength and stability for fitness beginners.',
          duration: 40,
          intensity: 'Low',
          difficulty: 'Beginner',
          category: 'Lower Body',
          level: 'Week 1-3',
          exercises: ['Bodyweight Squats', 'Glute Bridges', 'Lunges', 'Calf Raises', 'Wall Sits'],
          targetMuscles: ['Quads', 'Hamstrings', 'Glutes', 'Calves'],
          caloriesBurned: 130,
          frequency: '2x per week (Mon/Thu)',
          restDays: 'Minimum 3 days between sessions',
          equipment: 'Bodyweight, Resistance Bands (optional)',
          notes: 'No weights needed. Bodyweight is sufficient. Perform 3 sets of 12-15 reps per exercise.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Complete Beginner Routine (5 Days/Week)',
          description: 'Total body workout schedule perfect for complete beginners entering the gym.',
          duration: 35,
          intensity: 'Very Low',
          difficulty: 'Beginner',
          category: 'Full Body',
          level: 'Week 1-2',
          exercises: ['Treadmill', 'Elliptical', 'Rowing Machine', 'Light Weights', 'Stretching'],
          targetMuscles: ['Cardiovascular System', 'Full Body'],
          caloriesBurned: 100,
          frequency: '5x per week',
          restDays: 'Weekends off',
          equipment: 'Cardio Machines, Light Dumbbells',
          notes: 'Low intensity to build habit. Focus on getting comfortable in the gym.',
          createdAt: new Date(),
          updatedAt: new Date()
        },

        // INTERMEDIATE PROGRAMS
        {
          name: 'Push/Pull/Legs Split (6 Days/Week)',
          description: 'Classic PPL split for muscle growth. Each muscle group trained once per week with high volume.',
          duration: 60,
          intensity: 'High',
          difficulty: 'Intermediate',
          category: 'Full Body',
          level: 'Week 8-12',
          exercises: ['Barbell Bench Press', 'Incline Dumbbell Press', 'Barbell Rows', 'Pull-ups', 'Leg Press', 'Deadlifts'],
          targetMuscles: ['All Major Muscle Groups'],
          caloriesBurned: 280,
          frequency: '6x per week (Push/Pull/Legs x2)',
          restDays: '1 day per week',
          equipment: 'Full Gym Access Required',
          notes: 'Advanced split. Requires commitment. Progressive overload on main lifts.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Upper/Lower Split (4 Days/Week)',
          description: 'Balanced strength and hypertrophy program. Train upper body twice, lower body twice per week.',
          duration: 55,
          intensity: 'Moderate-High',
          difficulty: 'Intermediate',
          category: 'Full Body',
          level: 'Week 5-8',
          exercises: ['Bench Press', 'Rows', 'Squats', 'Deadlifts', 'Overhead Press', 'Pull-ups'],
          targetMuscles: ['All Major Muscle Groups'],
          caloriesBurned: 250,
          frequency: '4x per week (2 Upper / 2 Lower)',
          restDays: '3 days per week',
          equipment: 'Barbell, Dumbbells, Pull-up Bar',
          notes: 'Excellent for natural lifters. Focus on compound movements. Track strength progression.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Body Part Split (5 Days/Week)',
          description: 'Train one body part per day. Allows high volume per muscle group with adequate recovery.',
          duration: 65,
          intensity: 'High',
          difficulty: 'Intermediate',
          category: 'Full Body',
          level: 'Week 6-10',
          exercises: ['Exercise varies per day', 'High volume focus', '3-4 exercises per body part'],
          targetMuscles: ['One per day rotation'],
          caloriesBurned: 270,
          frequency: '5x per week (Mon-Fri)',
          restDays: 'Weekends',
          equipment: 'Full Gym Access',
          notes: 'Bro split. Mon: Chest, Tue: Back, Wed: Shoulders, Thu: Legs, Fri: Arms',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Strength Focus (4 Days/Week)',
          description: 'Powerlifting-style program focusing on main compound lifts with progressive overload.',
          duration: 70,
          intensity: 'Very High',
          difficulty: 'Intermediate',
          category: 'Full Body',
          level: 'Week 8-12',
          exercises: ['Barbell Squats', 'Barbell Bench Press', 'Deadlifts', 'Overhead Press'],
          targetMuscles: ['Legs', 'Chest', 'Back', 'Shoulders'],
          caloriesBurned: 300,
          frequency: '4x per week',
          restDays: '3 days per week',
          equipment: 'Barbell, Rack, Bench',
          notes: 'Heavy weights, low reps (3-5). Rest 3-5 minutes between heavy sets.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Hypertrophy Focus (4 Days/Week)',
          description: 'Bodybuilding-style program designed for muscle growth with moderate weights and higher reps.',
          duration: 60,
          intensity: 'Moderate-High',
          difficulty: 'Intermediate',
          category: 'Full Body',
          level: 'Week 6-10',
          exercises: ['Dumbbell Presses', 'Cable Exercises', 'Isolation Movements', 'Machine Work'],
          targetMuscles: ['All Muscle Groups'],
          caloriesBurned: 260,
          frequency: '4x per week',
          restDays: '3 days per week',
          equipment: 'Full Gym Access (preferably bodybuilding focused)',
          notes: 'Moderate weight, 8-12 reps. Mind-muscle connection. Pump work.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Functional Fitness (3 Days/Week)',
          description: 'CrossFit-style functional movements combining strength, power, and endurance.',
          duration: 50,
          intensity: 'Very High',
          difficulty: 'Intermediate',
          category: 'Full Body',
          level: 'Week 4-8',
          exercises: ['Olympic Lifts', 'Gymnastics', 'Metabolic Conditioning', 'Compound Movements'],
          targetMuscles: ['Full Body'],
          caloriesBurned: 320,
          frequency: '3x per week',
          restDays: '4 days per week',
          equipment: 'Barbell, Kettlebells, Box, Rope',
          notes: 'High intensity. Mix of strength and cardio. Community-focused training style.',
          createdAt: new Date(),
          updatedAt: new Date()
        },

        // ADVANCED PROGRAMS
        {
          name: 'Advanced Periodized Strength (4 Days/Week)',
          description: 'Professional-grade periodization for maximum strength gains. Linear progression model.',
          duration: 80,
          intensity: 'Very High',
          difficulty: 'Advanced',
          category: 'Full Body',
          level: 'Week 12+',
          exercises: ['Main Lift', 'Supplemental Lift', 'Accessory Work', 'Conditioning'],
          targetMuscles: ['Focus on Competition Lifts'],
          caloriesBurned: 320,
          frequency: '4x per week (Competition + Supplemental)',
          restDays: '3 days per week',
          equipment: 'Professional Powerlifting Setup',
          notes: 'Periodized approach. Weeks vary: Hypertrophy > Strength > Power. Deload weeks every 4-6 weeks.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Advanced Bodybuilding (5-6 Days/Week)',
          description: 'High-volume bodybuilding program for experienced lifters seeking maximum muscle growth.',
          duration: 75,
          intensity: 'High',
          difficulty: 'Advanced',
          category: 'Full Body',
          level: 'Week 16+',
          exercises: ['3-4 exercises per muscle', 'Compound + Isolation', 'High volume', 'Advanced techniques'],
          targetMuscles: ['All Muscle Groups with specialization'],
          caloriesBurned: 300,
          frequency: '5-6x per week',
          restDays: '1-2 days per week',
          equipment: 'Professional Bodybuilding Gym',
          notes: 'Drop sets, supersets, tri-sets, rest-pause sets. Track pump and feel. Nutrition critical.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Advanced Calisthenics (4 Days/Week)',
          description: 'Advanced bodyweight training for maximum strength and muscle without weights.',
          duration: 60,
          intensity: 'Very High',
          difficulty: 'Advanced',
          category: 'Full Body',
          level: 'Week 12+',
          exercises: ['Planche Progressions', 'Front Lever', 'Handstand Push-ups', 'Muscle-ups', 'One-Arm Pull-ups'],
          targetMuscles: ['Full Body'],
          caloriesBurned: 280,
          frequency: '4x per week',
          restDays: '3 days per week',
          equipment: 'Pull-up Bar, Rings, Dip Station',
          notes: 'No weights needed. Advanced progressions. Requires years of training. Focus on skill.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Olympic Weightlifting Program (4 Days/Week)',
          description: 'Technical Olympic lifting program for competitive weightlifters.',
          duration: 90,
          intensity: 'Very High',
          difficulty: 'Advanced',
          category: 'Full Body',
          level: 'Week 16+',
          exercises: ['Snatch', 'Clean & Jerk', 'Front Squats', 'Back Squats', 'Accessory Work'],
          targetMuscles: ['Total Body - Explosive Power Focus'],
          caloriesBurned: 350,
          frequency: '4x per week (2 technique, 2 strength)',
          restDays: '3 days per week',
          equipment: 'Olympic Platform, Barbells, Bumpers',
          notes: 'Requires technical coaching. High skill. Competition-focused.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Advanced Cardio/Conditioning (5 Days/Week)',
          description: 'High-intensity conditioning program for athletes and fitness enthusiasts.',
          duration: 45,
          intensity: 'Very High',
          difficulty: 'Advanced',
          category: 'Cardio',
          level: 'Week 8+',
          exercises: ['HIIT', 'Sprints', 'Long Distance', 'Circuit Training', 'Interval Work'],
          targetMuscles: ['Cardiovascular System', 'Full Body'],
          caloriesBurned: 400,
          frequency: '5x per week',
          restDays: '2 days per week',
          equipment: 'Minimal - Running, Bike, Rowing Machine',
          notes: 'Mix steady-state and intervals. Proper recovery critical. Listen to body.',
          createdAt: new Date(),
          updatedAt: new Date()
        },

        // SPECIALTY PROGRAMS
        {
          name: 'Fat Loss & Cardio (5 Days/Week)',
          description: 'Combines resistance training with cardio for optimal fat loss.',
          duration: 50,
          intensity: 'High',
          difficulty: 'Intermediate',
          category: 'Cardio',
          level: 'Any',
          exercises: ['Compound Movements + HIIT', '30-40 min total', 'Low rest periods'],
          targetMuscles: ['Full Body - Fat Loss Focus'],
          caloriesBurned: 350,
          frequency: '5x per week',
          restDays: '2 days per week',
          equipment: 'Gym or Home Equipment',
          notes: 'Caloric deficit required. Combine with proper diet. Track progress by measurements.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Athletic Performance (4 Days/Week)',
          description: 'Sport-specific training for athletes looking to improve performance.',
          duration: 65,
          intensity: 'High',
          difficulty: 'Intermediate-Advanced',
          category: 'Full Body',
          level: 'Week 6+',
          exercises: ['Olympic Lifts', 'Plyometrics', 'Speed Work', 'Agility Drills'],
          targetMuscles: ['Power, Speed, Agility Focus'],
          caloriesBurned: 300,
          frequency: '4x per week',
          restDays: '3 days per week',
          equipment: 'Barbells, Boxes, Cones, Ladder',
          notes: 'Sport-specific. Explosive power focus. Track speed and agility metrics.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Home Workout (3-5 Days/Week)',
          description: 'Complete home workout program requiring minimal or no equipment.',
          duration: 40,
          intensity: 'Moderate',
          difficulty: 'Beginner-Intermediate',
          category: 'Full Body',
          level: 'Week 1+',
          exercises: ['Bodyweight Exercises', 'Resistance Bands', 'Dumbbells (optional)'],
          targetMuscles: ['Full Body'],
          caloriesBurned: 180,
          frequency: '3-5x per week (flexible)',
          restDays: 'Flexible',
          equipment: 'None - Bodyweight Only',
          notes: 'Perfect for busy schedules. No gym needed. Adjustable intensity.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Senior Fitness (3 Days/Week)',
          description: 'Low-impact program designed for older adults focusing on mobility and strength.',
          duration: 45,
          intensity: 'Low',
          difficulty: 'Beginner',
          category: 'Full Body',
          level: 'Any Age',
          exercises: ['Controlled Movements', 'Balance Work', 'Flexibility', 'Light Resistance'],
          targetMuscles: ['Full Body - Mobility Focus'],
          caloriesBurned: 120,
          frequency: '3x per week',
          restDays: 'At least 1 day between sessions',
          equipment: 'Light Dumbbells, Chair, Balance Equipment',
          notes: 'Low impact. Flexibility crucial. Consult doctor before starting.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Rehabilitation/Prehab (3-4 Days/Week)',
          description: 'Specialized program for injury prevention and rehabilitation from injuries.',
          duration: 35,
          intensity: 'Low-Moderate',
          difficulty: 'Beginner-Intermediate',
          category: 'Recovery',
          level: 'Any',
          exercises: ['Mobility Work', 'Prehab Exercises', 'Flexibility', 'Stability Training'],
          targetMuscles: ['Injury Prevention Focus'],
          caloriesBurned: 100,
          frequency: '3-4x per week',
          restDays: 'As needed',
          equipment: 'Resistance Bands, Foam Roller, Lacrosse Ball',
          notes: 'Consult physiotherapist. Prevent injuries. Address weaknesses.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Yoga & Flexibility (3-5 Days/Week)',
          description: 'Comprehensive yoga and flexibility program for all fitness levels.',
          duration: 40,
          intensity: 'Very Low',
          difficulty: 'Beginner',
          category: 'Recovery',
          level: 'Any',
          exercises: ['Various Yoga Poses', 'Stretching', 'Breathing', 'Mindfulness'],
          targetMuscles: ['Full Body - Flexibility Focus'],
          caloriesBurned: 100,
          frequency: '3-5x per week',
          restDays: 'Flexible',
          equipment: 'Yoga Mat (optional)',
          notes: 'Perfect recovery day activity. Improves mobility and mental health.',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Boxing Training (4 Days/Week)',
          description: 'Boxing-based training combining cardio, coordination, and upper body work.',
          duration: 55,
          intensity: 'High',
          difficulty: 'Intermediate',
          category: 'Cardio',
          level: 'Week 4+',
          exercises: ['Heavy Bag Work', 'Speed Bag', 'Shadowboxing', 'Core Work'],
          targetMuscles: ['Full Body - Upper Body Focus'],
          caloriesBurned: 330,
          frequency: '4x per week',
          restDays: '3 days per week',
          equipment: 'Heavy Bag, Gloves, Speed Bag',
          notes: 'Great cardio and stress relief. Requires technique. Fun and effective.',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      await trainingCollection.insertMany(sampleTrainings);
      console.log(`✅ Inserted ${sampleTrainings.length} professional training plans`);
    }
    
    // Add sample diets if collection is empty
    if (dietCount === 0) {
      const sampleDiets = [
        // MUSCLE GAIN DIETS
        {
          name: 'Beginner Muscle Gain - 2200 Calories',
          description: 'Starting point for muscle building. Modest surplus with balanced macros.',
          goal: 'Muscle Gain',
          level: 'Beginner',
          calorieTarget: 2200,
          macros: {
            protein: 150,
            carbs: 250,
            fats: 70
          },
          meals: [
            'Breakfast: 3 eggs, 2 slices whole wheat toast, banana',
            'Mid-Morning: Greek yogurt with granola and berries',
            'Lunch: 150g grilled chicken, 200g rice, broccoli',
            'Pre-Workout: Banana with 1 tbsp peanut butter',
            'Post-Workout: Protein shake with fruit',
            'Dinner: 150g lean beef, sweet potato, green beans'
          ],
          mealCount: 6,
          notes: 'Modest 200 calorie surplus. Perfect for beginners. Gain 0.5-1 lb per week.',
          supplements: ['Whey Protein', 'Multivitamin', 'Omega-3'],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Intermediate Muscle Gain - 2800 Calories',
          description: 'Solid surplus for muscle growth. Proven macros for hypertrophy.',
          goal: 'Muscle Gain',
          level: 'Intermediate',
          calorieTarget: 2800,
          macros: {
            protein: 200,
            carbs: 320,
            fats: 95
          },
          meals: [
            'Breakfast: 4 eggs, 2 slices whole wheat toast, avocado, orange juice',
            'Mid-Morning: Protein shake with oats and almond butter',
            'Lunch: 200g grilled chicken breast, 250g brown rice, broccoli with olive oil',
            'Pre-Workout: Banana with 1.5 tbsp peanut butter and rice cakes',
            'Post-Workout: Whey protein shake with dextrose',
            'Dinner: 200g lean ground beef, pasta with tomato sauce, mixed vegetables'
          ],
          mealCount: 6,
          notes: 'Aggressive 500 calorie surplus. Gain 1-1.5 lbs per week. Adjust if gaining too fast.',
          supplements: ['Whey Protein', 'Creatine Monohydrate', 'Multivitamin', 'Omega-3'],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Advanced Muscle Gain - 3500 Calories',
          description: 'High-calorie surplus for serious muscle builders. For advanced lifters only.',
          goal: 'Muscle Gain',
          level: 'Advanced',
          calorieTarget: 3500,
          macros: {
            protein: 250,
            carbs: 420,
            fats: 120
          },
          meals: [
            'Breakfast: 5 eggs, 3 slices whole wheat toast, butter, 2 glasses OJ',
            'Mid-Morning: Large protein shake (2 scoops protein, oats, 2 tbsp peanut butter, banana)',
            'Lunch: 250g chicken, 300g rice, broccoli with olive oil, fruit',
            'Pre-Workout: Large banana, 2 tbsp honey, rice cakes',
            'Post-Workout: Whey protein shake with dextrose and berries',
            'Early Dinner: 250g salmon, 300g sweet potato, green beans',
            'Late Dinner: Lean ground beef, pasta, veggies'
          ],
          mealCount: 7,
          notes: 'Very high surplus. Requires proper training and genetics. May gain 2+ lbs per week.',
          supplements: ['Whey Protein (2x daily)', 'Creatine', 'Multivitamin', 'Omega-3', 'Vitamin D'],
          createdAt: new Date(),
          updatedAt: new Date()
        },

        // FAT LOSS DIETS
        {
          name: 'Beginner Fat Loss - 1600 Calories',
          description: 'Gentle deficit for sustainable fat loss and healthy habits.',
          goal: 'Fat Loss',
          level: 'Beginner',
          calorieTarget: 1600,
          macros: {
            protein: 130,
            carbs: 160,
            fats: 45
          },
          meals: [
            'Breakfast: 2 scrambled eggs, 1 slice whole wheat toast, berries',
            'Mid-Morning: Greek yogurt with berries',
            'Lunch: 120g grilled chicken breast, 150g brown rice, broccoli',
            'Afternoon: Apple with almond butter (1 tbsp)',
            'Dinner: 120g salmon, sweet potato, asparagus',
            'Evening: Low-fat cottage cheese'
          ],
          mealCount: 6,
          notes: 'Moderate 500 calorie deficit. Lose 1 lb per week. Very sustainable.',
          supplements: ['Whey Protein', 'Green Tea Extract', 'Multivitamin', 'Omega-3'],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Intermediate Fat Loss - 1800-2000 Calories',
          description: 'Standard deficit for consistent fat loss while preserving muscle.',
          goal: 'Fat Loss',
          level: 'Intermediate',
          calorieTarget: 1900,
          macros: {
            protein: 160,
            carbs: 180,
            fats: 55
          },
          meals: [
            'Breakfast: Egg white omelet with vegetables, 1 slice toast',
            'Mid-Morning: Protein shake with unsweetened almond milk',
            'Lunch: 150g grilled chicken, quinoa, mixed vegetables',
            'Afternoon: Greek yogurt with berries',
            'Dinner: 150g salmon, sweet potato, asparagus with lemon',
            'Evening: Low-fat cottage cheese with cinnamon'
          ],
          mealCount: 6,
          notes: 'Moderate deficit. Lose 1-1.5 lbs per week. Combine with cardio 3-4x weekly.',
          supplements: ['Whey Protein', 'Green Tea Extract', 'Multivitamin', 'Omega-3', 'Glucomannan'],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Advanced Fat Loss - 1500 Calories',
          description: 'Aggressive deficit for rapid fat loss. For experienced dieters only.',
          goal: 'Fat Loss',
          level: 'Advanced',
          calorieTarget: 1500,
          macros: {
            protein: 150,
            carbs: 120,
            fats: 40
          },
          meals: [
            'Breakfast: Egg whites with vegetables, black coffee',
            'Mid-Morning: Zero-calorie energy drink, BCAA supplement',
            'Lunch: 150g lean protein, large salad, no oil',
            'Afternoon: 1 apple or berries',
            'Dinner: 150g lean protein, steamed vegetables, brown rice (small portion)',
            'Evening: Herbal tea'
          ],
          mealCount: 6,
          notes: 'Very aggressive. Not for everyone. Risk of muscle loss. Monitor strength.',
          supplements: ['Whey Protein (multi daily)', 'BCAAs', 'Multivitamin', 'Omega-3', 'Fiber'],
          createdAt: new Date(),
          updatedAt: new Date()
        },

        // MAINTENANCE DIETS
        {
          name: 'Balanced Maintenance - 2200 Calories',
          description: 'Perfectly balanced diet for maintaining current weight and physique.',
          goal: 'Maintenance',
          level: 'All Levels',
          calorieTarget: 2200,
          macros: {
            protein: 150,
            carbs: 250,
            fats: 70
          },
          meals: [
            'Breakfast: Oatmeal with banana, peanut butter, and berries',
            'Mid-Morning: Apple with cheese',
            'Lunch: 150g chicken breast, pasta, mixed vegetables',
            'Pre-Workout: Energy bar or banana',
            'Post-Workout: Protein shake with fruit',
            'Dinner: 150g fish, brown rice, broccoli'
          ],
          mealCount: 6,
          notes: 'Maintenance calories. Adjust based on activity level. Track weight weekly.',
          supplements: ['Multivitamin', 'Omega-3', 'Vitamin D'],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Active Lifestyle - 2500 Calories',
          description: 'For very active individuals training regularly plus cardio.',
          goal: 'Maintenance',
          level: 'Intermediate-Advanced',
          calorieTarget: 2500,
          macros: {
            protein: 160,
            carbs: 300,
            fats: 80
          },
          meals: [
            'Breakfast: Large bowl of oatmeal with fruits and nuts',
            'Mid-Morning: Protein shake with granola',
            'Lunch: 160g lean meat, 250g rice, vegetables',
            'Pre-Workout: Banana with peanut butter',
            'Post-Workout: Whey protein with fruit',
            'Dinner: 160g fish or chicken, pasta, veggies',
            'Optional: Snack as needed'
          ],
          mealCount: 6,
          notes: 'For gym + cardio enthusiasts. Fuel for daily activity. Stay hydrated.',
          supplements: ['Whey Protein', 'Multivitamin', 'Omega-3', 'Vitamin D', 'Electrolytes'],
          createdAt: new Date(),
          updatedAt: new Date()
        },

        // SPECIALIZED DIETS
        {
          name: 'Endurance Athlete - 3000+ Calories',
          description: 'High-carb diet optimized for endurance athletes and runners.',
          goal: 'Endurance',
          level: 'Intermediate-Advanced',
          calorieTarget: 3000,
          macros: {
            protein: 140,
            carbs: 450,
            fats: 75
          },
          meals: [
            'Breakfast: Large bowl of oatmeal with fruits and honey',
            'Mid-Morning: Banana with honey and almonds',
            'Lunch: 150g lean meat, large portion of rice, vegetables',
            'Pre-Workout: Dates, banana, sports drink',
            'During Long Session: Sports drink, gels, or energy bars',
            'Post-Workout: High-carb meal with protein',
            'Dinner: 150g chicken, pasta with tomato sauce'
          ],
          mealCount: 6,
          notes: 'Carb-loading for endurance. Time carbs around training. Stay hydrated.',
          supplements: ['Electrolytes', 'BCAAs', 'Multivitamin', 'Caffeine (optional)'],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Ketogenic Diet - 1900 Calories',
          description: 'Low-carb, high-fat ketogenic diet for fat loss and mental clarity.',
          goal: 'Fat Loss',
          level: 'Intermediate-Advanced',
          calorieTarget: 1900,
          macros: {
            protein: 140,
            carbs: 50,
            fats: 140
          },
          meals: [
            'Breakfast: 3 eggs fried in butter, bacon, cheese, black coffee',
            'Lunch: Salmon steak with butter and spinach',
            'Afternoon: Almonds and cheese, herbal tea',
            'Dinner: Steak with garlic aioli and mixed greens',
            'Evening: Herbal tea with heavy cream'
          ],
          mealCount: 5,
          notes: 'Keep carbs under 50g. Stay hydrated. Electrolytes recommended. Adaptation period 2-3 weeks.',
          supplements: ['Electrolytes', 'Omega-3', 'Multivitamin', 'MCT Oil (optional)'],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Vegan Muscle Building - 2700 Calories',
          description: 'Plant-based high-protein diet for muscle gain and ethics.',
          goal: 'Muscle Gain',
          level: 'Intermediate-Advanced',
          calorieTarget: 2700,
          macros: {
            protein: 180,
            carbs: 330,
            fats: 85
          },
          meals: [
            'Breakfast: Tofu scramble with vegetables, whole grain toast',
            'Mid-Morning: Protein smoothie with plant milk, chia seeds',
            'Lunch: Lentil curry with quinoa and vegetables',
            'Pre-Workout: Banana with almond butter',
            'Post-Workout: Vegan protein shake',
            'Dinner: Tempeh stir-fry with brown rice and vegetables'
          ],
          mealCount: 6,
          notes: 'Combine protein sources for complete amino acids. B12 supplement essential.',
          supplements: ['Vegan Protein Powder (multi daily)', 'B12', 'Vitamin D', 'Omega-3 (Algae)', 'Iron'],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Mediterranean Diet - 2300 Calories',
          description: 'Heart-healthy Mediterranean diet for overall wellness.',
          goal: 'Maintenance',
          level: 'All Levels',
          calorieTarget: 2300,
          macros: {
            protein: 130,
            carbs: 280,
            fats: 80
          },
          meals: [
            'Breakfast: Greek yogurt with honey, nuts, and berries',
            'Lunch: Whole grain bread with hummus, vegetables, olive oil',
            'Afternoon: Olives and feta cheese',
            'Dinner: Grilled fish with olive oil, vegetables, whole grain',
            'Evening: Red wine (optional), herbal tea'
          ],
          mealCount: 5,
          notes: 'Emphasis on whole grains, fish, olive oil, and vegetables. Excellent for heart health.',
          supplements: ['Omega-3 (Fish Oil)', 'Multivitamin', 'Vitamin D'],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Intermittent Fasting - Variable',
          description: 'Time-restricted eating protocol for flexibility and fat loss.',
          goal: 'Fat Loss',
          level: 'Intermediate-Advanced',
          calorieTarget: 1800,
          macros: {
            protein: 150,
            carbs: 160,
            fats: 55
          },
          meals: [
            'Fasting Window: 16 hours (only water, coffee, tea)',
            'First Meal: Large lunch - 200g protein, 250g carbs, 60g fats',
            'Dinner: 150g protein, 150g carbs, 30g fats',
            'No snacking between meals'
          ],
          mealCount: 2,
          notes: 'Popular: 16:8 protocol (fast 16 hours, eat in 8 hour window). Adjust to lifestyle.',
          supplements: ['Multivitamin (with food)', 'Electrolytes (optional)', 'Black Coffee/Tea (fasting safe)'],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Post-Workout Recovery - 2400 Calories',
          description: 'Nutrition plan optimized for post-workout recovery and muscle repair.',
          goal: 'Muscle Gain',
          level: 'Intermediate',
          calorieTarget: 2400,
          macros: {
            protein: 180,
            carbs: 300,
            fats: 70
          },
          meals: [
            'Pre-Workout (2 hrs before): Light carbs + protein',
            'Intra-Workout: BCAA drink or sports drink',
            'Immediately Post (0-30 min): Fast carbs + protein shake',
            'Post-Workout Meal (1-2 hrs): Solid food - meat + rice',
            'Rest of day: Normal meals with emphasis on recovery'
          ],
          mealCount: 6,
          notes: 'Carbs and protein within 30 mins of workout crucial. Focus on recovery.',
          supplements: ['Whey Protein', 'Creatine', 'Carbs/Dextrose', 'BCAAs', 'Multivitamin'],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      await dietCollection.insertMany(sampleDiets);
      console.log(`✅ Inserted ${sampleDiets.length} professional diet plans`);
    }
  } catch (err) {
    console.error('Error initializing sample data:', err);
  }
}

// ==================== TRAINING ROUTES ====================

// GET all training plans
app.get('/api/trainings', async (req, res) => {
  try {
    const { category, difficulty, intensity, sort } = req.query;
    
    let filter = {};
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (intensity) filter.intensity = intensity;
    
    let query = trainingCollection.find(filter);
    
    if (sort === 'duration') {
      query = query.sort({ duration: 1 });
    } else if (sort === 'calories') {
      query = query.sort({ caloriesBurned: -1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }
    
    const trainings = await query.toArray();
    res.json(trainings);
  } catch (err) {
    console.error('Error fetching trainings:', err);
    res.status(500).json({ error: 'Failed to fetch trainings' });
  }
});

// GET training by ID
app.get('/api/trainings/:id', async (req, res) => {
  try {
    const training = await trainingCollection.findOne({ 
      _id: new ObjectId(req.params.id) 
    });
    if (!training) {
      return res.status(404).json({ error: 'Training not found' });
    }
    res.json(training);
  } catch (err) {
    console.error('Error fetching training:', err);
    res.status(500).json({ error: 'Failed to fetch training' });
  }
});

// CREATE new training plan
app.post('/api/trainings', async (req, res) => {
  try {
    const { name, description, duration, intensity, difficulty, category, exercises, targetMuscles, caloriesBurned, frequency, notes } = req.body;
    
    if (!name || !duration || !intensity) {
      return res.status(400).json({ error: 'Missing required fields: name, duration, intensity' });
    }
    
    const newTraining = {
      name,
      description: description || '',
      duration,
      intensity,
      difficulty: difficulty || 'Beginner',
      category: category || 'Full Body',
      exercises: exercises || [],
      targetMuscles: targetMuscles || [],
      caloriesBurned: caloriesBurned || 150,
      frequency: frequency || '1x per week',
      notes: notes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await trainingCollection.insertOne(newTraining);
    res.status(201).json({ 
      message: 'Training created successfully',
      id: result.insertedId,
      training: newTraining
    });
  } catch (err) {
    console.error('Error creating training:', err);
    res.status(500).json({ error: 'Failed to create training' });
  }
});

// UPDATE training plan
app.put('/api/trainings/:id', async (req, res) => {
  try {
    const { name, duration, intensity, exercises, targetMuscles, notes } = req.body;
    
    const updatedTraining = {
      ...(name && { name }),
      ...(duration && { duration }),
      ...(intensity && { intensity }),
      ...(exercises && { exercises }),
      ...(targetMuscles && { targetMuscles }),
      ...(notes && { notes }),
      updatedAt: new Date()
    };
    
    const result = await trainingCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updatedTraining }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Training not found' });
    }
    
    res.json({ message: 'Training updated successfully', training: updatedTraining });
  } catch (err) {
    console.error('Error updating training:', err);
    res.status(500).json({ error: 'Failed to update training' });
  }
});

// DELETE training plan
app.delete('/api/trainings/:id', async (req, res) => {
  try {
    const result = await trainingCollection.deleteOne({ 
      _id: new ObjectId(req.params.id) 
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Training not found' });
    }
    
    res.json({ message: 'Training deleted successfully' });
  } catch (err) {
    console.error('Error deleting training:', err);
    res.status(500).json({ error: 'Failed to delete training' });
  }
});

// ==================== DIET ROUTES ====================

// GET all diet plans
app.get('/api/diets', async (req, res) => {
  try {
    const { goal, sort } = req.query;
    
    let filter = {};
    if (goal) filter.goal = goal;
    
    let query = dietCollection.find(filter);
    
    if (sort === 'calories') {
      query = query.sort({ calorieTarget: 1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }
    
    const diets = await query.toArray();
    res.json(diets);
  } catch (err) {
    console.error('Error fetching diets:', err);
    res.status(500).json({ error: 'Failed to fetch diets' });
  }
});

// GET diet by ID
app.get('/api/diets/:id', async (req, res) => {
  try {
    const diet = await dietCollection.findOne({ 
      _id: new ObjectId(req.params.id) 
    });
    if (!diet) {
      return res.status(404).json({ error: 'Diet plan not found' });
    }
    res.json(diet);
  } catch (err) {
    console.error('Error fetching diet:', err);
    res.status(500).json({ error: 'Failed to fetch diet' });
  }
});

// CREATE new diet plan
app.post('/api/diets', async (req, res) => {
  try {
    const { name, description, goal, calorieTarget, macros, meals, mealCount, supplements, notes } = req.body;
    
    if (!name || !calorieTarget || !goal) {
      return res.status(400).json({ error: 'Missing required fields: name, calorieTarget, goal' });
    }
    
    const newDiet = {
      name,
      description: description || '',
      goal,
      calorieTarget,
      macros: macros || { protein: 0, carbs: 0, fats: 0 },
      meals: meals || [],
      mealCount: mealCount || meals?.length || 0,
      supplements: supplements || [],
      notes: notes || '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await dietCollection.insertOne(newDiet);
    res.status(201).json({ 
      message: 'Diet plan created successfully',
      id: result.insertedId,
      diet: newDiet
    });
  } catch (err) {
    console.error('Error creating diet:', err);
    res.status(500).json({ error: 'Failed to create diet plan' });
  }
});

// UPDATE diet plan
app.put('/api/diets/:id', async (req, res) => {
  try {
    const { name, calorieTarget, macros, meals, notes } = req.body;
    
    const updatedDiet = {
      ...(name && { name }),
      ...(calorieTarget && { calorieTarget }),
      ...(macros && { macros }),
      ...(meals && { meals }),
      ...(notes && { notes }),
      updatedAt: new Date()
    };
    
    const result = await dietCollection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updatedDiet }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Diet plan not found' });
    }
    
    res.json({ message: 'Diet plan updated successfully', diet: updatedDiet });
  } catch (err) {
    console.error('Error updating diet:', err);
    res.status(500).json({ error: 'Failed to update diet plan' });
  }
});

// DELETE diet plan
app.delete('/api/diets/:id', async (req, res) => {
  try {
    const result = await dietCollection.deleteOne({ 
      _id: new ObjectId(req.params.id) 
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Diet plan not found' });
    }
    
    res.json({ message: 'Diet plan deleted successfully' });
  } catch (err) {
    console.error('Error deleting diet:', err);
    res.status(500).json({ error: 'Failed to delete diet plan' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Start server with port fallback logic
async function start() {
  await connectDB();

  // Try configured PORT first, then try a few incrementing ports, otherwise let OS pick a free port (0)
  const configuredPort = parseInt(process.env.PORT, 10) || 0;
  const maxAttempts = 10;
  let lastError = null;

  for (let i = 0; i <= maxAttempts; i++) {
    const tryPort = configuredPort && configuredPort > 0 ? configuredPort + i : 0;
    try {
      await new Promise((resolve, reject) => {
        const server = app.listen(tryPort, () => {
          const address = server.address();
          const boundPort = address && address.port ? address.port : tryPort;
          console.log(`Server running on http://localhost:${boundPort}`);
          console.log(`API endpoints available at http://localhost:${boundPort}/api`);
          resolve();
        });

        server.on('error', (err) => {
          reject(err);
        });
      });

      // successfully started
      return;
    } catch (err) {
      lastError = err;
      if (err && err.code === 'EADDRINUSE') {
        console.warn(`Port ${configuredPort + i} in use, trying next port...`);
        continue;
      }
      // non-address error -> rethrow
      console.error('Unexpected error when trying to bind server:', err);
      throw err;
    }
  }

  console.error('Failed to bind server to any port:', lastError);
  process.exit(1);
}

// handle unhandled promise rejections and uncaught exceptions gracefully
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // allow process to exit after logging so an orchestrator can restart if desired
  process.exit(1);
});

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
