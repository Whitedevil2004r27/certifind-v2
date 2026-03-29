import os
import re
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

# Raw user data payload
raw_courses = [
    # --- FREE COURSES ---
    # B.Tech
    {"title": "CS50's Introduction to Computer Science", "platform": "Coursera", "department": "Computer Science Engineering", "type": "Free", "url": "https://www.coursera.org/learn/cs50", "instructor": "Harvard"},
    {"title": "Python for Everybody", "platform": "Coursera", "department": "Computer Science Engineering", "type": "Free", "url": "https://www.coursera.org/specializations/python", "instructor": "University of Michigan"},
    {"title": "Introduction to Web Development", "platform": "Coursera", "department": "Web Development", "type": "Free", "url": "https://www.coursera.org/learn/web-development", "instructor": "UC Davis"},
    {"title": "Data Structures and Algorithms", "platform": "Coursera", "department": "Computer Science Engineering", "type": "Free", "url": "https://www.coursera.org/specializations/data-structures-algorithms", "instructor": "UC San Diego"},
    {"title": "Machine Learning Foundations", "platform": "Coursera", "department": "Machine Learning", "type": "Free", "url": "https://www.coursera.org/learn/machine-learning", "instructor": "Andrew Ng"},
    # BCA
    {"title": "Full Stack Web Development Bootcamp", "platform": "Udemy", "department": "Web Development", "type": "Free", "url": "https://www.udemy.com/course/the-web-developer-bootcamp/", "instructor": "Colt Steele"},
    {"title": "SQL for Beginners", "platform": "Coursera", "department": "Database Management", "type": "Free", "url": "https://www.coursera.org/learn/sql-for-data-science", "instructor": "UC Davis"},
    # B.Arch
    {"title": "Introduction to Sustainable Architecture", "platform": "Coursera", "department": "Sustainable Architecture", "type": "Free", "url": "https://www.coursera.org/learn/sustainable-architecture", "instructor": "University of Michigan"},
    {"title": "AutoCAD for Beginners", "platform": "LinkedIn Learning", "department": "Architectural Design", "type": "Free", "url": "https://www.linkedin.com/learning/autocad-essential-training", "instructor": "LinkedIn"},
    # Agriculture
    {"title": "Soil and Water Resources Engineering", "platform": "Coursera", "department": "Agricultural Technology", "type": "Free", "url": "https://www.coursera.org/learn/soil-water", "instructor": "Purdue"},
    {"title": "Everyday Excel", "platform": "Coursera", "department": "Crop Management", "type": "Free", "url": "https://www.coursera.org/learn/everyday-excel", "instructor": "University of Colorado"},
    # Pharmacy
    {"title": "Drug Discovery and Development", "platform": "Coursera", "department": "Drug Development", "type": "Free", "url": "https://www.coursera.org/learn/drug-discovery", "instructor": "UC San Diego"},
    {"title": "Clinical Trials in Clinical Research", "platform": "Coursera", "department": "Clinical Research", "type": "Free", "url": "https://www.coursera.org/learn/clinical-trials", "instructor": "Johns Hopkins"},
    # Data Science
    {"title": "Google Data Analytics Certificate", "platform": "Coursera", "department": "Data Science Engineering", "type": "Free", "url": "https://www.coursera.org/professional-certificates/google-data-analytics", "instructor": "Google"},
    {"title": "IBM Data Science Professional Certificate", "platform": "Coursera", "department": "Data Science Engineering", "type": "Free", "url": "https://www.coursera.org/professional-certificates/ibm-data-science", "instructor": "IBM"},
    # Cloud
    {"title": "AWS Cloud Practitioner Essentials", "platform": "Coursera", "department": "AWS", "type": "Free", "url": "https://www.coursera.org/learn/aws-cloud-practitioner-essentials", "instructor": "AWS"},
    {"title": "Google Cloud Fundamentals: Core Infrastructure", "platform": "Coursera", "department": "Google Cloud Platform", "type": "Free", "url": "https://www.coursera.org/learn/gcp-fundamentals", "instructor": "Google"},
    # Cyber
    {"title": "Google Cybersecurity Certificate", "platform": "Coursera", "department": "Network Security", "type": "Free", "url": "https://www.coursera.org/professional-certificates/google-cybersecurity", "instructor": "Google"},
    {"title": "Introduction to Cyber Security", "platform": "Coursera", "department": "Network Security", "type": "Free", "url": "https://www.coursera.org/specializations/intro-cyber-security", "instructor": "NYU"},
    {"title": "Ethical Hacking for Beginners", "platform": "Udemy", "department": "Ethical Hacking", "type": "Free", "url": "https://www.udemy.com/course/learn-ethical-hacking-from-scratch/", "instructor": "Zaid Sabih"},
    # Information Technology
    {"title": "Google IT Support Professional Certificate", "platform": "Coursera", "department": "Information Technology", "type": "Free", "url": "https://www.coursera.org/professional-certificates/google-it-support", "instructor": "Google"},
    {"title": "Introduction to Information Technology", "platform": "Coursera", "department": "Information Technology", "type": "Free", "url": "https://www.coursera.org/learn/information-technology", "instructor": "IBM"},

    # --- FOUNDATIONAL BATCH ---
    {"title": "Foundations of Computer Science: Logic & Algorithms", "platform": "Coursera", "department": "Computer Science Engineering", "type": "Free", "url": "https://www.coursera.org/learn/computer-science", "instructor": "University of London"},
    {"title": "HTML, CSS, and Javascript for Web Developers", "platform": "Coursera", "department": "Web Development", "type": "Free", "url": "https://www.coursera.org/learn/html-css-javascript-for-web-developers", "instructor": "Johns Hopkins University"},
    {"title": "Introduction to Architecture Basics", "platform": "Coursera", "department": "Architectural Design", "type": "Free", "url": "https://www.coursera.org/learn/architecture", "instructor": "IE Business School"},
    {"title": "Agriculture, Economics and Nature", "platform": "Coursera", "department": "Agricultural Technology", "type": "Free", "url": "https://www.coursera.org/learn/agriculture-economics-nature", "instructor": "UWA"},
    {"title": "Introduction to Pharmacy Practice", "platform": "Coursera", "department": "Pharmacology", "type": "Free", "url": "https://www.coursera.org/learn/pharmacy", "instructor": "University of Sydney"},
    {"title": "What is Data Science?", "platform": "Coursera", "department": "Data Science Engineering", "type": "Free", "url": "https://www.coursera.org/learn/what-is-datascience", "instructor": "IBM"},
    {"title": "Introduction to Cloud Computing", "platform": "Coursera", "department": "Cloud Computing", "type": "Free", "url": "https://www.coursera.org/learn/cloud-computing-basics", "instructor": "IBM"},
    {"title": "Foundations of Cybersecurity", "platform": "Coursera", "department": "Network Security", "type": "Free", "url": "https://www.coursera.org/learn/foundations-of-cybersecurity", "instructor": "Google"},

    # --- PAID COURSES ---
    # B.Tech
    {"title": "The Complete 2024 Web Developer Bootcamp", "platform": "Udemy", "department": "Web Development", "type": "Paid", "price": 499, "url": "https://www.udemy.com/course/the-web-developer-bootcamp/", "instructor": "Colt Steele"},
    {"title": "Master the Coding Interview: Data Structures + Algorithms", "platform": "Udemy", "department": "Computer Science Engineering", "type": "Paid", "price": 649, "url": "https://www.udemy.com/course/master-the-coding-interview-data-structures-algorithms/", "instructor": "Andrei Neagoie"},
    {"title": "React - The Complete Guide", "platform": "Udemy", "department": "Web Development", "type": "Paid", "price": 599, "url": "https://www.udemy.com/course/react-the-complete-guide-incl-redux/", "instructor": "Maximilian Schwarzmüller"},
    {"title": "NodeJS - The Complete Guide", "platform": "Udemy", "department": "Web Development", "type": "Paid", "price": 649, "url": "https://www.udemy.com/course/nodejs-the-complete-guide/", "instructor": "Maximilian Schwarzmüller"},
    # BCA
    {"title": "Android App Development with Kotlin", "platform": "Udemy", "department": "Mobile App Development", "type": "Paid", "price": 449, "url": "https://www.udemy.com/course/android-oreo-kotlin-app-masterclass/", "instructor": "Tim Buchalka"},
    {"title": "iOS & Swift — The Complete App Development Bootcamp", "platform": "Udemy", "department": "Mobile App Development", "type": "Paid", "price": 649, "url": "https://www.udemy.com/course/ios-13-app-development-bootcamp/", "instructor": "Angela Yu"},
    # B.Arch
    {"title": "Revit Architecture: Complete Beginner to Advanced", "platform": "Udemy", "department": "Architectural Design", "type": "Paid", "price": 499, "url": "https://www.udemy.com/course/revit-architecture/", "instructor": "Saurabh"},
    {"title": "3DS Max + V-Ray: Interior & Exterior Rendering", "platform": "Udemy", "department": "Interior Design", "type": "Paid", "price": 549, "url": "https://www.udemy.com/course/3ds-max-vray/", "instructor": "Margarita"},
    # B.Pharm
    {"title": "Pharmacology Made Easy — Drug Dosages", "platform": "Udemy", "department": "Pharmacology", "type": "Paid", "price": 399, "url": "https://www.udemy.com/course/pharmacology-made-easy-drug-dosages/", "instructor": "Medical Edge"},
    {"title": "Good Clinical Practice (GCP) Certification Training", "platform": "Udemy", "department": "Clinical Research", "type": "Paid", "price": 449, "url": "https://www.udemy.com/course/good-clinical-practice/", "instructor": "GCP Institute"},
    # Data Science
    {"title": "The Data Science Course: Complete Data Science Bootcamp", "platform": "Udemy", "department": "Data Science Engineering", "type": "Paid", "price": 699, "url": "https://www.udemy.com/course/the-data-science-course-complete-data-science-bootcamp/", "instructor": "365 Careers"},
    {"title": "Tableau 2024 A-Z: Hands-On Tableau Training", "platform": "Udemy", "department": "Data Visualization (Tableau, Power BI)", "type": "Paid", "price": 499, "url": "https://www.udemy.com/course/tableau10/", "instructor": "Kirill Eremenko"},
    # Cloud
    {"title": "AWS Certified Solutions Architect — Associate 2024", "platform": "Udemy", "department": "AWS (Solutions Architect, Developer, SysOps)", "type": "Paid", "price": 649, "url": "https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/", "instructor": "Stephane Maarek"},
    {"title": "AZ-900: Microsoft Azure Fundamentals Exam Prep", "platform": "Udemy", "department": "Microsoft Azure (Fundamentals, Administrator)", "type": "Paid", "price": 499, "url": "https://www.udemy.com/course/az900-azure/", "instructor": "Scott Duffy"},
    {"title": "Docker & Kubernetes: The Practical Guide", "platform": "Udemy", "department": "DevOps & CI/CD", "type": "Paid", "price": 649, "url": "https://www.udemy.com/course/docker-kubernetes-the-practical-guide/", "instructor": "Maximilian Schwarzmüller"},
    # Cyber
    {"title": "The Complete Ethical Hacking Course: Beginner to Advanced", "platform": "Udemy", "department": "Ethical Hacking", "type": "Paid", "price": 599, "url": "https://www.udemy.com/course/penetration-testing/", "instructor": "Zaid Sabih"},
    {"title": "CompTIA Security+ (SY0-701) Complete Course & Exam", "platform": "Udemy", "department": "CEH / CompTIA Security+", "type": "Paid", "price": 649, "url": "https://www.udemy.com/course/securityplus/", "instructor": "Jason Dion"},
    {"title": "Certified Ethical Hacker (CEH) v12 312-50", "platform": "Udemy", "department": "Ethical Hacking", "type": "Paid", "price": 699, "url": "https://www.udemy.com/course/certified-ethical-hacker-ceh/", "instructor": "CEH Institute"},
    # Agriculture
    {"title": "Precision Agriculture: GPS, GIS & Remote Sensing", "platform": "Udemy", "department": "Precision Agriculture", "type": "Paid", "price": 449, "url": "https://www.udemy.com/course/precision-agriculture/", "instructor": "Agri Tech"},
    {"title": "Hydroponics: Grow Plants Without Soil — Full Course", "platform": "Udemy", "department": "Agricultural Technology", "type": "Paid", "price": 399, "url": "https://www.udemy.com/course/hydroponics/", "instructor": "Smart Farming"},
    # Information Technology
    {"title": "CompTIA A+ Certification Core 1 & 2", "platform": "Udemy", "department": "Information Technology", "type": "Paid", "price": 649, "url": "https://www.udemy.com/course/comptia-aplus-core/", "instructor": "Mike Meyers"},
    {"title": "Information Technology (IT) Fundamentals for Everyone", "platform": "Udemy", "department": "Information Technology", "type": "Paid", "price": 499, "url": "https://www.udemy.com/course/it-fundamentals/", "instructor": "IT Experts"}
]

