'use client'
import React, { useEffect, useState, useRef } from 'react'
import { Heart, Info, MapPin, Phone, Mail, User, ArrowLeft, ChevronUp, ChevronDown, Plus } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { NumberTicker } from '@/components/ui/number-ticker'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"

const PAWSONALITY_TYPES = {
  'Active Adventurer': { emoji: '🏃‍♂️', description: 'High energy lifestyle, loves outdoor activities and athletic dogs' },
  'Cozy Homebody': { emoji: '🏠', description: 'Prefers relaxing at home with calm, cuddly companions' },
  'Social Butterfly': { emoji: '🎉', description: 'Outgoing personality, seeks friendly pets for social gatherings' },
  'Experienced Guardian': { emoji: '🛡️', description: 'Confident with large/challenging breeds, strong leadership' },
  'First-Time Friend': { emoji: '🌟', description: 'New to pets, needs easy-going and low-maintenance companions' },
  'Patient Nurturer': { emoji: '💝', description: 'Caring soul perfect for special needs or senior pets' },
}

// Mock pet data
const PETS = [
  {
    id: 1,
    name: 'Buddy',
    age: { years: 3, months: 2 },
    breed: 'Golden Retriever',
    image: '/images/entries/a1.jpg',
    location: 'San Francisco, CA',
    shelter: 'Happy Paws Shelter',
    shelterContact: {
      phone: '(415) 555-0123',
      email: 'contact@happypaws.org',
      contactPerson: 'Sarah Johnson'
    },
    compatibility: 92,
    deepMatch: 95,
    distance: '3.5 Km Away',
    traits: ['Friendly', 'Active', 'Loyal', 'Playful'],
    characteristics: ['Good with kids', 'House trained', 'Vaccinated', 'Neutered'],
    size: 'Large',
    energy: 'High',
    description: 'Meet Buddy, the most lovable Golden Retriever you\'ll ever meet! Buddy is an energetic and friendly boy who absolutely adores people. He loves long walks in the park, playing fetch, and swimming. Buddy is great with children and would make an excellent family companion.',
    personality: 'Buddy is the definition of a happy-go-lucky dog. He wakes up every morning with his tail wagging, ready to greet the day with enthusiasm. He\'s affectionate, loyal, and loves to be around his humans.',
    idealHome: 'Active family with a yard, experience with large breeds preferred. Buddy needs at least 1-2 hours of exercise daily.',
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
    shelterContact: {
      phone: '(510) 555-0456',
      email: 'info@cozycats.org',
      contactPerson: 'Michael Chen'
    },
    compatibility: 88,
    deepMatch: 90,
    distance: '5.2 Km Away',
    traits: ['Independent', 'Calm', 'Affectionate', 'Quiet'],
    characteristics: ['Litter trained', 'Indoor only', 'Vaccinated', 'Spayed'],
    size: 'Medium',
    energy: 'Low-Medium',
    description: 'Luna is a beautiful Siamese mix with striking blue eyes and a gentle personality. She\'s the perfect apartment cat - quiet, clean, and independent.',
    personality: 'Luna has an elegant and sophisticated demeanor. She\'s not overly demanding but appreciates attention when she wants it.',
    idealHome: 'Quiet apartment or home, single person or couple, no young children. Luna would do best as an only pet.',
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
    shelterContact: {
      phone: '(510) 555-0789',
      email: 'adopt@secondchance.org',
      contactPerson: 'Emily Rodriguez'
    },
    compatibility: 85,
    deepMatch: 87,
    distance: '2.8 Km Away',
    traits: ['Playful', 'Energetic', 'Social', 'Smart'],
    characteristics: ['Good with dogs', 'Leash trained', 'Vaccinated', 'Neutered'],
    size: 'Large',
    energy: 'High',
    description: 'Max is an energetic Labrador mix who loves life and everyone in it! This handsome boy is always ready for an adventure.',
    personality: 'Max is the social butterfly of the shelter! He greets everyone with a wagging tail and a happy smile.',
    idealHome: 'Active individual or family, home with a yard preferred. Max needs daily exercise and mental stimulation.',
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
    shelterContact: {
      phone: '(408) 555-0321',
      email: 'hello@felinefriends.org',
      contactPerson: 'David Kim'
    },
    compatibility: 78,
    deepMatch: 82,
    distance: '8.1 Km Away',
    traits: ['Gentle', 'Quiet', 'Cuddly', 'Laid-back'],
    characteristics: ['Indoor only', 'Grooming required', 'Vaccinated', 'Neutered'],
    size: 'Medium',
    energy: 'Low',
    description: 'Whiskers is a gorgeous Persian cat with a luxurious coat and the sweetest temperament. He\'s the ultimate lap cat.',
    personality: 'Whiskers is the definition of a gentle soul. He moves through life at a peaceful pace.',
    idealHome: 'Quiet home, someone who enjoys grooming and can commit to regular coat maintenance.',
    medicalHistory: 'Healthy, all vaccinations current, neutered, microchipped. Requires regular grooming.',
  },
  {
    id: 5,
    name: 'Charlie',
    age: { years: 1, months: 8 },
    breed: 'Beagle',
    image: '/images/entries/a5.jpg',
    location: 'Palo Alto, CA',
    shelter: 'Bay Area Pet Rescue',
    shelterContact: {
      phone: '(650) 555-0654',
      email: 'contact@bayarearescue.org',
      contactPerson: 'Jessica Martinez'
    },
    compatibility: 90,
    deepMatch: 88,
    distance: '4.7 Km Away',
    traits: ['Curious', 'Friendly', 'Vocal', 'Playful'],
    characteristics: ['Good with kids', 'Leash trained', 'Vaccinated', 'Neutered'],
    size: 'Medium',
    energy: 'Medium-High',
    description: 'Charlie is a young Beagle with a nose for adventure and a heart full of love! This curious boy loves exploring.',
    personality: 'Charlie is an enthusiastic explorer who approaches life with curiosity and joy. He loves sniffing everything.',
    idealHome: 'Patient family with time for training and exercise. A fenced yard is highly recommended.',
    medicalHistory: 'Healthy, all vaccinations current, neutered, microchipped',
  },
  {
    id: 6,
    name: 'Bella',
    age: { years: 7, months: 0 },
    breed: 'Domestic Shorthair',
    image: '/images/entries/a6.jpg',
    location: 'Fremont, CA',
    shelter: 'Golden Years Cat Sanctuary',
    shelterContact: {
      phone: '(510) 555-0987',
      email: 'info@goldenyears.org',
      contactPerson: 'Robert Taylor'
    },
    compatibility: 82,
    deepMatch: 85,
    distance: '6.3 Km Away',
    traits: ['Calm', 'Sweet', 'Gentle', 'Loyal'],
    characteristics: ['Litter trained', 'Senior cat', 'Vaccinated', 'Spayed'],
    size: 'Small',
    energy: 'Low',
    description: 'Bella is a sweet senior cat looking for a quiet home to spend her golden years. She\'s incredibly affectionate.',
    personality: 'Bella is a gentle soul who has lived a full life and now seeks comfort and companionship.',
    idealHome: 'Quiet home, retiree or work-from-home individual. Bella needs someone who can give her love and regular vet care.',
    medicalHistory: 'Senior cat, requires regular vet checkups, thyroid medication, all vaccinations current, spayed, microchipped',
  },
]

