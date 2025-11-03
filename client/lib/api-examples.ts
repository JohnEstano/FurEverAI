// Example API integration patterns for your ML team

import api from '@/lib/api'

// ============================================
// EXAMPLE 1: Personality Quiz → Decision Tree
// ============================================
export async function handleQuizComplete(answers: string[]) {
  try {
    const result = await api.predict({
      type: 'personality_assessment',
      answers: answers,
      timestamp: new Date().toISOString()
    })
    
    // Expected response from ML model:
    // {
    //   pawsonality_type: "Active Adventurer",
    //   confidence: 0.92,
    //   traits: ["high_energy", "experienced", "active"]
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
export async function calculateCompatibility(userId: string, petId: string) {
  try {
    const result = await api.predict({
      type: 'compatibility_match',
      user_id: userId,
      pet_id: petId
    })
    
    // Expected response:
    // {
    //   compatibility_score: 92,
    //   match_reasons: ["Similar energy levels", "Compatible lifestyle"],
    //   recommendation: "Excellent match!"
    // }
    
    return result
  } catch (error) {
    console.error('Compatibility API error:', error)
    return null
  }
}

// ============================================
// EXAMPLE 3: Pet Image Upload → Neural Network
// ============================================
export async function analyzePetImage(file: File) {
  try {
    const result = await api.predictWithFile(file)
    
    // Expected response:
    // {
    //   breed: "Golden Retriever",
    //   confidence: 0.95,
    //   age_estimate: 3,
    //   traits: ["friendly", "active", "family_friendly"],
    //   deep_match_score: 95
    // }
    
    return result
  } catch (error) {
    console.error('Image analysis error:', error)
    return null
  }
}

// ============================================
// EXAMPLE 4: Similar Pets → KNN
// ============================================
export async function getSimilarPets(petId: string, count: number = 5) {
  try {
    const result = await api.predict({
      type: 'similar_pets',
      pet_id: petId,
      count: count
    })
    
    // Expected response:
    // {
    //   similar_pets: [
    //     { id: 123, name: "Max", similarity: 0.89 },
    //     { id: 456, name: "Luna", similarity: 0.85 }
    //   ]
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
    const result = await api.predict({
      type: 'auto_tag',
      description: description
    })
    
    // Expected response:
    // {
    //   tags: ["family-friendly", "apartment-approved", "low-maintenance"],
    //   confidence_scores: { "family-friendly": 0.92, ... }
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
export async function predictAdoptionTime(petId: string) {
  try {
    const result = await api.predict({
      type: 'adoption_prediction',
      pet_id: petId
    })
    
    // Expected response:
    // {
    //   estimated_days: 12,
    //   confidence_interval: [8, 16],
    //   factors: ["High compatibility matches", "Popular breed"]
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
    const result = await handleQuizComplete(['answer1', 'answer2'])
    console.log(result)
  }
  
  return <button onClick={handleSubmit}>Submit</button>
}
*/