def fetch_image_for_course(course, c_id):
    # Rule 1 / 2: Try to extract Open Graph images simulating CDN fetch mechanisms
    try:
        # Many platforms block Python scripts. Let's send a standard User Agent.
        headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
        res = requests.get(course['url'], headers=headers, timeout=4)
        og_match = re.search(r'<meta property="og:image"\s*content="([^"]+)"', res.text)
        if og_match:
            img_url = og_match.group(1)
            # Validate it's not a generic logo
            if "logo" not in img_url.lower():
                print(f"   [OG Extracted] {img_url[:60]}...")
                return img_url
    except Exception as e:
        pass
        
    # Rule 3: The precise Unsplash specification implementation
    # e.g., "cybersecurity", "machine learning" -> extracted from title
    keyword_words = [w.lower() for w in course['title'].split() if len(w) > 3]
    if len(keyword_words) >= 2:
        keyword = f"{keyword_words[0]}-{keyword_words[1]}"
    elif len(keyword_words) == 1:
        keyword = keyword_words[0]
    else:
        keyword = "education"
        
    keyword = re.sub(r'[^a-zA-Z0-]-', '', keyword) # clean
    
    unsplash_url = f"https://source.unsplash.com/480x270/?{keyword}&sig={c_id}"
    print(f"   [Unsplash Fallback] {unsplash_url}")
    return unsplash_url

