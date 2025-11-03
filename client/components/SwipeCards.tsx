'use client'
import React, { useState } from 'react'

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

  const currentPet = MOCK_PETS[currentIndex]

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
      <section id="swipe" className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen flex items-center">
        <div className="max-w-md mx-auto text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-4xl font-bold mb-4 text-gray-800">That's All Folks!</h2>
          <p className="text-xl text-gray-600 mb-8">
            You've reviewed all available pets. Check your matches!
          </p>
          <button
            onClick={() => setCurrentIndex(0)}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            Start Over
          </button>
          <div className="mt-8 p-6 bg-white rounded-2xl shadow-lg">
            <p className="text-lg font-semibold mb-2">Your Likes: {liked.length}</p>
            <p className="text-sm text-gray-600">We'll notify you when these pets are available!</p>
          </div>
        </div>
      </section>
    )
  }

  const rotation = dragOffset.x / 20
  const opacity = 1 - Math.abs(dragOffset.x) / 300

  return (
    <section id="swipe" className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">Find Your Match</h2>
          <p className="text-gray-600">Swipe right to like, left to pass</p>
        </div>

        {/* Card Stack */}
        <div className="relative h-[600px]">
          {/* Next Card (Background) */}
          {currentIndex + 1 < MOCK_PETS.length && (
            <div className="absolute inset-0 transform scale-95 opacity-50">
              <div className="bg-white rounded-3xl shadow-xl h-full" />
            </div>
          )}

          {/* Current Card */}
          <div
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
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
            <div className="bg-white rounded-3xl shadow-2xl h-full overflow-hidden flex flex-col">
              {/* Pet Image */}
              <div className="flex-1 bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center relative">
                <div className="text-[200px]">{currentPet.image}</div>
                
                {/* Overlay indicators */}
                {dragOffset.x > 50 && (
                  <div className="absolute top-8 right-8 bg-green-500 text-white px-6 py-3 rounded-full font-bold text-2xl transform rotate-12">
                    LIKE ❤️
                  </div>
                )}
                {dragOffset.x < -50 && (
                  <div className="absolute top-8 left-8 bg-red-500 text-white px-6 py-3 rounded-full font-bold text-2xl transform -rotate-12">
                    PASS ✖️
                  </div>
                )}
              </div>

              {/* Pet Info */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-3xl font-bold text-gray-800">{currentPet.name}</h3>
                  <p className="text-gray-600">{currentPet.breed} • {currentPet.age} years old</p>
                </div>

                {/* Compatibility Scores */}
                <div className="flex gap-4">
                  <div className="flex-1 bg-purple-100 rounded-xl p-3 text-center">
                    <p className="text-3xl font-bold text-purple-600">{currentPet.compatibility}%</p>
                    <p className="text-xs text-gray-600">Match Score</p>
                  </div>
                  <div className="flex-1 bg-pink-100 rounded-xl p-3 text-center">
                    <p className="text-3xl font-bold text-pink-600">{currentPet.deepMatch}%</p>
                    <p className="text-xs text-gray-600">AI DeepMatch</p>
                  </div>
                </div>

                {/* Traits */}
                <div className="flex flex-wrap gap-2">
                  {currentPet.traits.map((trait, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                      {trait}
                    </span>
                  ))}
                </div>

                <p className="text-gray-600 text-sm">{currentPet.description}</p>
                <p className="text-gray-400 text-xs">📍 {currentPet.shelter}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-6 mt-8">
          <button
            onClick={handlePass}
            className="w-16 h-16 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center text-2xl"
          >
            ✖️
          </button>
          <button
            onClick={handleLike}
            className="w-20 h-20 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center text-3xl"
          >
            ❤️
          </button>
        </div>

        {/* Progress */}
        <div className="text-center mt-6 text-gray-600">
          {currentIndex + 1} / {MOCK_PETS.length}
        </div>
      </div>
    </section>
  )
}
