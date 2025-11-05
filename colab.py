# ========================================
# FurEver.AI - Data Generation (Colab-ready)
# ========================================

import pandas as pd
import numpy as np

# Reproducibility
np.random.seed(42)

print("--- Starting Data Generation ---")

# =======================================================
# 1) Generate Pet Profiles (Items)
# =======================================================
num_pets = 1000

pet_data = {
    'Pet_ID': [f'P{i:04d}' for i in range(1, num_pets + 1)],
    'Type': np.random.choice(['Dog', 'Cat'], size=num_pets, p=[0.6, 0.4]),
    'Age_Group': np.random.choice(['Puppy/Kitten', 'Young_Adult', 'Senior'], size=num_pets, p=[0.3, 0.5, 0.2]),
    'Size': np.random.choice(['Small', 'Medium', 'Large'], size=num_pets, p=[0.35, 0.45, 0.2]),
    # Energy Level: 1=Low, 2=Medium, 3=High (Matches Adopter Activity)
    'Energy_Level': np.random.choice([1, 2, 3], size=num_pets, p=[0.3, 0.4, 0.3]),
    # Good_With_Kids: 0=No, 1=Yes, 2=Needs older kids (Matches Adopter Has_Kids)
    'Good_With_Kids': np.random.choice([0, 1, 2], size=num_pets, p=[0.1, 0.7, 0.2]),
    'Grooming_Needs': np.random.choice(['Low', 'Medium', 'High'], size=num_pets, p=[0.5, 0.3, 0.2]),
}

pet_profiles = pd.DataFrame(pet_data)
pet_profiles.to_csv('pet_profiles.csv', index=False)
print(f"Generated and saved pet_profiles.csv with {len(pet_profiles)} records.")

# =======================================================
# 2) Generate Adopter Profiles (Users)
# =======================================================
num_adopters = 500

adopter_data = {
    'Adopter_ID': [f'U{i:03d}' for i in range(1, num_adopters + 1)],
    'Housing_Type': np.random.choice(['Apartment', 'House_No_Yard', 'House_Yard'], size=num_adopters, p=[0.4, 0.3, 0.3]),
    'Has_Kids': np.random.choice([0, 1], size=num_adopters, p=[0.6, 0.4]),
    # Time_At_Home: 1=Away_Most_Day, 2=Hybrid, 3=WFH_Full_Time
    'Time_At_Home': np.random.choice([1, 2, 3], size=num_adopters, p=[0.25, 0.4, 0.35]),
    # Activity Level: 1=Low, 2=Medium, 3=High (Matches Pet Energy)
    'Activity_Level': np.random.choice([1, 2, 3], size=num_adopters, p=[0.3, 0.4, 0.3]),
    'Experience_Level': np.random.choice(['First_Time', 'Past_Owner', 'Expert'], size=num_adopters, p=[0.3, 0.5, 0.2]),
    'Pet_Type_Desired': np.random.choice(['Dog', 'Cat'], size=num_adopters, p=[0.7, 0.3]),
}

adopter_profiles = pd.DataFrame(adopter_data)
adopter_profiles.to_csv('adopter_profiles.csv', index=False)
print(f"Generated and saved adopter_profiles.csv with {len(adopter_profiles)} records.")

# =======================================================
# 3) Generate Historical Matches (Target for Matching)
# =======================================================
num_attempts = 3000
historical_matches = pd.DataFrame({
    'Adopter_ID': np.random.choice(adopter_profiles['Adopter_ID'], size=num_attempts),
    'Pet_ID': np.random.choice(pet_profiles['Pet_ID'], size=num_attempts),
})

# Merge to build rules
history = pd.merge(historical_matches, adopter_profiles, on='Adopter_ID')
history = pd.merge(history, pet_profiles, on='Pet_ID')

# Target
history['Success_Match'] = 0

# Rule 1: Energy alignment helps
history.loc[history['Activity_Level'] == history['Energy_Level'], 'Success_Match'] = 1

# Rule 2: Apartment + Large pet hurts
history.loc[(history['Housing_Type'] == 'Apartment') & (history['Size'] == 'Large'), 'Success_Match'] = 0

# Rule 3: Has kids but pet not good with kids hurts
history.loc[(history['Has_Kids'] == 1) & (history['Good_With_Kids'] == 0), 'Success_Match'] = 0

