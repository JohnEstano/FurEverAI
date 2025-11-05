'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { api } from '@/lib/api'

// Mock pet data - your ML team will provide real data via API
const MOCK_PETS = [
  {
    id: 1,
    name: 'Buddy',
    breed: 'Golden Retriever',
    age: 3,
    image: '🐕',
    compatibility: 92,
    deepMatch: 95,
    traits: ['Friendly', 'Active', 'Family-friendly'],
    description: 'Loves long walks and playing fetch. Great with kids!',
    shelter: 'Happy Paws Shelter'
  },
  {
    id: 2,
    name: 'Luna',
    breed: 'Siamese Cat',
    age: 2,
    image: '🐱',
    compatibility: 88,
    deepMatch: 90,
    traits: ['Independent', 'Calm', 'Apartment-friendly'],
    description: 'Quiet and gentle. Perfect for apartment living.',
    shelter: 'Cozy Cats Rescue'
  },
  {
    id: 3,
    name: 'Max',
    breed: 'Labrador Mix',
    age: 5,
    image: '🦮',
    compatibility: 85,
    deepMatch: 87,
    traits: ['Playful', 'Energetic', 'Social'],
    description: 'Energetic boy who loves to play. Needs active family.',
    shelter: 'Second Chance Shelter'
  },
  {
    id: 4,
    name: 'Whiskers',
    breed: 'Persian Cat',
    age: 4,
    image: '😺',
    compatibility: 78,
    deepMatch: 82,
    traits: ['Gentle', 'Quiet', 'Cuddly'],
    description: 'Loves to cuddle and nap. Very calm temperament.',
    shelter: 'Feline Friends Foundation'
  },
]

