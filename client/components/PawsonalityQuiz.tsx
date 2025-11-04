'use client'
import React, { useEffect, useState } from 'react'
import { api } from '@/lib/api'

const PAWSONALITY_TYPES = {
  'Active Adventurer': { emoji: '⛰️', description: 'High energy, experienced, needs active pets', color: 'from-orange-500 to-red-500' },
  'Cozy Companion': { emoji: '☕', description: 'Low energy, novice, perfect for calm pets', color: 'from-amber-500 to-yellow-500' },
  'Social Butterfly': { emoji: '🦋', description: 'Very social, loves outgoing pets', color: 'from-pink-500 to-rose-500' },
  'Quiet Caretaker': { emoji: '🌙', description: 'Reserved, ideal for shy or independent pets', color: 'from-indigo-500 to-purple-500' },
  'Confident Guardian': { emoji: '🛡️', description: 'Experienced, great for large breeds', color: 'from-blue-500 to-cyan-500' },
  'Gentle Nurturer': { emoji: '💚', description: 'Empathetic, perfect for special needs pets', color: 'from-green-500 to-emerald-500' },
  'Playful Enthusiast': { emoji: '🎾', description: 'High energy, loves young playful pets', color: 'from-yellow-500 to-lime-500' },
  'Balanced Buddy': { emoji: '⚖️', description: 'Adaptable, matches with most average pets', color: 'from-gray-500 to-slate-500' },
}

const QUIZ_QUESTIONS = [
  {
    question: "What's your ideal weekend activity?",
    options: [
      { text: "Hiking or outdoor adventure", type: 'Active Adventurer' },
      { text: "Reading at home with coffee", type: 'Cozy Companion' },
      { text: "Hosting friends for a party", type: 'Social Butterfly' },
      { text: "Quiet meditation or solo time", type: 'Quiet Caretaker' },
    ]
  },
  {
    question: "How do you feel about daily exercise?",
    options: [
      { text: "Love it! 2+ hours minimum", type: 'Active Adventurer' },
      { text: "A short walk is enough", type: 'Cozy Companion' },
      { text: "Group fitness classes are fun!", type: 'Social Butterfly' },
      { text: "Gentle yoga at home", type: 'Quiet Caretaker' },
    ]
  },
  {
    question: "Your pet experience level?",
    options: [
      { text: "Expert - I've trained many dogs", type: 'Confident Guardian' },
      { text: "Some experience with pets", type: 'Balanced Buddy' },
      { text: "First time pet owner", type: 'Cozy Companion' },
      { text: "Experienced with special needs", type: 'Gentle Nurturer' },
    ]
  },
  {
    question: "Living situation?",
    options: [
      { text: "House with big yard", type: 'Active Adventurer' },
      { text: "Small apartment", type: 'Cozy Companion' },
      { text: "Always have guests over", type: 'Social Butterfly' },
      { text: "Quiet neighborhood", type: 'Quiet Caretaker' },
    ]
  },
  {
    question: "Ideal pet personality?",
    options: [
      { text: "Energetic and playful", type: 'Playful Enthusiast' },
      { text: "Calm and cuddly", type: 'Cozy Companion' },
      { text: "Friendly with everyone", type: 'Social Butterfly' },
      { text: "Independent and chill", type: 'Quiet Caretaker' },
    ]
  },
]

