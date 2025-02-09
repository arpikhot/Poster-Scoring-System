import pandas as pd
from scholarly import scholarly
import time

def get_scholar_profile(name):
    """Fetches a professor's research interests, domains, and keywords from Google Scholar."""
    try:
        search_query = scholarly.search_author(name)
        author = next(search_query, None)
        

        
        if author:
            author = scholarly.fill(author)
            interests = author.get("interests", [])  # Research interests
            domains = [pub.get("bib", {}).get("title", "") for pub in author.get("publications", [])][:5]  # Top 5 paper titles
            keywords = set()  # Extract keywords from titles
            
            for title in domains:
                keywords.update(title.lower().split())  # Simple keyword extraction
            
            return {
                "name": name,
                "interests": "; ".join(interests),
                "domains": "; ".join(domains),
                "keywords": "; ".join(keywords)
            }
        
        return {"name": name, "interests": "", "domains": "", "keywords": ""}
    
    except Exception as e:
        print(f"Error fetching {name}: {e}")
        return {"name": name, "interests": "", "domains": "", "keywords": ""}

# Step 1: Load professor names from Excel
excel_file = "judge_with_code.xlsx"  # Change this to your actual file name
df_professors = pd.read_excel(excel_file)

# Assuming professor names are in a column named "Name"
professor_names = (df_professors["Judge FirstName"] + " " + df_professors["Judge LastName"]).dropna().tolist()

print(f"Found {len(professor_names)} professors.")

# Step 2: Fetch data from Google Scholar
professor_data = []
for name in professor_names:
    print(f"Fetching Google Scholar profile for {name}...")
    professor_data.append(get_scholar_profile(name))
    time.sleep(3)  # Delay to avoid getting blocked

# Step 3: Convert to DataFrame and Save as CSV
df_results = pd.DataFrame(professor_data)
df_results.to_csv("professor_expertise.csv", index=False)

print("Professor expertise data saved to professor_expertise.csv")