# Rule 4: Expert owner + High grooming needs helps
history.loc[(history['Experience_Level'] == 'Expert') & (history['Grooming_Needs'] == 'High'), 'Success_Match'] = 1

# Add noise
noise_count = int(num_attempts * 0.1)
history.loc[history.sample(noise_count, random_state=42).index, 'Success_Match'] = np.random.choice([0, 1], size=noise_count)

# Finalize training matches
historical_matches_final = history[['Adopter_ID', 'Pet_ID', 'Success_Match']].drop_duplicates()
historical_matches_final.to_csv('historical_matches.csv', index=False)
print(f"Generated and saved historical_matches.csv with {len(historical_matches_final)} records (The Training Data).")

# =======================================================
# 4) Prepare Training Datasets for 6 ML Algorithms
# =======================================================
print("--- Preparing Training Datasets for 6 ML Algorithms ---")

# ---------- 4.1 Decision Tree (Pawsonality) ----------
dt_data = adopter_profiles.copy()

def classify_pawsonality(row):
    # Active Adventurer: High activity & experienced
    if row['Activity_Level'] == 3 and row['Experience_Level'] in ['Past_Owner', 'Expert']:
        return 'Active Adventurer'
    # Cozy Companion: Low activity & Apartment
    elif row['Activity_Level'] == 1 and row['Housing_Type'] == 'Apartment':
        return 'Cozy Companion'
    # Playful Enthusiast: High activity & not always at home
    elif row['Activity_Level'] == 3 and row['Time_At_Home'] in [1, 2]:
        return 'Playful Enthusiast'
    # Confident Guardian: Expert & House with Yard
    elif row['Experience_Level'] == 'Expert' and row['Housing_Type'] == 'House_Yard':
        return 'Confident Guardian'
    # Gentle Nurturer: First/Past owner & WFH full-time
    elif row['Experience_Level'] in ['First_Time', 'Past_Owner'] and row['Time_At_Home'] == 3:
        return 'Gentle Nurturer'
    # Quiet Caretaker: Low activity & not always at home
    elif row['Activity_Level'] == 1 and row['Time_At_Home'] in [1, 2]:
        return 'Quiet Caretaker'
    # Social Butterfly: Medium activity & has kids
    elif row['Activity_Level'] == 2 and row['Has_Kids'] == 1:
        return 'Social Butterfly'
    # Balanced Buddy: default
    else:
        return 'Balanced Buddy'

dt_data['Target_Pawsonality'] = dt_data.apply(classify_pawsonality, axis=1)

dt_training_data = dt_data[['Adopter_ID', 'Housing_Type', 'Has_Kids', 'Time_At_Home', 'Activity_Level', 'Experience_Level', 'Target_Pawsonality']]
dt_training_data.to_csv('1_dt_pawsonality_training.csv', index=False)
print("1. Decision Tree (Pawsonality) Training Data saved.")

# ---------- 4.2 + 4.5 SVM & ANN (Core/Deep Matching) ----------
# Activity_Energy_Diff and one-hot categorical columns
match_df = pd.merge(historical_matches_final, adopter_profiles, on='Adopter_ID')
match_df = pd.merge(match_df, pet_profiles, on='Pet_ID')
match_df['Activity_Energy_Diff'] = np.abs(match_df['Activity_Level'] - match_df['Energy_Level'])

match_features = match_df[['Adopter_ID', 'Pet_ID', 'Activity_Energy_Diff', 'Has_Kids', 'Good_With_Kids', 'Experience_Level', 'Grooming_Needs', 'Size', 'Success_Match']]
svm_ann_training_data = pd.get_dummies(match_features, columns=['Experience_Level', 'Grooming_Needs', 'Size'], drop_first=True)
svm_ann_training_data = svm_ann_training_data.drop(columns=['Adopter_ID', 'Pet_ID'])

svm_ann_training_data.to_csv('2_5_svm_ann_matching_training.csv', index=False)
print("2 & 5. SVM/ANN (Matching) Training Data saved.")

# ---------- 4.3 Naive Bayes (Auto-Tagging with better rules) ----------
nb_data = pet_profiles.copy()

