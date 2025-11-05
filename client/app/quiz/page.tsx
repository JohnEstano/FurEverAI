'use client'
import { useState, useMemo, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check, Sparkles } from 'lucide-react'
import { api } from '@/lib/api'
import { motion, AnimatePresence } from 'motion/react'
import { Confetti, type ConfettiRef } from '@/components/ui/confetti'

const PAWSONALITY_TYPES = {
  'Active Adventurer': { emoji: '🏃‍♂️', description: 'High energy lifestyle, loves outdoor activities and athletic dogs' },
  'Cozy Homebody': { emoji: '🏠', description: 'Prefers relaxing at home with calm, cuddly companions' },
  'Social Butterfly': { emoji: '🎉', description: 'Outgoing personality, seeks friendly pets for social gatherings' },
  'Experienced Guardian': { emoji: '🛡️', description: 'Confident with large/challenging breeds, strong leadership' },
  'First-Time Friend': { emoji: '🌟', description: 'New to pets, needs easy-going and low-maintenance companions' },
  'Patient Nurturer': { emoji: '💝', description: 'Caring soul perfect for special needs or senior pets' },
}

const QUIZ_QUESTIONS = [
  {
    question: "What's your ideal weekend?",
    options: [
      { text: "Hiking, running, or outdoor sports", type: 'Active Adventurer' },
      { text: "Netflix marathon and couch time", type: 'Cozy Homebody' },
      { text: "Parties, gatherings, or social events", type: 'Social Butterfly' },
      { text: "Quiet time alone or with close friends", type: 'Cozy Homebody' },
    ]
  },
  {
    question: "Your energy level is:",
    options: [
      { text: "Very high - always on the move!", type: 'Active Adventurer' },
      { text: "Low to moderate - prefer relaxing", type: 'Cozy Homebody' },
      { text: "Social energy - love people time", type: 'Social Butterfly' },
      { text: "Balanced - depends on the day", type: 'First-Time Friend' },
    ]
  },
  {
    question: "Have you owned pets before?",
    options: [
      { text: "Yes, large/challenging breeds", type: 'Experienced Guardian' },
      { text: "Yes, easy-going pets", type: 'Social Butterfly' },
      { text: "A little experience", type: 'First-Time Friend' },
      { text: "No, this is my first pet", type: 'First-Time Friend' },
    ]
  },
  {
    question: "What's your living space like?",
    options: [
      { text: "Big house with yard - lots of space", type: 'Experienced Guardian' },
      { text: "Apartment - cozy and compact", type: 'Cozy Homebody' },
      { text: "Home with friends/family around", type: 'Social Butterfly' },
      { text: "Average home, flexible setup", type: 'First-Time Friend' },
    ]
  },
  {
    question: "How much time will you spend with your pet?",
    options: [
      { text: "All the time - I'm home a lot", type: 'Patient Nurturer' },
      { text: "Evenings and weekends", type: 'First-Time Friend' },
      { text: "Active outings together daily", type: 'Active Adventurer' },
      { text: "Quality cuddle time whenever", type: 'Cozy Homebody' },
    ]
  },
  {
    question: "What kind of pet personality do you want?",
    options: [
      { text: "High energy, playful, athletic", type: 'Active Adventurer' },
      { text: "Calm, gentle, affectionate", type: 'Cozy Homebody' },
      { text: "Friendly, outgoing, social", type: 'Social Butterfly' },
      { text: "Independent or special needs", type: 'Patient Nurturer' },
    ]
  },
  {
    question: "Can you handle training challenges?",
    options: [
      { text: "Yes! I love training strong dogs", type: 'Experienced Guardian' },
      { text: "Prefer already-trained pets", type: 'Cozy Homebody' },
      { text: "Basic training is fine", type: 'First-Time Friend' },
      { text: "Patient with special behavioral needs", type: 'Patient Nurturer' },
    ]
  },
  {
    question: "What size pet are you thinking?",
    options: [
      { text: "Large or extra large breeds", type: 'Experienced Guardian' },
      { text: "Small, easy to manage", type: 'Cozy Homebody' },
      { text: "Medium - good balance", type: 'First-Time Friend' },
      { text: "Any size, I'm flexible", type: 'Patient Nurturer' },
    ]
  },
  {
    question: "How do you feel about grooming?",
    options: [
      { text: "Don't mind high maintenance", type: 'Patient Nurturer' },
      { text: "Prefer low grooming needs", type: 'Active Adventurer' },
      { text: "Okay with regular grooming", type: 'Social Butterfly' },
      { text: "Want minimal grooming", type: 'First-Time Friend' },
    ]
  },
  {
    question: "What matters most to you?",
    options: [
      { text: "A companion for adventures", type: 'Active Adventurer' },
      { text: "A cuddle buddy for home", type: 'Cozy Homebody' },
      { text: "A friendly social pet", type: 'Social Butterfly' },
      { text: "Giving a pet a second chance", type: 'Patient Nurturer' },
    ]
  },
]

