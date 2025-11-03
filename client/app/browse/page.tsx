'use client'
import React, { useState } from 'react'
import Navbar from '@/components/Navbar'
import { Heart, X, MapPin, Info } from 'lucide-react'
import Image from 'next/image'

// Mock pet data with real images
const PETS = [
  {
    id: 1,
    name: 'Buddy',
    age: { years: 3, months: 2 },
    breed: 'Golden Retriever',
    image: '/images/entries/a1.jpg',
    location: 'San Francisco, CA',
    shelter: 'Happy Paws Shelter',
    compatibility: 92,
    deepMatch: 95,
    traits: ['Friendly', 'Active', 'Loyal', 'Playful'],
    characteristics: ['Good with kids', 'House trained', 'Vaccinated', 'Neutered'],
    size: 'Large',
    energy: 'High',
    description: 'Meet Buddy, the most lovable Golden Retriever you\'ll ever meet! Buddy is an energetic and friendly boy who absolutely adores people. He loves long walks in the park, playing fetch, and swimming. Buddy is great with children and would make an excellent family companion. He\'s house trained, up to date on all vaccinations, and has completed basic obedience training. Buddy would thrive in an active household with a yard where he can run and play. He gets along well with other dogs and would love to have a canine companion.',
    personality: 'Buddy is the definition of a happy-go-lucky dog. He wakes up every morning with his tail wagging, ready to greet the day with enthusiasm. He\'s affectionate, loyal, and loves to be around his humans. Whether it\'s hiking, running, or just lounging on the couch after a long day of adventures, Buddy is the perfect companion.',
    idealHome: 'Active family with a yard, experience with large breeds preferred. Buddy needs at least 1-2 hours of exercise daily and would do best with someone who enjoys outdoor activities.',
    medicalHistory: 'Healthy, all vaccinations current, neutered, microchipped',
  },
  {
    id: 2,
    name: 'Luna',
    age: { years: 2, months: 5 },
    breed: 'Siamese Mix',
    image: '/images/entries/a2.jpg',
    location: 'Oakland, CA',
    shelter: 'Cozy Cats Rescue',
    compatibility: 88,
    deepMatch: 90,
    traits: ['Independent', 'Calm', 'Affectionate', 'Quiet'],
    characteristics: ['Litter trained', 'Indoor only', 'Vaccinated', 'Spayed'],
    size: 'Medium',
    energy: 'Low-Medium',
    description: 'Luna is a beautiful Siamese mix with striking blue eyes and a gentle personality. She\'s the perfect apartment cat - quiet, clean, and independent. Luna enjoys her alone time but also loves to cuddle on her own terms. She\'s fascinated by windows and will spend hours watching birds and enjoying the sunshine. Luna is fully litter trained and has impeccable house manners.',
    personality: 'Luna has an elegant and sophisticated demeanor. She\'s not overly demanding but appreciates attention when she wants it. She communicates with soft chirps and purrs, and has a calming presence that makes her the perfect companion for someone who works from home or enjoys quiet evenings.',
    idealHome: 'Quiet apartment or home, single person or couple, no young children. Luna would do best as an only pet where she can be the queen of her domain.',
    medicalHistory: 'Healthy, all vaccinations current, spayed, microchipped',
  },
  {
    id: 3,
    name: 'Max',
    age: { years: 5, months: 0 },
    breed: 'Labrador Mix',
    image: '/images/entries/a3.jpg',
    location: 'Berkeley, CA',
    shelter: 'Second Chance Shelter',
    compatibility: 85,
    deepMatch: 87,
    traits: ['Playful', 'Energetic', 'Social', 'Smart'],
    characteristics: ['Good with dogs', 'Leash trained', 'Vaccinated', 'Neutered'],
    size: 'Large',
    energy: 'High',
    description: 'Max is an energetic Labrador mix who loves life and everyone in it! This handsome boy is always ready for an adventure, whether it\'s a hike, a trip to the dog park, or a game of fetch. Max is highly intelligent and knows several commands. He walks well on a leash and has great manners. Max gets along wonderfully with other dogs and would love to have a playmate.',
    personality: 'Max is the social butterfly of the shelter! He greets everyone with a wagging tail and a happy smile. He\'s incredibly food-motivated which makes training a breeze. Max is loyal, loving, and always wants to be where the action is. He\'d be your perfect workout buddy and adventure companion.',
    idealHome: 'Active individual or family, home with a yard preferred. Max needs daily exercise and mental stimulation. Experience with energetic breeds is a plus.',
    medicalHistory: 'Healthy, all vaccinations current, neutered, microchipped',
  },
  {
    id: 4,
    name: 'Whiskers',
    age: { years: 4, months: 3 },
    breed: 'Persian',
    image: '/images/entries/a4.jpg',
    location: 'San Jose, CA',
    shelter: 'Feline Friends Foundation',
    compatibility: 78,
    deepMatch: 82,
    traits: ['Gentle', 'Quiet', 'Cuddly', 'Laid-back'],
    characteristics: ['Indoor only', 'Grooming required', 'Vaccinated', 'Neutered'],
    size: 'Medium',
    energy: 'Low',
    description: 'Whiskers is a gorgeous Persian cat with a luxurious coat and the sweetest temperament. He\'s the ultimate lap cat who loves nothing more than being brushed and pampered. Whiskers is quiet, gentle, and perfect for someone who wants a calm, affectionate companion. He does require regular grooming to keep his beautiful coat in top condition.',
    personality: 'Whiskers is the definition of a gentle soul. He moves through life at a peaceful pace, finding joy in simple pleasures like sunbeams, soft blankets, and gentle pets. He has a quiet voice and will softly meow when he wants attention. Whiskers is perfect for someone who appreciates a calm, serene companion.',
    idealHome: 'Quiet home, someone who enjoys grooming and can commit to regular coat maintenance. Whiskers would do best in a calm environment without young children or other pets.',
    medicalHistory: 'Healthy, all vaccinations current, neutered, microchipped. Requires regular grooming.',
  },
  {
    id: 5,
    name: 'Charlie',
    age: { years: 1, months: 8 },
    breed: 'Beagle',
    image: '/images/entries/a5.jpg',
    location: 'Palo Alto, CA',
    shelter: 'Happy Tails Rescue',
    compatibility: 90,
    deepMatch: 93,
    traits: ['Curious', 'Friendly', 'Vocal', 'Adventurous'],
    characteristics: ['Good with kids', 'Good with dogs', 'Vaccinated', 'Neutered'],
    size: 'Medium',
    energy: 'High',
    description: 'Charlie is an adorable Beagle puppy with the classic hound dog personality - curious, friendly, and always following his nose! He\'s young and energetic, always ready to explore and discover new things. Charlie gets along great with kids and other dogs, making him an ideal family pet. He\'s still learning commands and would benefit from continued training.',
    personality: 'Charlie is a bundle of joy and mischief! He\'s incredibly curious and loves to investigate every smell and sound. True to his Beagle nature, he can be vocal and loves to "talk" to his humans. Charlie is affectionate, playful, and always up for an adventure. He bonds quickly with his family and is loyal to the core.',
    idealHome: 'Active family with children, preferably with a fenced yard. Someone patient with training and willing to provide mental stimulation. Beagle experience is a plus.',
    medicalHistory: 'Healthy, all vaccinations current, neutered, microchipped',
  },
  {
    id: 6,
    name: 'Bella',
    age: { years: 6, months: 0 },
    breed: 'Tabby Cat',
    image: '/images/entries/a6.jpg',
    location: 'Fremont, CA',
    shelter: 'Purr-fect Companions',
    compatibility: 86,
    deepMatch: 88,
    traits: ['Sweet', 'Gentle', 'Mature', 'Loving'],
    characteristics: ['Good with cats', 'Litter trained', 'Vaccinated', 'Spayed'],
    size: 'Medium',
    energy: 'Low-Medium',
    description: 'Bella is a mature, sweet-natured tabby who has so much love to give. She\'s calm, well-behaved, and knows what she wants - a cozy home where she can spend her golden years being loved and pampered. Bella gets along well with other cats and would do fine in a multi-cat household. She\'s the perfect companion for someone who wants a low-maintenance, affectionate friend.',
    personality: 'Bella has wisdom in her eyes and a gentle soul. She\'s past her wild kitten days and enjoys the simpler things in life - a warm lap, a gentle pet, and a quiet home. She\'s incredibly affectionate once she trusts you and will follow you around the house, always wanting to be near her favorite human.',
    idealHome: 'Quiet home, older couple or individual preferred. Bella would thrive with someone who is home often and can provide the attention she craves. She would do well with other calm cats.',
    medicalHistory: 'Healthy for her age, all vaccinations current, spayed, microchipped',
  },
]