def generate_description(row):
    # Base description
    desc = f"A {row['Age_Group'].lower().replace('_', ' ')} {row['Type'].lower()} with {row['Grooming_Needs'].lower()} grooming needs. "
    tags = []

    # Age-specific tags and text
    if row['Age_Group'] == 'Senior':
        desc += "Calm and wise, ideal for a relaxed home. "
        tags.append('senior')
    elif row['Age_Group'] == 'Puppy/Kitten':
        if row['Type'] == 'Dog':
            desc += "Young and learning, needs patience and training. "
            tags.append('puppy')
        else:
            desc += "Playful and curious, perfect for a nurturing home. "
            tags.append('kitten')
    elif row['Age_Group'] == 'Young_Adult':
        desc += "In the prime age for bonding and training. "
        tags.append('young')

    # Energy and living situation
    if row['Energy_Level'] == 3:
        desc += "Requires lots of space and playtime; thrives with an active lifestyle. "
        tags.extend(['high-energy'])
        # For large + high-energy we often prefer yard
        if row['Size'] == 'Large':
            tags.append('house-with-yard')
    elif row['Energy_Level'] == 1:
        desc += "Very calm and quiet, perfect for an apartment-approved life. "
        tags.extend(['low-energy', 'apartment-approved'])

    # Family/kids compatibility
    if row['Good_With_Kids'] == 1:
        desc += "Loves kids and other pets. "
        tags.append('family-friendly')
        if row['Energy_Level'] >= 2:
            tags.append('social')
    elif row['Good_With_Kids'] == 2:
        desc += "Best with experienced families and older children. "
        tags.append('experienced-owner-recommended')
    else:
        desc += "Best suited for a quiet, adult-only household. "
        tags.append('adults-only')

    # Size-based nuance
    if row['Size'] == 'Large':
        desc += "Due to size, a house with a yard is recommended. "
        tags.append('large-breed')

    # De-duplicate and return
    tags = list(dict.fromkeys(tags))
    return desc.strip(), tags

nb_data[['Pet_Description', 'Target_Pet_Tags']] = nb_data.apply(
    lambda row: pd.Series(generate_description(row)), axis=1
)

nb_training_data = nb_data[['Pet_ID', 'Pet_Description', 'Target_Pet_Tags']]
nb_training_data.to_csv('3_nb_autotagging_training.csv', index=False)
print("3. Naive Bayes (Auto-Tagging) Training Data saved.")

# ---------- 4.4 KNN (Recommendations) ----------
# Keep compatibility with earlier training code that expected duplicated names like 'Pet_Medium.1'
knn_data = pet_profiles.copy()
knn_training_data = pd.get_dummies(
    knn_data.drop(columns=['Pet_ID']),
    columns=['Type', 'Age_Group', 'Size', 'Grooming_Needs'],
    prefix='Pet'  # Intentional: may create duplicates like Pet_Medium (size) vs Pet_Medium.1 (grooming)
)
# Drop Good_With_Kids for similarity (optional, matches earlier approach)
if 'Good_With_Kids' in knn_training_data.columns:
    knn_training_data = knn_training_data.drop(columns=['Good_With_Kids'])
# Index by Pet_ID for lookup
knn_training_data.index = knn_data['Pet_ID']
knn_training_data.to_csv('4_knn_recommendation_features.csv')
print("4. KNN (Recommendations) Feature Data saved.")

# ---------- 4.6 Linear Regression (Adoption Timeline) ----------
lr_data = pet_profiles.copy()

def generate_days_in_shelter(row):
    base_days = 25
    if row['Energy_Level'] == 3: base_days += 10
    elif row['Energy_Level'] == 1: base_days -= 5

    if row['Size'] == 'Large': base_days += 15
    elif row['Size'] == 'Small': base_days -= 5

    if row['Age_Group'] in ['Senior', 'Puppy/Kitten']: base_days += 5
    elif row['Age_Group'] == 'Young_Adult': base_days -= 10

    if row['Grooming_Needs'] == 'High': base_days += 10

    noise = np.random.randint(-10, 10)
    return max(5, base_days + noise)

lr_data['Target_Days_In_Shelter'] = lr_data.apply(generate_days_in_shelter, axis=1)
# One-hot for LR training
lr_training = pd.get_dummies(
    lr_data.drop(columns=['Pet_ID']),
    columns=['Type', 'Age_Group', 'Size', 'Grooming_Needs'],
    drop_first=True
)
# Optional: remove Good_With_Kids (as earlier)
if 'Good_With_Kids' in lr_training.columns:
    lr_training = lr_training.drop(columns=['Good_With_Kids'])

lr_training.to_csv('6_lr_adoption_prediction_training.csv', index=False)
print("6. Linear Regression (Adoption Prediction) Training Data saved.")

print("--- Data Generation Complete ---")