export default function QuizPage() {
  const router = useRouter()
  const confettiRef = useRef<ConfettiRef>(null)
  const [showIntro, setShowIntro] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [result, setResult] = useState<string | null>(null)
  const [serverPawsonality, setServerPawsonality] = useState<string | null>(null)
  const [serverDescription, setServerDescription] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Progress messages
  const getProgressMessage = () => {
    const progress = ((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100
    if (progress <= 10) return "Great start!"
    if (progress <= 30) return "Keep going!"
    if (progress <= 50) return "Halfway there!"
    if (progress <= 70) return "Doing great!"
    if (progress <= 90) return "Almost there!"
    return "Final question!"
  }

  // Fire confetti when result is shown
  useEffect(() => {
    if (result && confettiRef.current) {
      setTimeout(() => {
        confettiRef.current?.fire({})
      }, 500)
    }
  }, [result])

  // Map quiz result into backend payload for /api/predict
  const mapResultToPredictPayload = (type: string) => {
    switch (type) {
      case 'Active Adventurer':
        return {
          Housing_Type: 'House_Yard',
          Has_Kids: 0,
          Time_At_Home: 1,
          Activity_Level: 3,
          Experience_Level: 'Past_Owner',
          Pet_Type_Desired: 'Dog',
        }
      case 'Cozy Homebody':
        return {
          Housing_Type: 'Apartment',
          Has_Kids: 0,
          Time_At_Home: 3,
          Activity_Level: 1,
          Experience_Level: 'Past_Owner',
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
      case 'Experienced Guardian':
        return {
          Housing_Type: 'House_Yard',
          Has_Kids: 0,
          Time_At_Home: 2,
          Activity_Level: 3,
          Experience_Level: 'Expert',
          Pet_Type_Desired: 'Dog',
        }
      case 'First-Time Friend':
        return {
          Housing_Type: 'Apartment',
          Has_Kids: 0,
          Time_At_Home: 2,
          Activity_Level: 2,
          Experience_Level: 'First_Time',
          Pet_Type_Desired: 'Cat',
        }
      case 'Patient Nurturer':
        return {
          Housing_Type: 'House_No_Yard',
          Has_Kids: 0,
          Time_At_Home: 3,
          Activity_Level: 1,
          Experience_Level: 'Past_Owner',
          Pet_Type_Desired: 'Cat',
        }
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
      
      // Call backend to get official pawsonality and description
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
    setServerPawsonality(null)
    setServerDescription('')
    setLoading(false)
    setError(null)
    setShowIntro(true)
  }

  const handleBack = () => {
    if (result) {
      resetQuiz()
    } else if (showIntro) {
      router.push('/')
    } else if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setAnswers(answers.slice(0, -1))
    } else {
      setShowIntro(true)
    }
  }

  const handleContinueToBrowse = () => {
    // Persist adopter profile so /browse can compute real scores
    try {
      const payload = mapResultToPredictPayload(result || 'Balanced Buddy')
      window.localStorage.setItem('adopterProfile', JSON.stringify(payload))
    } catch {}
    router.push('/browse')
  }

  // Intro Page
  if (showIntro) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg w-full"
        >
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="mb-6 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>

          {/* Intro Content */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-600 mb-6"
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-gray-900 mb-4"
            >
              Discover Your Pawsonality
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-base text-gray-600 mb-8 leading-relaxed"
            >
              We'll ask you 10 fun questions to understand your lifestyle, preferences, and what makes you unique. 
              Answer honestly, there are no wrong answers! This helps us find your perfect furry companion.
            </motion.p>

         

            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowIntro(false)}
              className="w-full py-4 bg-blue-600 text-white rounded-full text-base font-medium hover:bg-blue-700 transition-colors shadow-lg"
            >
              Start Quiz
            </motion.button>
          </div>
        </motion.div>
      </div>
    )
  }

  // Result Page
  if (result) {
    const displayType = (serverPawsonality || result) as keyof typeof PAWSONALITY_TYPES
    const resultData = PAWSONALITY_TYPES[displayType] || PAWSONALITY_TYPES[result as keyof typeof PAWSONALITY_TYPES]
    
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8 relative overflow-hidden">
        {/* Confetti */}
        <Confetti
          ref={confettiRef}
          className="absolute top-0 left-0 z-0 size-full"
        />

        <div className="max-w-md w-full relative z-10">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="mb-6 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>

          {/* Result Card */}
          <div className="bg-white border border-gray-200 rounded-3xl p-8 text-center">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="text-6xl mb-4"
            >
              {resultData?.emoji}
            </motion.div>
            
            <h2 className="text-sm font-medium text-gray-500 mb-2">Your Pawsonality</h2>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {serverPawsonality || result}
            </h3>
            
            {loading ? (
              <p className="text-sm text-gray-600 mb-6">Loading...</p>
            ) : (
              <p className="text-sm text-gray-600 mb-6">
                {serverDescription || resultData?.description}
              </p>
            )}
            
            {error && (
              <p className="text-xs text-red-600 mb-4">{error}</p>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleContinueToBrowse}
                className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Find Your Match
              </button>
              <button
                onClick={resetQuiz}
                className="w-full py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Retake Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Quiz Page
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
      <div className="max-w-lg w-full">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="mb-6 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500">
              Question {currentQuestion + 1} of {QUIZ_QUESTIONS.length}
            </span>
            <motion.span 
              key={getProgressMessage()}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xs font-semibold text-blue-600"
            >
              {getProgressMessage()}
            </motion.span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <motion.div 
              animate={{ width: `${((currentQuestion + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="bg-blue-600 h-2 rounded-full"
            />
          </div>
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-blue-600 rounded-2xl p-8 mb-6"
          >
            <h3 className="text-lg font-semibold text-white text-center leading-relaxed">
              {QUIZ_QUESTIONS[currentQuestion].question}
            </h3>
          </motion.div>
        </AnimatePresence>

        {/* Options */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentQuestion}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {QUIZ_QUESTIONS[currentQuestion].options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(option.type)}
                className="w-full p-4 text-left bg-white border-2 border-gray-200 rounded-xl hover:border-blue-600 hover:bg-blue-50 transition-colors duration-150 text-sm font-medium text-gray-700"
              >
                {option.text}
              </button>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
