import os
import re
import random
import requests
import psycopg2
from psycopg2.extras import execute_values
from datetime import datetime, timedelta
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.environ.get("DATABASE_URL")

if not DATABASE_URL:
    print("❌ ERROR: Missing DATABASE_URL in .env")
    exit(1)

# Raw user data payload
raw_courses = [
    # --- FREE COURSES ---
    {"title": "CS50's Introduction to Computer Science", "platform": "Coursera", "department": "Computer Science Engineering", "type": "Free", "url": "https://www.coursera.org/learn/cs50", "instructor": "Harvard"},
    {"title": "Python for Everybody", "platform": "Coursera", "department": "Computer Science Engineering", "type": "Free", "url": "https://www.coursera.org/specializations/python", "instructor": "University of Michigan"},
    {"title": "Introduction to Web Development", "platform": "Coursera", "department": "Web Development", "type": "Free", "url": "https://www.coursera.org/learn/web-development", "instructor": "UC Davis"},
    {"title": "Data Structures and Algorithms", "platform": "Coursera", "department": "Computer Science Engineering", "type": "Free", "url": "https://www.coursera.org/specializations/data-structures-algorithms", "instructor": "UC San Diego"},
    {"title": "Machine Learning Foundations", "platform": "Coursera", "department": "Machine Learning", "type": "Free", "url": "https://www.coursera.org/learn/machine-learning", "instructor": "Andrew Ng"},
    {"title": "Full Stack Web Development Bootcamp", "platform": "Udemy", "department": "Web Development", "type": "Free", "url": "https://www.udemy.com/course/the-web-developer-bootcamp/", "instructor": "Colt Steele"},
    {"title": "SQL for Beginners", "platform": "Coursera", "department": "Database Management", "type": "Free", "url": "https://www.coursera.org/learn/sql-for-data-science", "instructor": "UC Davis"},
    {"title": "Introduction to Sustainable Architecture", "platform": "Coursera", "department": "Sustainable Architecture", "type": "Free", "url": "https://www.coursera.org/learn/sustainable-architecture", "instructor": "University of Michigan"},
    {"title": "AutoCAD for Beginners", "platform": "LinkedIn Learning", "department": "Architectural Design", "type": "Free", "url": "https://www.linkedin.com/learning/autocad-essential-training", "instructor": "LinkedIn Learning"},
    {"title": "Soil and Water Resources Engineering", "platform": "Coursera", "department": "Agricultural Technology", "type": "Free", "url": "https://www.coursera.org/learn/soil-water", "instructor": "Purdue"},
    {"title": "Drug Discovery and Development", "platform": "Coursera", "department": "Drug Development", "type": "Free", "url": "https://www.coursera.org/learn/drug-discovery", "instructor": "UC San Diego"},
    {"title": "Google Data Analytics Certificate", "platform": "Coursera", "department": "Data Science Engineering", "type": "Free", "url": "https://www.coursera.org/professional-certificates/google-data-analytics", "instructor": "Google"},
    {"title": "AWS Cloud Practitioner Essentials", "platform": "Coursera", "department": "AWS", "type": "Free", "url": "https://www.coursera.org/learn/aws-cloud-practitioner-essentials", "instructor": "AWS"},
    {"title": "Google Cybersecurity Certificate", "platform": "Coursera", "department": "Network Security", "type": "Free", "url": "https://www.professional-certificates/google-cybersecurity", "instructor": "Google"},
    
    # --- PAID COURSES ---
    {"title": "The Complete 2024 Web Developer Bootcamp", "platform": "Udemy", "department": "Web Development", "type": "Paid", "price": 499, "url": "https://www.udemy.com/course/the-web-developer-bootcamp/", "instructor": "Colt Steele"},
    {"title": "React - The Complete Guide", "platform": "Udemy", "department": "Web Development", "type": "Paid", "price": 599, "url": "https://www.udemy.com/course/react-the-complete-guide-incl-redux/", "instructor": "Maximilian Schwarzmüller"},
    {"title": "AWS Certified Solutions Architect", "platform": "Udemy", "department": "AWS", "type": "Paid", "price": 649, "url": "https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/", "instructor": "Stephane Maarek"},
    {"title": "The Data Science Course 2024", "platform": "Udemy", "department": "Data Science Engineering", "type": "Paid", "price": 699, "url": "https://www.udemy.com/course/the-data-science-course-complete-data-science-bootcamp/", "instructor": "365 Careers"}
]

def fetch_image_for_course(course, c_id):
    keyword = "education"
    unsplash_url = f"https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800&sig={c_id}"
    return unsplash_url

def process_and_upload():
    print(f"Preparing to map and upload {len(raw_courses)} structured courses...")
    processed_courses = []
    levels = ["Beginner", "Intermediate", "Advanced", "All Levels"]

    for i, c in enumerate(raw_courses):
        is_free = c['type'] == 'Free'
        price = 0 if is_free else c.get('price', 0)
        original_price = 0 if is_free else round(price * random.uniform(2.1, 4.5), 0)
        discount = 0 if is_free else int(((original_price - price) / original_price) * 100) if original_price > 0 else 0
        
        thumbnail = fetch_image_for_course(c, i + 800)
        
        processed_courses.append({
            "title": c['title'],
            "instructor_name": c['instructor'],
            "platform": c['platform'],
            "department": c['department'],
            "course_type": c['type'],
            "price": price,
            "original_price": original_price if original_price > 0 else None,
            "discount_percentage": discount,
            "rating": round(random.uniform(4.2, 4.9), 1),
            "total_ratings": random.randint(150, 42000),
            "duration_hours": round(random.uniform(2.5, 45.0), 1),
            "level": random.choice(levels),
            "language": "English",
            "thumbnail_url": thumbnail,
            "course_url": c['url'],
            "tags": [c['department'].lower()],
            "is_bestseller": random.choice([True, False, False]),
            "is_new": random.choice([True, False, False, False]),
            "certificate_offered": True
        })
        
    print(f"Scrubbing existing database entries...")
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        
        cur.execute("DELETE FROM courses")
        print(f"Overwriting Neon Database...")
        
        if processed_courses:
            columns = processed_courses[0].keys()
            query = f"INSERT INTO courses ({', '.join(columns)}) VALUES %s"
            values = [[c[col] for col in columns] for c in processed_courses]
            execute_values(cur, query, values)
            
        conn.commit()
        cur.close()
        conn.close()
        print("Seeding entirely complete!")
    except Exception as e:
        print(f"Failed: {e}")

if __name__ == "__main__":
    process_and_upload()
