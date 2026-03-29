import os
import random
import requests
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ ERROR: Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env")
    exit(1)

departments = [
    "Computer Science Engineering", "Information Technology", "Electronics & Communication Engineering",
    "Electrical Engineering", "Mechanical Engineering", "Civil Engineering", 
    "Artificial Intelligence & Machine Learning", "Data Science Engineering",
    "Web Development", "Mobile App Development", "Database Management", "Networking & Security",
    "Architectural Design", "Urban Planning", "Interior Design", "Sustainable Architecture",
    "Precision Agriculture", "Soil Science", "Crop Management", "Agricultural Technology",
    "Pharmaceutical Chemistry", "Pharmacology", "Drug Development", "Clinical Research",
    "Python for Data Science", "Machine Learning", "Data Visualization (Tableau, Power BI)", "SQL & Big Data",
    "AWS (Solutions Architect, Developer, SysOps)", "Microsoft Azure (Fundamentals, Administrator)", 
    "Google Cloud Platform", "DevOps & CI/CD",
    "Ethical Hacking", "Network Security", "CEH / CompTIA Security+", "Penetration Testing"
]

platforms = ["Udemy", "Coursera", "LinkedIn Learning"]
levels = ["Beginner", "Intermediate", "Advanced", "All Levels"]

adjectives = ["Advanced", "Complete", "Masterclass:", "Fundamentals of", "Introduction to", "Ultimate", "Practical"]

def generate_course(i):
    dept = random.choice(departments)
    title = f"{random.choice(adjectives)} {dept}"
    
    is_free = random.choice([True, False, False]) # Bias towards Paid for data richness
    course_type = "Free" if is_free else "Paid"
    
    price = 0 if is_free else round(random.uniform(12.99, 149.99), 2)
    original_price = 0 if is_free else round(price * random.uniform(1.2, 3.5), 2)
    discount_percentage = 0 if is_free else int(((original_price - price) / original_price) * 100)
    
    # Random date within the last year
    last_updated = (datetime.now() - timedelta(days=random.randint(0, 365))).date().isoformat()
    
    return {
        "title": title,
        "instructor_name": f"Expert Instructor {random.randint(1,100)}",
        "platform": random.choice(platforms),
        "department": dept,
        "course_type": course_type,
        "price": price,
        "original_price": original_price if original_price > 0 else None,
        "discount_percentage": discount_percentage,
        "rating": round(random.uniform(3.5, 5.0), 1),
        "total_ratings": random.randint(10, 85000),
        "duration_hours": round(random.uniform(1.5, 80.0), 1),
        "level": random.choice(levels),
        "language": "English",
        "thumbnail_url": f"https://picsum.photos/seed/{i}/400/250",
        "course_url": "#",
        "last_updated": last_updated,
        "tags": ["certification", "2024", "professional"],
        "is_bestseller": random.choice([True, False, False, False]),
        "is_new": random.choice([True, False, False]),
        "certificate_offered": random.choice([True, True, False])
    }

def run_seed():
    print("🌱 Generating 75 highly-structured sample courses...")
    courses = [generate_course(i) for i in range(1, 76)]
    
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }
    
    print(f"🚀 Inserting into Supabase: {SUPABASE_URL}")
    res = requests.post(f"{SUPABASE_URL}/rest/v1/courses", headers=headers, json=courses)
    if res.ok:
        print("✅ Seeding complete!")
    else:
        print(f"❌ Failed: {res.text}")

if __name__ == "__main__":
    run_seed()
