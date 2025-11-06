// Example API integration patterns for your ML team

import api from '@/lib/api'

// ============================================
// EXAMPLE 1: Personality Quiz → Decision Tree
// ============================================
export async function handleQuizComplete(quizData: {
  Housing_Type: string;
  Has_Kids: number;
  Time_At_Home: number;
  Activity_Level: number;
  Experience_Level: string;
}) {
  try {
    const result = await api.predictPawsonality(quizData)
    
    // Expected response from ML model:
    // {
    //   status: "success",
    //   pawsonality: "Active Adventurer",
    //   description: "High energy, experienced, needs active pets",
    //   message: "You're a Active Adventurer!"
    // }
    
    return result
  } catch (error) {
    console.error('Quiz API error:', error)
    return null
  }
}

// ============================================
// EXAMPLE 2: Pet Matching → SVM
// ============================================
export async function calculateCompatibility(matchData: {
  Activity_Level: number;
  Has_Kids: number;
  Experience_Level: string;
  Pet_Energy_Level: number;
  Pet_Good_With_Kids: number;
  Pet_Size: string;
  Pet_Grooming_Needs: string;
}) {
  try {
    const result = await api.matchScore(matchData)
    
    // Expected response:
    // {
    //   status: "success",
    //   match_score: 92,
    //   message: "92% Match"
    // }
    
    return result
  } catch (error) {
    console.error('Compatibility API error:', error)
    return null
  }
}

// ============================================
// EXAMPLE 3: Deep Match Score → ANN
// ============================================
export async function calculateDeepMatch(matchData: {
  Activity_Level: number;
  Has_Kids: number;
  Experience_Level: string;
  Pet_Energy_Level: number;
  Pet_Good_With_Kids: number;
  Pet_Size: string;
  Pet_Grooming_Needs: string;
}) {
  try {
    const result = await api.deepMatch(matchData)
    
    // Expected response:
    // {
    //   status: "success",
    //   deep_match_score: 95,
    //   message: "AI DeepMatch: 95%"
    // }
    
    return result
  } catch (error) {
    console.error('Deep match error:', error)
    return null
  }
}

// ============================================
// EXAMPLE 4: Similar Pets → KNN
// ============================================
export async function getSimilarPets(petId: string, count: number = 5) {
  try {
    const result = await api.recommend({
      Pet_ID: petId,
      n_recommendations: count
    })
    
    // Expected response:
    // {
    //   status: "success",
    //   recommended_pet_ids: ["P0051", "P0052", "P0053", "P0054", "P0055"],
    //   message: "KNN recommendations for P0050"
    // }
    
    return result
  } catch (error) {
    console.error('Similar pets error:', error)
    return null
  }
}

// ============================================
// EXAMPLE 5: Auto-Tagging → Naive Bayes
// ============================================
export async function autoTagPet(description: string) {
  try {
    const result = await api.autoTags({ description })
    
    // Expected response:
    // {
    //   status: "success",
    //   tags: ["family-friendly", "apartment-approved", "low-maintenance"]
    // }
    
    return result
  } catch (error) {
    console.error('Auto-tag error:', error)
    return null
  }
}

// ============================================
// EXAMPLE 6: Adoption Prediction → Linear Regression
// ============================================
export async function predictAdoptionTime(petData: {
  Type: string;
  Age_Group: string;
  Size: string;
  Energy_Level: number;
  Grooming_Needs: string;
}) {
  try {
    const result = await api.adoptionPrediction(petData)
    
    // Expected response:
    // {
    //   status: "success",
    //   predicted_days: 12,
    //   message: "Predicted adoption: 12 days"
    // }
    
    return result
  } catch (error) {
    console.error('Adoption prediction error:', error)
    return null
  }
}

// ============================================
// HOW TO USE IN COMPONENTS
// ============================================

/*
// In your component:
import { handleQuizComplete, calculateCompatibility } from '@/lib/api-examples'

function MyComponent() {
  const handleSubmit = async () => {
    const result = await handleQuizComplete({
      Housing_Type: "Apartment",
      Has_Kids: 0,
      Time_At_Home: 2,
      Activity_Level: 2,
      Experience_Level: "Past_Owner"
    })
    console.log(result)
  }
  
  return <button onClick={handleSubmit}>Submit</button>
}
*/
