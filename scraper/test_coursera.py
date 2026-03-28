import requests
res = requests.get('https://api.coursera.org/api/courses.v1?fields=name,description,photoUrl,domainTypes&limit=10')
print(res.json())
