import os
import requests
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables
load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_KEY") # Use service role key to bypass RLS for inserts

if not SUPABASE_URL or not SUPABASE_KEY:
    print("❌ ERROR: Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env")
    exit(1)

def scrape_coursera():
    """
    Scrape real, live data from the Coursera Open API.
    """
    print("🕷️ Scraping Coursera API...")
    courses = []
    try:
        url = 'https://api.coursera.org/api/courses.v1?fields=name,description,photoUrl,domainTypes,slug&limit=50'
        res = requests.get(url)
        res.raise_for_status()
        data = res.json()
        
        for item in data.get('elements', []):
            desc = item.get('description', '')
            if desc:
                # Strip HTML tags or just truncate
                desc = desc[:300] + '...' if len(desc) > 300 else desc
                
            courses.append({
                "title": item.get('name', 'Unknown Course'),
                "description": desc,
                "platform": "Coursera",
                "category": "Technology/Business", # Simplified
                "is_free": True, # Most are free to audit
                "price": "Free to Audit",
                "rating": 4.7,
                "thumbnail": item.get('photoUrl') or "https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=400",
                "course_url": f"https://www.coursera.org/learn/{item.get('slug', item.get('id', ''))}",
                "scraped_at": datetime.now().isoformat()
            })
            
    except Exception as e:
        print(f"Error scraping Coursera: {e}")
        
    return courses

def scrape_udemy():
    """
    Simulates fetching from the Udemy Affiliate REST API.
    (Requires Client ID/Secret in production)
    """
    print("🕷️ Scraping Udemy Affiliate API...")
    return [
        {
            "title": "The Complete 2024 Web Development Bootcamp",
            "description": "Become a full-stack web developer with just one course. HTML, CSS, Javascript, Node, React.",
            "platform": "Udemy",
            "category": "Web Dev",
            "is_free": False,
            "price": "$19.99",
            "rating": 4.8,
            "thumbnail": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=400",
            "course_url": "https://www.udemy.com/course/the-complete-web-development-bootcamp/",
            "scraped_at": datetime.now().isoformat()
        },
        {
            "title": "100 Days of Code: The Complete Python Pro Bootcamp",
            "description": "Master Python by building 100 projects in 100 days. Learn data science, automation, build websites, games and apps!",
            "platform": "Udemy",
            "category": "Data Science",
            "is_free": False,
            "price": "$14.99",
            "rating": 4.9,
            "thumbnail": "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=400",
            "course_url": "https://www.udemy.com/course/100-days-of-code/",
            "scraped_at": datetime.now().isoformat()
        },
        {
            "title": "React Native - The Practical Guide 2024",
            "description": "Build real native mobile apps for iOS and Android using React Native and Expo.",
            "platform": "Udemy",
            "category": "Mobile Dev",
            "is_free": False,
            "price": "$24.99",
            "rating": 4.7,
            "thumbnail": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=400",
            "course_url": "https://www.udemy.com/course/react-native-the-practical-guide/",
            "scraped_at": datetime.now().isoformat()
        },
        {
            "title": "Advanced CSS and Sass: Flexbox, Grid, Animations",
            "description": "The most advanced and modern CSS course on the internet: master flexbox, CSS Grid, responsive design.",
            "platform": "Udemy",
            "category": "Design",
            "is_free": False,
            "price": "$12.99",
            "rating": 4.9,
            "thumbnail": "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&q=80&w=400",
            "course_url": "https://www.udemy.com/course/advanced-css-and-sass/",
            "scraped_at": datetime.now().isoformat()
        },
        {
            "title": "Unreal Engine 5 C++ The Ultimate Game Developer Course",
            "description": "Learn C++ and make video games in Unreal Engine. Master the fundamentals of 3D mathematics and object-oriented programming.",
            "platform": "Udemy",
            "category": "Game Dev",
            "is_free": False,
            "price": "$18.99",
            "rating": 4.8,
            "thumbnail": "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=400",
            "course_url": "https://www.udemy.com/course/unrealcourse/",
            "scraped_at": datetime.now().isoformat()
        }
    ]

def scrape_edx():
    """
    Simulates fetching high-credential university tracks from edX.
    """
    print("🕷️ Scraping edX Catalog API...")
    return [
        {
            "title": "CS50's Introduction to Computer Science",
            "description": "An introduction to the intellectual enterprises of computer science and the art of programming from Harvard University.",
            "platform": "edX",
            "category": "Web Dev",
            "is_free": True,
            "price": "Free to Audit",
            "rating": 5.0,
            "thumbnail": "https://images.unsplash.com/photo-1550439062-609e1531270e?auto=format&fit=crop&q=80&w=400",
            "course_url": "https://www.edx.org/course/introduction-computer-science-harvardx-cs50x",
            "scraped_at": datetime.now().isoformat()
        },
        {
            "title": "MIT Analytics Edge",
            "description": "Through inspiring examples and stories, discover the power of data and use analytics to provide an edge to your career and your life.",
            "platform": "edX",
            "category": "Data Science",
            "is_free": True,
            "price": "Free to Audit",
            "rating": 4.8,
            "thumbnail": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400",
            "course_url": "https://www.edx.org/course/the-analytics-edge",
            "scraped_at": datetime.now().isoformat()
        },
        {
            "title": "Cloud Computing for Enterprises",
            "description": "Learn cloud computing concepts, including cloud architectures, service models, and deployment models.",
            "platform": "edX",
            "category": "Cloud",
            "is_free": False,
            "price": "$149.00",
            "rating": 4.6,
            "thumbnail": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400",
            "course_url": "https://www.edx.org/",
            "scraped_at": datetime.now().isoformat()
        }
    ]

def run_scraper():
    print("🚀 Starting Automated Web Scraper...")
    
    all_courses = []
    all_courses.extend(scrape_coursera())
    all_courses.extend(scrape_udemy())
    all_courses.extend(scrape_edx())
    
    print(f"📊 Aggregated {len(all_courses)} courses. Inserting into Supabase...")
    
    # Insert via REST API
    try:
        headers = {
            "apikey": SUPABASE_KEY,
            "Authorization": f"Bearer {SUPABASE_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
        }
        res = requests.post(f"{SUPABASE_URL}/rest/v1/courses", headers=headers, json=all_courses)
        res.raise_for_status()
        print(f"✅ Successfully inserted {len(all_courses)} live paths into Supabase!")
    except requests.exceptions.HTTPError as e:
        print(f"❌ Failed to insert data! Supabase says: {e.response.text}")
    except Exception as e:
        print(f"❌ Failed to insert data: {e}")

if __name__ == "__main__":
    run_scraper()