export default function BrowsePage() {
  const router = useRouter()
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userPawsonality, setUserPawsonality] = useState<string | null>(null)
  const [selectedPet, setSelectedPet] = useState<typeof PETS[number] | null>(null)
  const [showContactDialog, setShowContactDialog] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showAddCompanionDialog, setShowAddCompanionDialog] = useState(false)
  const [expandedPets, setExpandedPets] = useState<Record<number, boolean>>({})
  const [customPets, setCustomPets] = useState<typeof PETS>([])
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [newPetForm, setNewPetForm] = useState({
    name: '',
    age: '',
    breed: '',
    image: '',
    imageFile: null as File | null,
    location: '',
    shelter: '',
    contactPerson: '',
    phone: '',
    email: '',
    distance: '',
    size: 'Medium' as 'Small' | 'Medium' | 'Large',
    energy: 'Medium' as string,
    description: '',
    personality: '',
    idealHome: '',
    traits: ''
  })

  // Dynamic scores and AI tags
  const [scoresById, setScoresById] = useState<Record<number, { compatibility?: number; deepMatch?: number }>>({})
  const [tagsById, setTagsById] = useState<Record<number, string[]>>({})
  const [loading, setLoading] = useState(true)
  const [sortedPets, setSortedPets] = useState<typeof PETS>([])

  // Initial sort on mount - sort by default scores first
  useEffect(() => {
    const allPets = [...PETS, ...customPets]
    const sorted = [...allPets].sort((a, b) => b.compatibility - a.compatibility)
    setSortedPets(sorted)
  }, [])

  // Re-sort pets whenever AI scores load
  useEffect(() => {
    if (sortedPets.length === 0) return
    
    const petsWithScores = sortedPets.map(pet => ({
      ...pet,
      currentMatchScore: scoresById[pet.id]?.compatibility ?? pet.compatibility
    }))
    
    const sorted = [...petsWithScores].sort((a, b) => b.currentMatchScore - a.currentMatchScore)
    setSortedPets(sorted)
  }, [scoresById, customPets])

  // Get user's pawsonality from quiz
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const raw = window.localStorage.getItem('adopterProfile')
        if (raw) {
          const profile = JSON.parse(raw)
          if (profile.Activity_Level === 3 && profile.Experience_Level === 'Expert') {
            setUserPawsonality('Experienced Guardian')
          } else if (profile.Activity_Level === 3) {
            setUserPawsonality('Active Adventurer')
          } else if (profile.Activity_Level === 1 && profile.Time_At_Home === 3) {
            setUserPawsonality('Cozy Homebody')
          } else if (profile.Has_Kids === 1) {
            setUserPawsonality('Social Butterfly')
          } else if (profile.Experience_Level === 'First_Time') {
            setUserPawsonality('First-Time Friend')
          } else if (profile.Time_At_Home === 3) {
            setUserPawsonality('Patient Nurturer')
          } else {
            setUserPawsonality('Cozy Homebody')
          }
        }
      } catch {}
    }
  }, [])

  const getAdopterProfile = () => {
    if (typeof window !== 'undefined') {
      try {
        const raw = window.localStorage.getItem('adopterProfile')
        if (raw) return JSON.parse(raw)
      } catch {}
    }
    return {
      Activity_Level: 2,
      Has_Kids: 0,
      Experience_Level: 'Past_Owner' as 'First_Time' | 'Past_Owner' | 'Expert',
      Housing_Type: 'House_No_Yard',
      Time_At_Home: 2,
      Pet_Type_Desired: 'Dog',
    }
  }

  const derivePetProfile = (pet: typeof PETS[number]) => {
    const energyStr = (pet.energy || '').toLowerCase()
    const Pet_Energy_Level = energyStr.includes('high') ? 3 : energyStr.includes('low') ? 1 : 2
    const goodWithKids = (pet.characteristics || []).some(c => c.toLowerCase().includes('good with kids'))
    const Pet_Good_With_Kids = goodWithKids ? 2 : 1
    const size = (pet.size || 'Medium') as 'Small' | 'Medium' | 'Large'
    let Pet_Grooming_Needs: 'Low' | 'Medium' | 'High' = 'Medium'
    if ((pet.characteristics || []).some(c => c.toLowerCase().includes('grooming'))) Pet_Grooming_Needs = 'High'
    const breed = (pet.breed || '').toLowerCase()
    if (/(beagle|labrador|boxer|short hair|shorthair|siamese)/.test(breed)) Pet_Grooming_Needs = 'Low'
    return { Pet_Energy_Level, Pet_Good_With_Kids, Pet_Size: size, Pet_Grooming_Needs }
  }

  // Fetch AI scores
  useEffect(() => {
    let cancelled = false
    const run = async () => {
      setLoading(true)
      const adopterProfile = getAdopterProfile()
      try {
        const tasks = PETS.map(async (pet) => {
          const petProfile = derivePetProfile(pet)
          const payload = {
            Activity_Level: adopterProfile.Activity_Level,
            Has_Kids: adopterProfile.Has_Kids,
            Experience_Level: adopterProfile.Experience_Level,
            Pet_Energy_Level: petProfile.Pet_Energy_Level,
            Pet_Good_With_Kids: petProfile.Pet_Good_With_Kids,
            Pet_Size: petProfile.Pet_Size,
            Pet_Grooming_Needs: petProfile.Pet_Grooming_Needs,
          }
          const [m, d, t] = await Promise.all([
            api.matchScore(payload),
            api.deepMatch(payload),
            api.autoTags({ description: pet.description }),
          ])
          if (!cancelled) {
            setScoresById(prev => ({
              ...prev,
              [pet.id]: {
                compatibility: typeof m?.match_score === 'number' ? m.match_score : prev[pet.id]?.compatibility,
                deepMatch: typeof d?.deep_match_score === 'number' ? d.deep_match_score : prev[pet.id]?.deepMatch,
              }
            }))
            if (t && Array.isArray(t.tags)) {
              setTagsById(prev => ({ ...prev, [pet.id]: t.tags }))
            }
          }
        })
        await Promise.allSettled(tasks)
      } catch (e) {
        console.error('Error fetching pet scores:', e)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    run()
    return () => { cancelled = true }
  }, [])

  // Scroll to specific card
  const scrollToCard = (index: number) => {
    if (index < 0 || index >= sortedPets.length) return
    const element = document.getElementById(`pet-card-${index}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setCurrentIndex(index)
    }
  }

  // Detect which card is in view
  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollTop = container.scrollTop
      const viewportHeight = container.clientHeight
      const newIndex = Math.round(scrollTop / viewportHeight)
      if (newIndex !== currentIndex && newIndex >= 0 && newIndex < sortedPets.length) {
        setCurrentIndex(newIndex)
      }
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [currentIndex, sortedPets.length])

  const handleNext = () => scrollToCard(currentIndex + 1)
  const handlePrevious = () => scrollToCard(currentIndex - 1)

  const toggleExpanded = (petId: number) => {
    setExpandedPets(prev => ({ ...prev, [petId]: !prev[petId] }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewPetForm({ ...newPetForm, imageFile: file })
      
      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
        setNewPetForm(prev => ({ ...prev, image: reader.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddCompanion = async () => {
    // Validate required fields
    if (!newPetForm.name || !newPetForm.breed || !newPetForm.description) {
      alert('Please fill in at least Name, Breed, and Description')
      return
    }

    // Create new pet object
    const newPet = {
      id: Date.now(), // Use timestamp as unique ID
      name: newPetForm.name,
      age: { years: parseInt(newPetForm.age) || 2, months: 0 },
      breed: newPetForm.breed,
      image: newPetForm.image || '/images/entries/a1.jpg', // Default image if not provided
      location: newPetForm.location || 'Unknown Location',
      shelter: newPetForm.shelter || 'Community Shelter',
      shelterContact: {
        phone: newPetForm.phone || '(000) 000-0000',
        email: newPetForm.email || 'contact@shelter.org',
        contactPerson: newPetForm.contactPerson || 'Shelter Staff'
      },
      compatibility: 0, // Will be calculated by AI
      deepMatch: 0, // Will be calculated by AI
      distance: newPetForm.distance || '0 Km Away',
      traits: newPetForm.traits ? newPetForm.traits.split(',').map(t => t.trim()) : ['Friendly'],
      characteristics: ['Vaccinated'], // Default
      size: newPetForm.size,
      energy: newPetForm.energy,
      description: newPetForm.description,
      personality: newPetForm.personality || newPetForm.description,
      idealHome: newPetForm.idealHome || 'Loving home with care and attention',
      medicalHistory: 'Please inquire with shelter',
    }

    // Add to custom pets
    setCustomPets(prev => [...prev, newPet])

    // Fetch AI scores for the new pet
    try {
      const adopterProfile = getAdopterProfile()
      const petProfile = derivePetProfile(newPet)
      const payload = {
        Activity_Level: adopterProfile.Activity_Level,
        Has_Kids: adopterProfile.Has_Kids,
        Experience_Level: adopterProfile.Experience_Level,
        Pet_Energy_Level: petProfile.Pet_Energy_Level,
        Pet_Good_With_Kids: petProfile.Pet_Good_With_Kids,
        Pet_Size: petProfile.Pet_Size,
        Pet_Grooming_Needs: petProfile.Pet_Grooming_Needs,
      }

      const [m, d, t] = await Promise.all([
        api.matchScore(payload),
        api.deepMatch(payload),
        api.autoTags({ description: newPet.description }),
      ])

      setScoresById(prev => ({
        ...prev,
        [newPet.id]: {
          compatibility: typeof m?.match_score === 'number' ? m.match_score : 75,
          deepMatch: typeof d?.deep_match_score === 'number' ? d.deep_match_score : 75,
        }
      }))

      if (t && Array.isArray(t.tags)) {
        setTagsById(prev => ({ ...prev, [newPet.id]: t.tags }))
      }
    } catch (e) {
      console.error('Error fetching scores for new pet:', e)
    }

    // Reset form and close dialog
    setNewPetForm({
      name: '',
      age: '',
      breed: '',
      image: '',
      imageFile: null,
      location: '',
      shelter: '',
      contactPerson: '',
      phone: '',
      email: '',
      distance: '',
      size: 'Medium',
      energy: 'Medium',
      description: '',
      personality: '',
      idealHome: '',
      traits: ''
    })
    setImagePreview(null)
    setShowAddCompanionDialog(false)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hide scrollbar globally */}
      <style jsx global>{`
        .snap-container::-webkit-scrollbar {
          display: none;
        }
        .snap-container {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 bg-white z-40 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left: Back Button */}
            <button
              onClick={() => router.push('/')}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>

            {/* Center: Pawsonality Badge */}
            <div className="flex-1 flex justify-center gap-4">
              {userPawsonality && (
                <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-full">
                  <span className="text-3xl">{PAWSONALITY_TYPES[userPawsonality as keyof typeof PAWSONALITY_TYPES]?.emoji}</span>
                  <span className="text-base font-semibold text-gray-900">{userPawsonality}</span>
                </div>
              )}
              
              {/* Add Companion Button */}
              <button
                onClick={() => setShowAddCompanionDialog(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-full text-sm font-medium text-white transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Companion
              </button>
            </div>

            {/* Right: Retake Quiz */}
            <button
              onClick={() => router.push('/quiz')}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 transition-colors flex-shrink-0"
            >
              Retake Quiz
            </button>
          </div>
        </div>
      </div>

      {/* Cards Container with Snap Scroll */}
      <div>
        <div 
          ref={scrollContainerRef} 
          className="snap-container h-screen overflow-y-scroll snap-y snap-mandatory"
        >
          {sortedPets.map((pet, index) => {
            const matchScore = scoresById[pet.id]?.compatibility ?? pet.compatibility
            const deepMatchScore = scoresById[pet.id]?.deepMatch ?? pet.deepMatch
            const isBestMatch = index === 0

            return (
              <div 
                key={pet.id} 
                id={`pet-card-${index}`} 
                className="h-screen snap-start snap-always flex flex-col items-center justify-center px-4"
              >
                {/* Best Match Banner - Only for first card */}
                {isBestMatch && (
                  <div className="mb-4 text-center">
                    <div className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full shadow-lg">
                      <span className="text-2xl">✨</span>
                      <span className="text-xl font-bold">We've Found Your Best Match!</span>
                      <span className="text-2xl">✨</span>
                    </div>
                  </div>
                )}

                {/* Card Layout - Image Left, Details Right */}
                <div className={`flex gap-6 mt-15 bg-white rounded-md overflow-hidden max-w-6xl w-full`}>
                
                  {/* Left Side - Image */}
                  <div className="relative w-[400px] h-96 flex-shrink-0">
                    <Image
                      src={pet.image}
                      alt={pet.name}
                      fill
                      className="object-cover"
                      priority={index < 2}
                    />
                    
                    {/* Pet Info Overlay - Bottom Left */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4">
                      <div className="flex items-center gap-1 mb-2">
                        <MapPin className="w-3 h-3 text-white" />
                        <span className="text-xs font-medium text-white">{pet.location}</span>
                      </div>
                      <h2 className="text-2xl font-bold text-white mb-1">
                        {pet.name}, {pet.age.years}
                      </h2>
                      <p className="text-sm text-white/90 mb-1">{pet.breed}</p>
                      <p className="text-xs text-white/80">{pet.distance}</p>
                    </div>
                  </div>

                  {/* Right Side - Details */}
                  <div className="flex-1 p-6 overflow-y-auto max-h-96 relative">
                    {/* Heart Button - Top Right */}
                    <button
                      onClick={() => {
                        setSelectedPet(pet)
                        setShowContactDialog(true)
                      }}
                      className="absolute top-4 right-4 w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-all group z-10"
                    >
                      <Heart className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
                    </button>

                    {/* Match Scores - No Background */}
                    <div className="flex gap-8 mb-6 pr-16">
                      <div>
                        <div className="text-sm font-medium text-gray-500 mb-1">Match</div>
                        <div className="flex items-center gap-0.5">
                          <NumberTicker value={matchScore} className="text-4xl font-bold text-gray-900" />
                          <span className="text-4xl font-bold text-gray-900">%</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500 mb-1">Deep</div>
                        <div className="flex items-center gap-0.5">
                          <NumberTicker value={deepMatchScore} className="text-4xl font-bold text-gray-900" />
                          <span className="text-4xl font-bold text-gray-900">%</span>
                        </div>
                      </div>
                    </div>

                    {/* Traits */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {pet.traits.map((trait) => (
                        <span
                          key={trait}
                          className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>

                    {/* About Section */}
                    <div className="mb-4">
                      <h3 className="text-sm font-bold text-gray-900 mb-2">About</h3>
                      <p className="text-sm text-gray-700 leading-relaxed">{pet.description}</p>
                    </div>

                     {/* Characteristics */}
                        <div className="mb-4">
                          <h3 className="text-sm font-bold text-gray-900 mb-3">Characteristics</h3>
                          <div className="flex flex-wrap gap-2">
                            {pet.characteristics.map((char) => (
                              <span key={char} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg">
                                {char}
                              </span>
                            ))}
                          </div>
                        </div>

                    {/* Collapse/Expand Button */}
                    <button
                      onClick={() => toggleExpanded(pet.id)}
                      className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors mb-4"
                    >
                      {expandedPets[pet.id] ? 'Show Less' : 'Show More'}
                      <ChevronDown className={`w-4 h-4 transition-transform ${expandedPets[pet.id] ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Collapsible Content */}
                    {expandedPets[pet.id] && (
                      <div className="space-y-4">
                        {/* Personality */}
                        <div>
                          <h3 className="text-sm font-bold text-gray-900 mb-2">Personality</h3>
                          <p className="text-sm text-gray-700 leading-relaxed">{pet.personality}</p>
                        </div>

                        {/* Ideal Home */}
                        <div>
                          <h3 className="text-sm font-bold text-gray-900 mb-2">Ideal Home</h3>
                          <p className="text-sm text-gray-700 leading-relaxed">{pet.idealHome}</p>
                        </div>

                       

                        {/* Contact Button */}
                        <button
                          onClick={() => {
                            setSelectedPet(pet)
                            setShowContactDialog(true)
                          }}
                          className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                          <Phone className="w-4 h-4" />
                          Contact Shelter
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Scroll Indicator - Only for best match */}
                {isBestMatch && sortedPets.length > 1 && (
                  <div className="mt-4 text-center">
                    <button
                      onClick={handleNext}
                      className="inline-flex flex-col items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors animate-pulse"
                    >
                      <p className="text-sm font-medium">
                        Scroll to view more pets like {pet.name}
                      </p>
                      <ChevronDown className="w-6 h-6" />
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Navigation Arrows - Far Right, Close Together */}
        <div className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-50">
          {currentIndex > 0 && (
            <button
              onClick={handlePrevious}
              className="w-12 h-12 rounded-full bg-black flex items-center justify-center hover:bg-gray-800 transition-all"
            >
              <ChevronUp className="w-6 h-6 text-white" />
            </button>
          )}

          {currentIndex < sortedPets.length - 1 && (
            <button
              onClick={handleNext}
              className="w-12 h-12 rounded-full bg-black flex items-center justify-center hover:bg-gray-800 transition-all"
            >
              <ChevronDown className="w-6 h-6 text-white" />
            </button>
          )}
        </div>
      </div>

      {/* Contact Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Reach Your Match! ❤️</DialogTitle>
            <DialogDescription>
              Contact the shelter to learn more about {selectedPet?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPet && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Location</p>
                  <p className="text-sm font-medium">{selectedPet.location}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Contact Person</p>
                  <p className="text-sm font-medium">{selectedPet.shelterContact.contactPerson}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm font-medium">{selectedPet.shelterContact.phone}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium">{selectedPet.shelterContact.email}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                if (selectedPet) {
                  window.location.href = `tel:${selectedPet.shelterContact.phone}`
                }
              }}
            >
              <Phone className="w-4 h-4 mr-2" />
              Call {selectedPet?.shelter}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">About {selectedPet?.name}</DialogTitle>
            <DialogDescription>
              Complete profile and details
            </DialogDescription>
          </DialogHeader>
          
          {selectedPet && (
            <div className="grid gap-6 py-4">
              {/* Image */}
              <div className="relative w-full h-64 rounded-xl overflow-hidden">
                <Image
                  src={selectedPet.image}
                  alt={selectedPet.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Scores */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <div className="text-xs font-semibold text-blue-600 mb-1">Match Score</div>
                  <div className="text-3xl font-bold text-blue-700">
                    {scoresById[selectedPet.id]?.compatibility ?? selectedPet.compatibility}%
                  </div>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl">
                  <div className="text-xs font-semibold text-purple-600 mb-1">AI DeepMatch</div>
                  <div className="text-3xl font-bold text-purple-700">
                    {scoresById[selectedPet.id]?.deepMatch ?? selectedPet.deepMatch}%
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">Description</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{selectedPet.description}</p>
              </div>

              {/* Personality */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">Personality</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{selectedPet.personality}</p>
              </div>

              {/* Ideal Home */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">Ideal Home</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{selectedPet.idealHome}</p>
              </div>

              {/* Medical History */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">Medical History</h3>
                <p className="text-sm text-gray-700 leading-relaxed">{selectedPet.medicalHistory}</p>
              </div>

              {/* Characteristics */}
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-2">Characteristics</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedPet.characteristics.map((char) => (
                    <span key={char} className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg">
                      {char}
                    </span>
                  ))}
                </div>
              </div>

              {/* AI Tags */}
              {tagsById[selectedPet.id] && tagsById[selectedPet.id].length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-2">AI Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {tagsById[selectedPet.id].map((tag, i) => (
                      <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowDetailsDialog(false)}
            >
              Close
            </Button>
            <Button 
              className="bg-pink-600 hover:bg-pink-700"
              onClick={() => {
                setShowDetailsDialog(false)
                setShowContactDialog(true)
              }}
            >
              <Heart className="w-4 h-4 mr-2" />
              Contact Shelter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Loading Indicator */}
      {loading && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white px-4 py-3 rounded-full shadow-lg z-50">
          <p className="text-xs font-medium text-gray-600">Loading AI scores...</p>
        </div>
      )}

      {/* Add Companion Dialog */}
      <Dialog open={showAddCompanionDialog} onOpenChange={setShowAddCompanionDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Add a New Companion 🐾</DialogTitle>
            <DialogDescription>
              Add a pet to test our AI matching system. Fill in the details and see the match scores!
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Name */}
            <div>
              <Label htmlFor="name" className="mb-2 block">Pet Name *</Label>
              <Input
                id="name"
                value={newPetForm.name}
                onChange={(e) => setNewPetForm({...newPetForm, name: e.target.value})}
                placeholder="e.g., Buddy"
              />
            </div>

            {/* Age and Breed */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age" className="mb-2 block">Age (years)</Label>
                <Input
                  id="age"
                  type="number"
                  value={newPetForm.age}
                  onChange={(e) => setNewPetForm({...newPetForm, age: e.target.value})}
                  placeholder="e.g., 3"
                />
              </div>
              <div>
                <Label htmlFor="breed" className="mb-2 block">Breed *</Label>
                <Input
                  id="breed"
                  value={newPetForm.breed}
                  onChange={(e) => setNewPetForm({...newPetForm, breed: e.target.value})}
                  placeholder="e.g., Golden Retriever"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div>
              <Label htmlFor="image" className="mb-2 block">Pet Image</Label>
              <div className="space-y-3">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="cursor-pointer"
                />
                {imagePreview && (
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-gray-200">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null)
                        setNewPetForm({ ...newPetForm, image: '', imageFile: null })
                      }}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">Upload a photo of the pet</p>
            </div>

            {/* Size and Energy */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="size" className="mb-2 block">Size</Label>
                <Select
                  id="size"
                  value={newPetForm.size}
                  onChange={(e) => setNewPetForm({...newPetForm, size: e.target.value as 'Small' | 'Medium' | 'Large'})}
                >
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
                </Select>
              </div>
              <div>
                <Label htmlFor="energy" className="mb-2 block">Energy Level</Label>
                <Select
                  id="energy"
                  value={newPetForm.energy}
                  onChange={(e) => setNewPetForm({...newPetForm, energy: e.target.value})}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="mb-2 block">Description *</Label>
              <Textarea
                id="description"
                value={newPetForm.description}
                onChange={(e) => setNewPetForm({...newPetForm, description: e.target.value})}
                placeholder="Tell us about this pet's personality, behavior, and what makes them special..."
                rows={4}
              />
            </div>

            {/* Personality */}
            <div>
              <Label htmlFor="personality" className="mb-2 block">Personality (optional)</Label>
              <Textarea
                id="personality"
                value={newPetForm.personality}
                onChange={(e) => setNewPetForm({...newPetForm, personality: e.target.value})}
                placeholder="Describe their temperament and character..."
                rows={3}
              />
            </div>

            {/* Ideal Home */}
            <div>
              <Label htmlFor="idealHome" className="mb-2 block">Ideal Home (optional)</Label>
              <Textarea
                id="idealHome"
                value={newPetForm.idealHome}
                onChange={(e) => setNewPetForm({...newPetForm, idealHome: e.target.value})}
                placeholder="What kind of home would be best for this pet?"
                rows={2}
              />
            </div>

            {/* Traits */}
            <div>
              <Label htmlFor="traits" className="mb-2 block">Traits (comma-separated)</Label>
              <Input
                id="traits"
                value={newPetForm.traits}
                onChange={(e) => setNewPetForm({...newPetForm, traits: e.target.value})}
                placeholder="e.g., Friendly, Active, Loyal, Playful"
              />
            </div>

            {/* Location Info */}
            <div className="border-t pt-4 mt-2">
              <h3 className="font-semibold mb-3">Location & Contact (optional)</h3>
              
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="location" className="mb-2 block">Location</Label>
                  <Input
                    id="location"
                    value={newPetForm.location}
                    onChange={(e) => setNewPetForm({...newPetForm, location: e.target.value})}
                    placeholder="e.g., San Francisco, CA"
                  />
                </div>

                <div>
                  <Label htmlFor="shelter" className="mb-2 block">Shelter Name</Label>
                  <Input
                    id="shelter"
                    value={newPetForm.shelter}
                    onChange={(e) => setNewPetForm({...newPetForm, shelter: e.target.value})}
                    placeholder="e.g., Happy Paws Shelter"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contactPerson" className="mb-2 block">Contact Person</Label>
                    <Input
                      id="contactPerson"
                      value={newPetForm.contactPerson}
                      onChange={(e) => setNewPetForm({...newPetForm, contactPerson: e.target.value})}
                      placeholder="e.g., Sarah Johnson"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="mb-2 block">Phone</Label>
                    <Input
                      id="phone"
                      value={newPetForm.phone}
                      onChange={(e) => setNewPetForm({...newPetForm, phone: e.target.value})}
                      placeholder="e.g., (415) 555-0123"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="mb-2 block">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newPetForm.email}
                    onChange={(e) => setNewPetForm({...newPetForm, email: e.target.value})}
                    placeholder="e.g., contact@shelter.org"
                  />
                </div>

                <div>
                  <Label htmlFor="distance" className="mb-2 block">Distance</Label>
                  <Input
                    id="distance"
                    value={newPetForm.distance}
                    onChange={(e) => setNewPetForm({...newPetForm, distance: e.target.value})}
                    placeholder="e.g., 3.5 Km Away"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAddCompanionDialog(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleAddCompanion}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add & Calculate Match
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
