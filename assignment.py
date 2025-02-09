import pandas as pd
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from collections import defaultdict

# Load professor expertise data
professors_df = pd.read_csv("professor_expertise.csv")  # Contains names, interests, domains, keywords

# Load poster data
posters_df = pd.read_excel("posters.xlsx")  # Contains poster #, abstract, and topic

# Load judges' availability data
judges_df = pd.read_excel("judge_with_code.xlsx")

# Load a pre-trained model for embeddings
model = SentenceTransformer("all-MiniLM-L6-v2")

# Combine expertise data into a single string for each professor
professors_df["expertise"] = professors_df["interests"].fillna("") + "; " + \
                             professors_df["domains"].fillna("") + "; " + \
                             professors_df["keywords"].fillna("")

# Convert expertise and topics into embeddings
professor_embeddings = model.encode(professors_df["expertise"].tolist(), convert_to_tensor=True)
poster_embeddings = model.encode(posters_df["Abstract"].fillna("").tolist(), convert_to_tensor=True)

# Compute similarity scores
similarity_matrix = cosine_similarity(poster_embeddings.cpu(), professor_embeddings.cpu())

# Track assignments per professor
assignment_counts = {name: 0 for name in professors_df["name"]}

# Store results for assignments
assignments = []

# Track remaining posters that need judges
remaining_posters = set(posters_df["Poster #"])

# Use defaultdict to handle missing keys gracefully
updated_judges_data = defaultdict(list)
updated_posters_data = {}

# Append all poster data first (including all columns)
for _, poster in posters_df.iterrows():
    poster_id = poster["Poster #"]
    updated_posters_data[poster_id] = poster.to_dict()
    updated_posters_data[poster_id]["Judge 1"] = None
    updated_posters_data[poster_id]["Judge 2"] = None

# Assign judges to posters based on expertise and availability
for i, poster in posters_df.iterrows():
    poster_id = poster["Poster #"]
    poster_slot = "1" if poster_id % 2 == 1 else "2"  # Assign odd posters to slot 1, even posters to slot 2

    # Get top matches sorted by highest similarity score
    sorted_matches = similarity_matrix[i].argsort()[::-1]

    assigned_judges = []

    for idx in sorted_matches:
        judge_name = professors_df.iloc[idx]["name"]

        # Assign judge only if they have less than 6 assignments
        if assignment_counts[judge_name] < 6:
            # Check availability (1, 2, or both)
            for _, judge_row in judges_df.iterrows():
                judge_id = judge_row['Judge']
                judge_full_name = judge_row['Judge FirstName'] + ' ' + judge_row['Judge LastName']
                judge_availability = str(judge_row['Hour available']).strip()

                if judge_name == judge_full_name and judge_availability in ['both', poster_slot]:
                    assigned_judges.append(judge_id)
                    assignment_counts[judge_name] += 1
                    updated_judges_data[judge_id].append(poster_id)
                    break  # Break after assigning one judge to avoid duplicates

        # Stop after assigning 2 judges
        if len(assigned_judges) == 2:
            break

    # Ensure exactly 2 judges are assigned
    while len(assigned_judges) < 2:
        assigned_judges.append(None)

    # Update both judges and posters data
    updated_posters_data[poster_id]["Judge 1"] = assigned_judges[0]
    updated_posters_data[poster_id]["Judge 2"] = assigned_judges[1]

    assignments.append({
        "Poster_Number": poster_id,
        "Judge_1": assigned_judges[0],
        "Judge_2": assigned_judges[1]
    })

# Convert updated posters data into DataFrame
posters_assignments_df = pd.DataFrame(updated_posters_data.values())

# Convert updated judges data into DataFrame
judges_assignments = []
for _, judge_row in judges_df.iterrows():
    judge_id = judge_row['Judge']
    judge_assignments = {
        "Judge ID": judge_id,
        'First Name': judge_row['Judge FirstName'],
        'Last Name': judge_row['Judge LastName'],
        'Availability': judge_row['Hour available'],
        'Verification Code': judge_row['VerificationCode']
    }

    # Get the list of posters assigned
    posters_assigned = updated_judges_data.get(judge_id, [])
    for i, poster_id in enumerate(posters_assigned[:6]):
        judge_assignments[f"Poster {i+1}"] = poster_id

    # Fill remaining slots with None if the judge has less than 6 posters
    while len(posters_assigned) < 6:
        judge_assignments[f"Poster {len(posters_assigned) + 1}"] = None
        posters_assigned.append(None)

    judges_assignments.append(judge_assignments)

judges_assignments_df = pd.DataFrame(judges_assignments).sort_values(by='Judge ID')

# Save results
posters_assignments_df.to_excel("updated_posters.xlsx", index=False)
judges_assignments_df.to_excel("updated_judges_pin.xlsx", index=False)

print("Final judge assignments saved with correct slot matching!")