export default function BrowsePage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [liked, setLiked] = useState<number[]>([])
  const [passed, setPassed] = useState<number[]>([])
  const [showDetails, setShowDetails] = useState(false)

  const currentPet = PETS[currentIndex]

  const handleLike = () => {
    if (currentIndex < PETS.length) {
      setLiked([...liked, currentPet.id])
      nextCard()
    }
  }

  const handlePass = () => {
    if (currentIndex < PETS.length) {
      setPassed([...passed, currentPet.id])
      nextCard()
    }
  }

  const nextCard = () => {
    setDragOffset({ x: 0, y: 0 })
    setShowDetails(false)
    setTimeout(() => {
      setCurrentIndex(currentIndex + 1)
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
    if (Math.abs(dragOffset.x) > 150) {
      dragOffset.x > 0 ? handleLike() : handlePass()
    } else {
      setDragOffset({ x: 0, y: 0 })
    }
  }

  if (currentIndex >= PETS.length) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="pt-20 min-h-screen flex items-center justify-center px-4">
          <div className="max-w-lg text-center">
            <div className="text-8xl mb-6">🎉</div>
            <h2 className="text-4xl font-bold mb-4 text-gray-900">You've seen all pets!</h2>
            <p className="text-xl text-gray-600 mb-8">
              Check back soon for more adorable companions looking for homes.
            </p>
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
              <p className="text-lg font-semibold text-gray-900 mb-2">
                ❤️ Liked: {liked.length} pets
              </p>
              <p className="text-sm text-gray-600">
                We've saved your matches. Contact the shelters to meet your potential new friends!
              </p>
            </div>
            <button
              onClick={() => {
                setCurrentIndex(0)
                setLiked([])
                setPassed([])
              }}
              className="px-8 py-3 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors"
            >
              Browse Again
            </button>
          </div>
        </div>
      </main>
    )
  }

  const rotation = dragOffset.x / 30
  const opacity = 1 - Math.abs(dragOffset.x) / 400

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 pb-8 px-4 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Your Perfect Match</h1>
            <p className="text-gray-600">
              {currentIndex + 1} / {PETS.length}
            </p>
          </div>

          {/* Main Card Container */}
          <div className="relative">
            {/* Card Stack Effect - Next card in background */}
            {currentIndex + 1 < PETS.length && (
              <div className="absolute inset-0 transform scale-95 opacity-30 pointer-events-none">
                <div className="bg-white rounded-3xl shadow-xl h-[85vh]" />
              </div>
            )}

            {/* Current Card */}
            <div
              className="relative cursor-grab active:cursor-grabbing"
              style={{
                transform: `translateX(${dragOffset.x}px) rotate(${rotation}deg)`,
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
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden h-[85vh] flex">
                {/* Image Section - Left Side */}
                <div className="w-1/2 relative">
                  <div className="absolute inset-0">
                    <Image
                      src={currentPet.image}
                      alt={currentPet.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>

                  {/* Overlay indicators */}
                  {dragOffset.x > 50 && (
                    <div className="absolute top-8 right-8 bg-green-500 text-white px-8 py-4 rounded-2xl font-bold text-3xl transform rotate-12 shadow-2xl">
                      LIKE ❤️
                    </div>
                  )}
                  {dragOffset.x < -50 && (
                    <div className="absolute top-8 left-8 bg-red-500 text-white px-8 py-4 rounded-2xl font-bold text-3xl transform -rotate-12 shadow-2xl">
                      PASS ✖️
                    </div>
                  )}

                  {/* Info Overlay on Image */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-8">
                    <h2 className="text-5xl font-bold text-white mb-2">
                      {currentPet.name}, {currentPet.age.years}
                      {currentPet.age.months > 0 && `.${currentPet.age.months}`}
                    </h2>
                    <p className="text-xl text-white/90 mb-4">{currentPet.breed}</p>
                    
                    <div className="flex items-center gap-2 text-white/90 mb-4">
                      <MapPin className="w-5 h-5" />
                      <span className="text-lg">{currentPet.location}</span>
                    </div>

                    {/* Traits */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {currentPet.traits.map((trait, idx) => (
                        <span 
                          key={idx} 
                          className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm text-white font-medium border border-white/30"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>

                    {/* Characteristics */}
                    <div className="flex flex-wrap gap-2">
                      {currentPet.characteristics.map((char, idx) => (
                        <span 
                          key={idx} 
                          className="px-4 py-2 bg-blue-500/30 backdrop-blur-sm rounded-full text-sm text-white font-medium border border-blue-300/30"
                        >
                          {char}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Details Section - Right Side */}
                <div className="w-1/2 overflow-y-auto p-8">
                  {/* Compatibility Scores */}
                  <div className="flex gap-4 mb-6">
                    <div className="flex-1 bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl p-4 text-center border border-purple-200">
                      <p className="text-4xl font-bold text-purple-600">{currentPet.compatibility}%</p>
                      <p className="text-sm text-gray-600 font-medium">Match Score</p>
                    </div>
                    <div className="flex-1 bg-gradient-to-br from-pink-100 to-pink-50 rounded-2xl p-4 text-center border border-pink-200">
                      <p className="text-4xl font-bold text-pink-600">{currentPet.deepMatch}%</p>
                      <p className="text-sm text-gray-600 font-medium">AI DeepMatch</p>
                    </div>
                  </div>

                  {/* Quick Info */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">Size</p>
                      <p className="font-semibold text-gray-900">{currentPet.size}</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <p className="text-sm text-gray-600 mb-1">Energy Level</p>
                      <p className="font-semibold text-gray-900">{currentPet.energy}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Info className="w-5 h-5" />
                      About {currentPet.name}
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {currentPet.description}
                    </p>
                  </div>

                  {/* Personality */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Personality</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {currentPet.personality}
                    </p>
                  </div>

                  {/* Ideal Home */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Ideal Home</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {currentPet.idealHome}
                    </p>
                  </div>

                  {/* Medical History */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Medical History</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {currentPet.medicalHistory}
                    </p>
                  </div>

                  {/* Shelter Info */}
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                    <p className="text-sm text-gray-600 mb-1">Available at</p>
                    <p className="font-semibold text-gray-900">{currentPet.shelter}</p>
                    <p className="text-sm text-gray-600 mt-1">{currentPet.location}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-8 mt-8">
            <button
              onClick={handlePass}
              className="w-16 h-16 bg-white border-4 border-red-500 text-red-500 rounded-full shadow-lg hover:bg-red-500 hover:text-white transform hover:scale-110 transition-all duration-200 flex items-center justify-center"
              title="Pass"
            >
              <X className="w-8 h-8" strokeWidth={3} />
            </button>
            <button
              onClick={handleLike}
              className="w-20 h-20 bg-white border-4 border-green-500 text-green-500 rounded-full shadow-lg hover:bg-green-500 hover:text-white transform hover:scale-110 transition-all duration-200 flex items-center justify-center"
              title="Like"
            >
              <Heart className="w-10 h-10" strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