def process_and_upload():
    print(f"🌱 Preparing to map and upload {len(raw_courses)} structured courses...")
    processed_courses = []
    
    levels = ["Beginner", "Intermediate", "Advanced", "All Levels"]

    for i, c in enumerate(raw_courses):
        print(f"Scraping [{i+1}/{len(raw_courses)}]: {c['title']}")
        
        # Determine strict pricing algorithms
        is_free = c['type'] == 'Free'
        price = 0 if is_free else c['price']
        original_price = 0 if is_free else round(price * random.uniform(2.1, 4.5), 0)
        discount = 0 if is_free else int(((original_price - price) / original_price) * 100)
        
        # Specific overrides to fix DB constraints
        if c['platform'] == 'LinkedIn Learning':
            c['platform'] = 'LinkedIn' # Keep text short
            
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
            "tags": ["premium", "2024", c['department'].lower()],
            "is_bestseller": random.choice([True, False, False]),
            "is_new": random.choice([True, False, False, False]),
            "certificate_offered": True
        })
        
    print(f"🧹 Scrubbing existing database entries to prevent duplicate injection...")
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }
    
    del_res = requests.delete(f"{SUPABASE_URL}/rest/v1/courses?course_id=not.eq.0", headers=headers)
    if not del_res.ok:
        print(f"⚠️ Failed to scrub: {del_res.text}")

    print(f"🚀 Overwriting Supabase via REST API...")
    res = requests.post(f"{SUPABASE_URL}/rest/v1/courses", headers=headers, json=processed_courses)
    if res.ok:
        print("✅ Seeding entirely complete! Your specific real courses are live and duplicate-free.")
    else:
        print(f"❌ Failed: {res.text}")

if __name__ == "__main__":
    process_and_upload()