export default function SwipeCards() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [liked, setLiked] = useState<number[]>([])
  const [passed, setPassed] = useState<number[]>([])
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [loadingScores, setLoadingScores] = useState(false)
  const [scores, setScores] = useState<Record<number, { compatibility?: number; deepMatch?: number }>>({})
  const [tagsByPet, setTagsByPet] = useState<Record<number, string[]>>({})
  const [error, setError] = useState<string | null>(null)
  const [recsByPet, setRecsByPet] = useState<Record<number, string[]>>({})

  const currentPet = MOCK_PETS[currentIndex]

  // Derive pet profile fields from mock data
  const derivePetProfile = (pet: typeof MOCK_PETS[number]) => {
    const traits = (pet.traits || []).map(t => t.toLowerCase())
    const desc = (pet.description || '').toLowerCase()

    const energetic = traits.some(t => ['energetic', 'active', 'playful'].includes(t))
    const calmish = traits.some(t => ['calm', 'quiet', 'gentle'].includes(t))
    const kids = traits.some(t => t.includes('family')) || desc.includes('kids')

    // Energy: 1 low, 2 medium, 3 high
    const Pet_Energy_Level = energetic ? 3 : calmish ? 1 : 2
    // Kids: 2 great, 1 ok/unknown, 0 no (we'll default to 1 unless clearly family-friendly)
    const Pet_Good_With_Kids = kids ? 2 : 1

    // Size heuristics by breed keywords
    const breed = (pet.breed || '').toLowerCase()
    let Pet_Size: 'Small' | 'Medium' | 'Large' = 'Medium'
    if (/(labrador|retriever|shepherd|husky|rottweiler|mastiff|great dane)/.test(breed)) Pet_Size = 'Large'
    if (/(chihuahua|pomeranian|shihtzu|shih tzu|pug|persian|siamese|cat)/.test(breed)) Pet_Size = 'Small'

    // Grooming needs heuristic
    let Pet_Grooming_Needs: 'Low' | 'Medium' | 'High' = 'Medium'
    if (/(persian|poodle|spitz|long hair|longhair|fluffy)/.test(breed)) Pet_Grooming_Needs = 'High'
    if (/(labrador|beagle|boxer|short hair|shorthair)/.test(breed)) Pet_Grooming_Needs = 'Low'

    return { Pet_Energy_Level, Pet_Good_With_Kids, Pet_Size, Pet_Grooming_Needs }
  }

  // Default adopter profile (could be replaced with real user profile or quiz mapping)
  const adopterProfile = useMemo(() => ({
    Activity_Level: 2,
    Has_Kids: 0,
    Experience_Level: 'Past_Owner' as 'First_Time' | 'Past_Owner' | 'Expert',
  }), [])

  // Fetch scores for the current pet if not already loaded
  useEffect(() => {
    const pet = currentPet
    if (!pet) return
    if (scores[pet.id]) return

    const run = async () => {
      setLoadingScores(true)
      setError(null)
      const petProfile = derivePetProfile(pet)
      const payload = {
        ...adopterProfile,
        Pet_Energy_Level: petProfile.Pet_Energy_Level,
        Pet_Good_With_Kids: petProfile.Pet_Good_With_Kids,
        Pet_Size: petProfile.Pet_Size,
        Pet_Grooming_Needs: petProfile.Pet_Grooming_Needs,
      }
      try {
        const tagPromise = (pet.description && pet.description.trim().length)
          ? api.autoTags({ description: pet.description })
          : Promise.resolve(null as any)
        const [m, d, t] = await Promise.all([
          api.matchScore(payload),
          api.deepMatch(payload),
          tagPromise,
        ])
  setScores((prev: Record<number, { compatibility?: number; deepMatch?: number }>) => ({
          ...prev,
          [pet.id]: {
            compatibility: typeof m?.match_score === 'number' ? m.match_score : undefined,
            deepMatch: typeof d?.deep_match_score === 'number' ? d.deep_match_score : undefined,
          },
        }))
        if (t && Array.isArray(t.tags)) {
          setTagsByPet((prev) => ({ ...prev, [pet.id]: t.tags }))
        }
      } catch (e) {
        setError(String(e))
      } finally {
        setLoadingScores(false)
      }
    }

    run()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex])

  const handleLike = () => {
    if (currentIndex < MOCK_PETS.length) {
      setLiked([...liked, currentPet.id])
      // TODO: Send to API - api.saveLike(currentPet.id)
      nextCard()
    }
  }

  const handlePass = () => {
    if (currentIndex < MOCK_PETS.length) {
      setPassed([...passed, currentPet.id])
      // TODO: Send to API - api.savePass(currentPet.id)
      nextCard()
    }
  }

  const handleRecommend = async () => {
    const pet = currentPet
    if (!pet) return
    try {
      setError(null)
      // Map mock numeric id to a plausible Pet_ID like P0001
      const Pet_ID = `P${String(pet.id).padStart(4, '0')}`
      const res = await api.recommend({ Pet_ID, n_recommendations: 5 })
      if (res && Array.isArray(res.recommended_pet_ids)) {
        setRecsByPet(prev => ({ ...prev, [pet.id]: res.recommended_pet_ids }))
      } else {
        setRecsByPet(prev => ({ ...prev, [pet.id]: [] }))
      }
    } catch (e) {
      setError(String(e))
    }
  }

  const nextCard = () => {
    setTimeout(() => {
      setCurrentIndex(currentIndex + 1)
      setDragOffset({ x: 0, y: 0 })
    }, 300)
  }

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true)
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    setDragStart({ x: clientX, y: clientY })
  }

  const handleDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    setDragOffset({
      x: clientX - dragStart.x,
      y: clientY - dragStart.y
    })
  }

  const handleDragEnd = () => {
    setIsDragging(false)
    if (Math.abs(dragOffset.x) > 100) {
      dragOffset.x > 0 ? handleLike() : handlePass()
    } else {
      setDragOffset({ x: 0, y: 0 })
    }
  }

  if (currentIndex >= MOCK_PETS.length) {
    return (
      <section id="swipe" className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen flex items-center">
        <div className="max-w-md mx-auto text-center w-full">
          <div className="text-5xl sm:text-6xl mb-4 sm:mb-6">🎉</div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-gray-800 px-4">
            That’s All Folks!
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 px-4">
            You’ve reviewed all available pets. Check your matches!
          </p>
          <button
            onClick={() => setCurrentIndex(0)}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all"
          >
            Start Over
          </button>
          <div className="mt-6 sm:mt-8 p-5 sm:p-6 bg-white rounded-xl sm:rounded-2xl shadow-lg">
            <p className="text-base sm:text-lg font-semibold mb-2">Your Likes: {liked.length}</p>
            <p className="text-xs sm:text-sm text-gray-600">We’ll notify you when these pets are available!</p>
          </div>
        </div>
      </section>
    )
  }

  const rotation = dragOffset.x / 20
  const opacity = 1 - Math.abs(dragOffset.x) / 300

  return (
    <section id="swipe" className="py-12 sm:py-16 md:py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <div className="max-w-md mx-auto w-full">
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-1 sm:mb-2 px-4">
            Find Your Match
          </h2>
          <p className="text-sm sm:text-base text-gray-600">Swipe right to like, left to pass</p>
        </div>

        {/* Card Stack */}
        <div className="relative h-[500px] sm:h-[550px] md:h-[600px]">
          {/* Next Card (Background) */}
          {currentIndex + 1 < MOCK_PETS.length && (
            <div className="absolute inset-0 transform scale-95 opacity-50">
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl h-full" />
            </div>
          )}

          {/* Current Card */}
          <div
            className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none"
            style={{
              transform: `translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) rotate(${rotation}deg)`,
              transition: isDragging ? 'none' : 'transform 0.3s ease-out',
              opacity: opacity,
            }}
            onMouseDown={handleDragStart}
            onMouseMove={handleDrag}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            onTouchStart={handleDragStart}
            onTouchMove={handleDrag}
            onTouchEnd={handleDragEnd}
          >
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl h-full overflow-hidden flex flex-col">
              {/* Pet Image */}
              <div className="flex-1 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center relative">
                <div className="text-[120px] sm:text-[160px] md:text-[200px]">{currentPet.image}</div>
                
                {/* Overlay indicators */}
                {dragOffset.x > 50 && (
                  <div className="absolute top-4 sm:top-6 md:top-8 right-4 sm:right-6 md:right-8 bg-green-500 text-white px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full font-bold text-lg sm:text-xl md:text-2xl transform rotate-12">
                    LIKE ❤️
                  </div>
                )}
                {dragOffset.x < -50 && (
                  <div className="absolute top-4 sm:top-6 md:top-8 left-4 sm:left-6 md:left-8 bg-red-500 text-white px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full font-bold text-lg sm:text-xl md:text-2xl transform -rotate-12">
                    PASS ✖️
                  </div>
                )}
              </div>

              {/* Pet Info */}
              <div className="p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4">
                <div>
                  <h3 className="text-2xl sm:text-2xl md:text-3xl font-bold text-gray-800">{currentPet.name}</h3>
                  <p className="text-sm sm:text-base text-gray-600">{currentPet.breed} • {currentPet.age} years old</p>
                </div>

                {/* Compatibility Scores */}
                <div className="flex gap-3 sm:gap-4">
                  <div className="flex-1 bg-purple-100 rounded-lg sm:rounded-xl p-2.5 sm:p-3 text-center">
                    <p className="text-2xl sm:text-2xl md:text-3xl font-bold text-purple-600">
                      {scores[currentPet.id]?.compatibility ?? (loadingScores ? '…' : `${currentPet.compatibility}`)}%
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-600">Match Score</p>
                  </div>
                  <div className="flex-1 bg-pink-100 rounded-lg sm:rounded-xl p-2.5 sm:p-3 text-center">
                    <p className="text-2xl sm:text-2xl md:text-3xl font-bold text-pink-600">
                      {scores[currentPet.id]?.deepMatch ?? (loadingScores ? '…' : `${currentPet.deepMatch}`)}%
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-600">AI DeepMatch</p>
                  </div>
                </div>

                {error && (
                  <p className="text-xs text-red-600">{error}</p>
                )}

                {/* Traits */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {currentPet.traits.map((trait, idx) => (
                    <span key={idx} className="px-2.5 sm:px-3 py-1 bg-gray-100 rounded-full text-xs sm:text-sm text-gray-700">
                      {trait}
                    </span>
                  ))}
                </div>

                {/* AI Tags */}
                {tagsByPet[currentPet.id]?.length ? (
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {tagsByPet[currentPet.id].map((tag: string, idx: number) => (
                      <span key={idx} className="px-2.5 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs sm:text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                ) : null}

                {/* KNN Recommendations (button + results) */}
                <div className="pt-2 sm:pt-3">
                  <button
                    onClick={handleRecommend}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full text-xs sm:text-sm shadow-sm"
                  >
                    Similar Pets (KNN)
                  </button>
                  {recsByPet[currentPet.id] && recsByPet[currentPet.id].length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-1.5 sm:gap-2">
                      {recsByPet[currentPet.id].map((pid) => (
                        <span key={pid} className="px-2.5 sm:px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs sm:text-sm">
                          {pid}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>

                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">{currentPet.description}</p>
                <p className="text-gray-400 text-[10px] sm:text-xs">📍 {currentPet.shelter}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 sm:gap-6 mt-6 sm:mt-8">
          <button
            onClick={handlePass}
            className="w-14 h-14 sm:w-16 sm:h-16 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center text-xl sm:text-2xl"
          >
            ✖️
          </button>
          <button
            onClick={handleLike}
            className="w-16 h-16 sm:w-20 sm:h-20 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center text-2xl sm:text-3xl"
          >
            ❤️
          </button>
        </div>

        {/* Progress */}
        <div className="text-center mt-4 sm:mt-6 text-sm sm:text-base text-gray-600">
          {currentIndex + 1} / {MOCK_PETS.length}
        </div>
      </div>
    </section>
  )
}
