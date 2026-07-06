# models/content_provider.py
from datetime import datetime

WEEKLY_SUGGESTION_PLAN = {
    "Monday":    {"men": "chest", "women": "legs"},
    "Tuesday":   {"men": "back", "women": "upper_body"},
    "Wednesday": {"men": "legs", "women": "glutes"},
    "Thursday":  {"men": "arms", "women": "full_body"},
    "Friday":    {"men": "shoulders", "women": "active_recovery"},
    "Saturday":  {"men": "full_body", "women": "legs"},
    "Sunday":    {"men": "rest", "women": "rest"},
}

WORKOUT_LIBRARY = {
    "men": {
        "chest": [
            {"name": "Bench Press", "sets": "4", "reps": "8-12", "image_url": "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b"},
            {"name": "Incline DB Press", "sets": "3", "reps": "10-15", "image_url": "https://images.unsplash.com/photo-1534438327276-14e5300c3a48"},
            {"name": "Dips", "sets": "3", "reps": "To Failure", "image_url": "https://images.unsplash.com/photo-1594737625723-a512104b3a4e"}
        ],
        "back": [
            {"name": "Pull-Ups", "sets": "4", "reps": "To Failure", "image_url": "https://images.unsplash.com/photo-1594914486984-5a2a22f3e8b1"},
            {"name": "Barbell Rows", "sets": "4", "reps": "8-12", "image_url": "https://images.unsplash.com/photo-1581009137042-c55216867c32"},
            {"name": "Lat Pulldowns", "sets": "3", "reps": "10-15", "image_url": "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5"}
        ],
        "legs": [
            {"name": "Barbell Squats", "sets": "4", "reps": "8-12", "image_url": "https://images.unsplash.com/photo-1541600384332-23c2a6320074"},
            {"name": "Leg Press", "sets": "3", "reps": "10-15", "image_url": "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b"},
            {"name": "Romanian Deadlifts", "sets": "3", "reps": "10-15", "image_url": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438"}
        ],
        "arms": [
            {"name": "Bicep Curls", "sets": "3", "reps": "10-15", "image_url": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e"},
            {"name": "Tricep Pushdowns", "sets": "3", "reps": "10-15", "image_url": "https://images.unsplash.com/photo-1596357395217-e3c3aa48a4c2"},
        ],
        "shoulders": [
            {"name": "Overhead Press", "sets": "4", "reps": "8-12", "image_url": "https://images.unsplash.com/photo-1590556409324-aa1d726e5c3c"},
            {"name": "Lateral Raises", "sets": "3", "reps": "15-20", "image_url": "https://images.unsplash.com/photo-1532029837206-abbe2b7620e3"},
        ],
        "full_body": [
            {"name": "Deadlifts", "sets": "5", "reps": "5", "image_url": "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2"},
            {"name": "Kettlebell Swings", "sets": "4", "reps": "20", "image_url": "https://images.unsplash.com/photo-1574680122432-c5a4b4553c60"},
        ],
        "rest": [
            {"name": "Rest Day", "sets": "N/A", "reps": "Focus on sleep and hydration", "image_url": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b"}
        ],
    },
    "women": {
        "legs": [
            {"name": "Goblet Squats", "sets": "4", "reps": "12-15", "image_url": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438"},
            {"name": "Lunges", "sets": "3", "reps": "12 per leg", "image_url": "https://images.unsplash.com/photo-1598421838234-e864a7c10b65"}
        ],
        "upper_body": [
            {"name": "Dumbbell Rows", "sets": "3", "reps": "12-15", "image_url": "https://images.unsplash.com/photo-1574680178782-211a2c4ac349"},
            {"name": "Dumbbell Shoulder Press", "sets": "3", "reps": "12-15", "image_url": "https://images.unsplash.com/photo-1532029837206-abbe2b7620e3"},
        ],
        "glutes": [
            {"name": "Hip Thrusts", "sets": "4", "reps": "15-20", "image_url": "https://images.unsplash.com/photo-1599058917212-d750089bc074"},
            {"name": "Romanian Deadlifts", "sets": "3", "reps": "12-15", "image_url": "https://images.unsplash.com/photo-1517836357463-d25dfeac3438"}
        ],
        "full_body": [
             {"name": "Kettlebell Swings", "sets": "4", "reps": "20", "image_url": "https://images.unsplash.com/photo-1574680122432-c5a4b4553c60"},
             {"name": "Battle Ropes", "sets": "5", "reps": "30 seconds", "image_url": "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e"},
        ],
        "active_recovery": [
            {"name": "Yoga Flow", "sets": "N/A", "reps": "30-45 minutes", "image_url": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b"},
            {"name": "Light Walk", "sets": "N/A", "reps": "30 minutes", "image_url": "https://images.unsplash.com/photo-1502224523330-3b2d51d54b4d"}
        ],
        "rest": [
            {"name": "Rest Day", "sets": "N/A", "reps": "Focus on sleep and hydration", "image_url": "https://images.unsplash.com/photo-1607953940195-27c1f54a8b7c"}
        ],
    }
}

DIET_LIBRARY = {
    "weight_loss": {
        "title": "Weight Loss",
        "description": "Focused on a sustainable caloric deficit with nutrient-dense foods.",
        "non_veg": [
            {"name": "Grilled Chicken Salad", "type": "Lunch", "image_url": "https://images.unsplash.com/photo-1551248429-4578501149e3"},
            {"name": "Baked Salmon", "type": "Dinner", "image_url": "https://images.unsplash.com/photo-1606191533830-a91a4b4f882f"},
        ],
        "veg": [
            {"name": "Quinoa & Black Bean Bowl", "type": "Lunch", "image_url": "https://images.unsplash.com/photo-1512058564366-18510be2db19"},
            {"name": "Lentil Soup", "type": "Dinner", "image_url": "https://images.unsplash.com/photo-1604323131101-7393a5414f49"},
        ]
    },
    "muscle_gain": {
        "title": "Muscle Gain",
        "description": "Focused on a caloric surplus with high protein to fuel muscle growth.",
        "non_veg": [
            {"name": "Steak and Sweet Potato", "type": "Dinner", "image_url": "https://images.unsplash.com/photo-1560717845-968d6d2e6a2b"},
            {"name": "Scrambled Eggs with Avocado", "type": "Breakfast", "image_url": "https://images.unsplash.com/photo-1482049016688-2d3e1b311543"},
        ],
        "veg": [
            {"name": "Tofu Scramble", "type": "Breakfast", "image_url": "https://images.unsplash.com/photo-1595854341625-f33ee10dbf94"},
            {"name": "Chickpea Curry with Rice", "type": "Dinner", "image_url": "https://images.unsplash.com/photo-1565557623262-b51c2513a641"},
        ]
    }
}

def get_all_workouts():
    return WORKOUT_LIBRARY

def get_all_diets():
    return DIET_LIBRARY

def get_daily_suggestion():
    today = datetime.now().strftime('%A')
    return WEEKLY_SUGGESTION_PLAN.get(today, {"men": "rest", "women": "rest"})