export default function PawsonalityQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [result, setResult] = useState<string | null>(null)
  const [showQuiz, setShowQuiz] = useState(false)
  const [serverPawsonality, setServerPawsonality] = useState<string | null>(null)
  const [serverDescription, setServerDescription] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Map quiz result into backend payload for /api/predict
  const mapResultToPredictPayload = (type: string) => {
    switch (type) {
      case 'Active Adventurer':
        return {
          Housing_Type: 'House_Yard',
          Has_Kids: 0,
          Time_At_Home: 2,
          Activity_Level: 3,
          Experience_Level: 'Past_Owner',
          Pet_Type_Desired: 'Dog',
        }
      case 'Cozy Companion':
        return {
          Housing_Type: 'Apartment',
          Has_Kids: 0,
          Time_At_Home: 3,
          Activity_Level: 1,
          Experience_Level: 'First_Time',
          Pet_Type_Desired: 'Cat',
        }
      case 'Social Butterfly':
        return {
          Housing_Type: 'House_No_Yard',
          Has_Kids: 1,
          Time_At_Home: 2,
          Activity_Level: 2,
          Experience_Level: 'Past_Owner',
          Pet_Type_Desired: 'Dog',
        }
      case 'Quiet Caretaker':
        return {
          Housing_Type: 'Apartment',
          Has_Kids: 0,
          Time_At_Home: 1,
          Activity_Level: 1,
          Experience_Level: 'Past_Owner',
          Pet_Type_Desired: 'Cat',
        }
      case 'Confident Guardian':
        return {
          Housing_Type: 'House_Yard',
          Has_Kids: 0,
          Time_At_Home: 2,
          Activity_Level: 3,
          Experience_Level: 'Expert',
          Pet_Type_Desired: 'Dog',
        }
      case 'Gentle Nurturer':
        return {
          Housing_Type: 'House_No_Yard',
          Has_Kids: 0,
          Time_At_Home: 3,
          Activity_Level: 2,
          Experience_Level: 'Past_Owner',
          Pet_Type_Desired: 'Cat',
        }
      case 'Playful Enthusiast':
        return {
          Housing_Type: 'House_No_Yard',
          Has_Kids: 0,
          Time_At_Home: 1,
          Activity_Level: 3,
          Experience_Level: 'First_Time',
          Pet_Type_Desired: 'Dog',
        }
      case 'Balanced Buddy':
      default:
        return {
          Housing_Type: 'House_No_Yard',
          Has_Kids: 0,
          Time_At_Home: 2,
          Activity_Level: 2,
          Experience_Level: 'Past_Owner',
          Pet_Type_Desired: 'Dog',
        }
    }
  }

  const handleAnswer = (pawsonalityType: string) => {
    const newAnswers = [...answers, pawsonalityType]
    setAnswers(newAnswers)

    if (currentQuestion < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Calculate result (most common type)
      const typeCounts = newAnswers.reduce((acc, type) => {
        acc[type] = (acc[type] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
  const entries = Object.entries(typeCounts as Record<string, number>) as [string, number][]
  const resultType = entries.sort((a, b) => b[1] - a[1])[0][0]
      setResult(resultType)
      // Also call backend to get official pawsonality and description
      setLoading(true)
      setError(null)
      const payload = mapResultToPredictPayload(resultType)
      api
        .predictPawsonality(payload)
        .then((res) => {
          if (res?.status === 'success') {
            setServerPawsonality(res.pawsonality)
            setServerDescription(res.description || '')
          } else {
            setError(res?.message || 'Failed to get prediction')
          }
        })
        .catch((e) => setError(String(e)))
        .finally(() => setLoading(false))
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setResult(null)
    setShowQuiz(false)
  }

  if (!showQuiz && !result) {
    return (
      <section id="quiz" className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-br from-purple-100 to-pink-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 text-gray-800 px-4">
            Discover Your Pawsonality
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 px-4">
            Take our 5-minute quiz to find your perfect pet match powered by AI
          </p>
          <button
            onClick={() => setShowQuiz(true)}
            className="px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-bold text-base sm:text-lg md:text-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          >
            Start Quiz 🎯
          </button>
          
          {/* Preview Types */}
          <div className="mt-8 sm:mt-10 md:mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {Object.entries(PAWSONALITY_TYPES).map(([name, data]) => (
              <div key={name} className="p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="text-3xl sm:text-4xl mb-1.5 sm:mb-2">{data.emoji}</div>
                <p className="text-xs sm:text-sm font-semibold text-gray-800 leading-tight">{name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (result) {
    const displayType = (serverPawsonality || result) as keyof typeof PAWSONALITY_TYPES
    const resultData = PAWSONALITY_TYPES[displayType] || PAWSONALITY_TYPES[result as keyof typeof PAWSONALITY_TYPES]
    return (
      <section id="quiz" className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-br from-purple-100 to-pink-100 min-h-screen flex items-center">
        <div className="max-w-2xl mx-auto text-center w-full">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12">
            <div className="text-5xl sm:text-6xl md:text-8xl mb-4 sm:mb-6 animate-bounce">{resultData?.emoji}</div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-gray-800">You're a</h2>
            <h3 className={`text-3xl sm:text-4xl md:text-5xl font-black mb-4 sm:mb-6 bg-gradient-to-r ${resultData?.color} bg-clip-text text-transparent px-4`}>
              {serverPawsonality || result}!
            </h3>
            {loading ? (
              <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 px-4">Fetching your AI-powered description…</p>
            ) : (
              <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 px-4">{serverDescription || resultData?.description}</p>
            )}
            {error && (
              <p className="text-sm text-red-600 mb-4">{error}</p>
            )}
            
            <div className="space-y-3 sm:space-y-4">
              <button
                onClick={() => document.getElementById('swipe')?.scrollIntoView({ behavior: 'smooth' })}
                className="w-full px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Find Your Perfect Match 🐾
              </button>
              <button
                onClick={resetQuiz}
                className="w-full px-6 sm:px-8 py-3 sm:py-4 bg-gray-100 text-gray-700 rounded-full font-semibold text-base sm:text-lg hover:bg-gray-200 transition-all duration-300"
              >
                Retake Quiz
              </button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="quiz" className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-br from-purple-100 to-pink-100 min-h-screen flex items-center">
      <div className="max-w-2xl mx-auto w-full">
        {/* Progress Bar */}
        <div className="mb-6 sm:mb-8">
          <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-2">
            <span>Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}</span>
            <span>{Math.round(((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
            <div 
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 sm:h-3 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12">
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8 text-gray-800 leading-tight">
            {QUIZ_QUESTIONS[currentQuestion].question}
          </h3>
          
          <div className="space-y-3 sm:space-y-4">
            {QUIZ_QUESTIONS[currentQuestion].options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(option.type)}
                className="w-full p-4 sm:p-5 md:p-6 text-left bg-gray-50 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 rounded-xl sm:rounded-2xl border-2 border-gray-200 hover:border-purple-400 transition-all duration-300 transform hover:scale-[1.02] sm:hover:scale-105 active:scale-95"
              >
                <span className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 leading-snug">{option.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
