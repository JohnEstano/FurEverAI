'use client'
import React, { useEffect, useState, useRef } from 'react'
import { Heart, Info, MapPin, Phone, Mail, User, ArrowLeft, ChevronUp, ChevronDown, Plus, Grid3x3, LayoutList } from 'lucide-react'
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

// Mock pet data - Using placeholder images: dog1-3.jpg for dogs, cat1-3.jpg for cats
const PETS = [
  {
    id: 1,
    name: 'Buddy',
    age: { years: 3, months: 2 },
    breed: 'Golden Retriever',
    image: '/images/dog1.jpg',
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
    image: '/images/cat1.jpg',
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
    image: '/images/dog2.jpg',
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
    image: '/images/cat2.jpg',
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
    image: '/images/dog3.jpg',
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
    image: '/images/cat3.jpg',
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
  {
    id: 7,
    name: 'Rocky',
    age: { years: 4, months: 0 },
    breed: 'German Shepherd',
    image: '/images/dog1.jpg',
    location: 'San Mateo, CA',
    shelter: 'Guardian Angels Rescue',
    shelterContact: {
      phone: '(650) 555-0234',
      email: 'contact@guardianangels.org',
      contactPerson: 'Amanda Foster'
    },
    compatibility: 87,
    deepMatch: 89,
    distance: '6.8 Km Away',
    traits: ['Protective', 'Intelligent', 'Loyal', 'Athletic'],
    characteristics: ['Trained', 'Good with dogs', 'Vaccinated', 'Neutered'],
    size: 'Large',
    energy: 'High',
    description: 'Rocky is a magnificent German Shepherd with excellent training and a gentle heart. He is protective yet friendly.',
    personality: 'Rocky is a natural guardian with a soft spot for his family. He is intelligent and eager to please.',
    idealHome: 'Experienced dog owner, active household with secure yard. Rocky needs mental stimulation and regular exercise.',
    medicalHistory: 'Healthy, all vaccinations current, neutered, microchipped',
  },
  {
    id: 8,
    name: 'Daisy',
    age: { years: 1, months: 3 },
    breed: 'Tabby Cat',
    image: '/images/cat1.jpg',
    location: 'Mountain View, CA',
    shelter: 'Whiskers & Paws',
    shelterContact: {
      phone: '(650) 555-0567',
      email: 'info@whiskerspaws.org',
      contactPerson: 'Lisa Wong'
    },
    compatibility: 84,
    deepMatch: 86,
    distance: '7.5 Km Away',
    traits: ['Playful', 'Curious', 'Energetic', 'Sweet'],
    characteristics: ['Litter trained', 'Good with cats', 'Vaccinated', 'Spayed'],
    size: 'Small',
    energy: 'Medium',
    description: 'Daisy is a young tabby with endless energy and curiosity. She loves toys, climbing, and interactive play.',
    personality: 'Daisy is the life of the party! She is always ready for playtime and loves exploring every corner.',
    idealHome: 'Active household that enjoys interactive play. Daisy would thrive with another young cat companion.',
    medicalHistory: 'Healthy, all vaccinations current, spayed, microchipped',
  },
  {
    id: 9,
    name: 'Thor',
    age: { years: 6, months: 0 },
    breed: 'Husky Mix',
    image: '/images/dog2.jpg',
    location: 'Sunnyvale, CA',
    shelter: 'Northern Paws Rescue',
    shelterContact: {
      phone: '(408) 555-0890',
      email: 'adopt@northernpaws.org',
      contactPerson: 'Kevin Zhang'
    },
    compatibility: 91,
    deepMatch: 92,
    distance: '9.2 Km Away',
    traits: ['Adventurous', 'Strong', 'Vocal', 'Friendly'],
    characteristics: ['Leash trained', 'Good with dogs', 'Vaccinated', 'Neutered'],
    size: 'Large',
    energy: 'High',
    description: 'Thor is a stunning Husky mix who loves the outdoors. He is perfect for hiking, running, and active adventures.',
    personality: 'Thor is energetic and loves being outdoors. He is vocal and will talk to you about his day.',
    idealHome: 'Very active owner who loves outdoor activities. Thor needs lots of exercise and mental stimulation.',
    medicalHistory: 'Healthy, all vaccinations current, neutered, microchipped',
  },
  {
    id: 10,
    name: 'Mittens',
    age: { years: 3, months: 6 },
    breed: 'Maine Coon Mix',
    image: '/images/cat2.jpg',
    location: 'Redwood City, CA',
    shelter: 'Gentle Giants Cat Sanctuary',
    shelterContact: {
      phone: '(650) 555-0345',
      email: 'hello@gentlegiants.org',
      contactPerson: 'Patricia Brown'
    },
    compatibility: 79,
    deepMatch: 81,
    distance: '5.9 Km Away',
    traits: ['Gentle', 'Large', 'Fluffy', 'Calm'],
    characteristics: ['Indoor only', 'Grooming required', 'Vaccinated', 'Neutered'],
    size: 'Large',
    energy: 'Low',
    description: 'Mittens is a gentle giant Maine Coon mix with a luxurious coat and calm demeanor. Perfect lap cat despite his size.',
    personality: 'Mittens is surprisingly gentle for his size. He loves being brushed and lounging in sunny spots.',
    idealHome: 'Calm household with time for regular grooming. Mittens needs someone who appreciates his majestic presence.',
    medicalHistory: 'Healthy, all vaccinations current, neutered, microchipped. Requires regular grooming.',
  },
  {
    id: 11,
    name: 'Scout',
    age: { years: 2, months: 0 },
    breed: 'Border Collie',
    image: '/images/dog3.jpg',
    location: 'Santa Clara, CA',
    shelter: 'Smart Paws Rescue',
    shelterContact: {
      phone: '(408) 555-0678',
      email: 'contact@smartpaws.org',
      contactPerson: 'Jennifer Lee'
    },
    compatibility: 94,
    deepMatch: 96,
    distance: '8.7 Km Away',
    traits: ['Intelligent', 'Energetic', 'Trainable', 'Focused'],
    characteristics: ['Highly trained', 'Good with kids', 'Vaccinated', 'Spayed'],
    size: 'Medium',
    energy: 'High',
    description: 'Scout is a brilliant Border Collie who excels at agility, tricks, and any mental challenge you give her.',
    personality: 'Scout is extremely intelligent and needs constant mental stimulation. She learns new commands in minutes.',
    idealHome: 'Active owner interested in dog sports, training, or agility. Scout needs a job to do and daily challenges.',
    medicalHistory: 'Healthy, all vaccinations current, spayed, microchipped',
  },
  {
    id: 12,
    name: 'Oliver',
    age: { years: 5, months: 3 },
    breed: 'Orange Tabby',
    image: '/images/cat3.jpg',
    location: 'Milpitas, CA',
    shelter: 'Orange Cat Sanctuary',
    shelterContact: {
      phone: '(408) 555-0901',
      email: 'info@orangecats.org',
      contactPerson: 'Marcus Thompson'
    },
    compatibility: 86,
    deepMatch: 88,
    distance: '11.3 Km Away',
    traits: ['Friendly', 'Social', 'Talkative', 'Cuddly'],
    characteristics: ['Litter trained', 'Good with cats', 'Vaccinated', 'Neutered'],
    size: 'Medium',
    energy: 'Medium',
    description: 'Oliver is a charming orange tabby who loves everyone. He is the perfect blend of playful and cuddly.',
    personality: 'Oliver is outgoing and loves meeting new people. He will greet you at the door and follow you around.',
    idealHome: 'Social household that enjoys an interactive, affectionate cat. Oliver loves being the center of attention.',
    medicalHistory: 'Healthy, all vaccinations current, neutered, microchipped',
  },
  {
    id: 13,
    name: 'Rosie',
    age: { years: 2, months: 8 },
    breed: 'Poodle Mix',
    image: '/images/dog1.jpg',
    location: 'Cupertino, CA',
    shelter: 'Paws & Hearts Rescue',
    shelterContact: {
      phone: '(408) 555-1234',
      email: 'info@pawshearts.org',
      contactPerson: 'Nancy Davis'
    },
    compatibility: 89,
    deepMatch: 91,
    distance: '7.4 Km Away',
    traits: ['Smart', 'Affectionate', 'Hypoallergenic', 'Gentle'],
    characteristics: ['Good with kids', 'Leash trained', 'Vaccinated', 'Spayed'],
    size: 'Medium',
    energy: 'Medium',
    description: 'Rosie is an adorable Poodle mix with a hypoallergenic coat and a heart full of love. She is smart and easy to train.',
    personality: 'Rosie is gentle and eager to please. She loves learning new tricks and enjoys being around people.',
    idealHome: 'Family-friendly home with time for grooming and training. Perfect for someone with allergies.',
    medicalHistory: 'Healthy, all vaccinations current, spayed, microchipped',
  },
  {
    id: 14,
    name: 'Shadow',
    age: { years: 6, months: 6 },
    breed: 'Black Cat',
    image: '/images/cat1.jpg',
    location: 'San Jose, CA',
    shelter: 'Midnight Whiskers Sanctuary',
    shelterContact: {
      phone: '(408) 555-2345',
      email: 'contact@midnightwhiskers.org',
      contactPerson: 'Thomas White'
    },
    compatibility: 81,
    deepMatch: 83,
    distance: '9.8 Km Away',
    traits: ['Mysterious', 'Independent', 'Loyal', 'Quiet'],
    characteristics: ['Litter trained', 'Indoor only', 'Vaccinated', 'Neutered'],
    size: 'Medium',
    energy: 'Low',
    description: 'Shadow is a sleek black cat with golden eyes and a loyal heart. He may be shy at first but forms deep bonds.',
    personality: 'Shadow is independent yet affectionate once he trusts you. He enjoys quiet companionship.',
    idealHome: 'Calm home with patient owner. Shadow needs time to warm up but is worth the wait.',
    medicalHistory: 'Healthy, all vaccinations current, neutered, microchipped',
  },
  {
    id: 15,
    name: 'Duke',
    age: { years: 4, months: 6 },
    breed: 'Boxer',
    image: '/images/dog2.jpg',
    location: 'Los Gatos, CA',
    shelter: 'Strong Hearts Dog Rescue',
    shelterContact: {
      phone: '(408) 555-3456',
      email: 'adopt@stronghearts.org',
      contactPerson: 'Rachel Green'
    },
    compatibility: 93,
    deepMatch: 94,
    distance: '10.5 Km Away',
    traits: ['Energetic', 'Protective', 'Loyal', 'Playful'],
    characteristics: ['Good with kids', 'Trained', 'Vaccinated', 'Neutered'],
    size: 'Large',
    energy: 'High',
    description: 'Duke is a muscular Boxer with boundless energy and a protective nature. He loves his family fiercely.',
    personality: 'Duke is energetic and loves to play. He is protective but gentle with children.',
    idealHome: 'Active family with a secure yard. Duke needs daily exercise and loves being part of activities.',
    medicalHistory: 'Healthy, all vaccinations current, neutered, microchipped',
  },
  {
    id: 16,
    name: 'Cleo',
    age: { years: 3, months: 0 },
    breed: 'Calico Cat',
    image: '/images/cat2.jpg',
    location: 'Campbell, CA',
    shelter: 'Colorful Cats Haven',
    shelterContact: {
      phone: '(408) 555-4567',
      email: 'hello@colorfulcats.org',
      contactPerson: 'Diana Prince'
    },
    compatibility: 87,
    deepMatch: 89,
    distance: '6.7 Km Away',
    traits: ['Sassy', 'Confident', 'Playful', 'Talkative'],
    characteristics: ['Litter trained', 'Good with cats', 'Vaccinated', 'Spayed'],
    size: 'Small',
    energy: 'Medium-High',
    description: 'Cleo is a beautiful calico with a sassy personality. She knows what she wants and is not afraid to tell you.',
    personality: 'Cleo is confident and playful. She loves interactive toys and will keep you entertained.',
    idealHome: 'Active household that appreciates a cat with personality. Cleo loves attention and playtime.',
    medicalHistory: 'Healthy, all vaccinations current, spayed, microchipped',
  },
  {
    id: 17,
    name: 'Ace',
    age: { years: 5, months: 0 },
    breed: 'Australian Shepherd',
    image: '/images/dog3.jpg',
    location: 'Saratoga, CA',
    shelter: 'Herding Hearts Rescue',
    shelterContact: {
      phone: '(408) 555-5678',
      email: 'info@herdinghearts.org',
      contactPerson: 'Chris Evans'
    },
    compatibility: 92,
    deepMatch: 93,
    distance: '12.1 Km Away',
    traits: ['Intelligent', 'Energetic', 'Loyal', 'Focused'],
    characteristics: ['Highly trained', 'Good with dogs', 'Vaccinated', 'Neutered'],
    size: 'Medium',
    energy: 'High',
    description: 'Ace is a brilliant Australian Shepherd who excels at agility and herding. He is a true working dog.',
    personality: 'Ace is extremely intelligent and needs a job to do. He thrives on mental and physical challenges.',
    idealHome: 'Very active owner interested in dog sports or farm work. Ace needs daily exercise and training.',
    medicalHistory: 'Healthy, all vaccinations current, neutered, microchipped',
  },
  {
    id: 18,
    name: 'Princess',
    age: { years: 8, months: 0 },
    breed: 'Ragdoll',
    image: '/images/cat3.jpg',
    location: 'Los Altos, CA',
    shelter: 'Royal Felines Sanctuary',
    shelterContact: {
      phone: '(650) 555-6789',
      email: 'contact@royalfelines.org',
      contactPerson: 'Victoria Stone'
    },
    compatibility: 80,
    deepMatch: 82,
    distance: '8.9 Km Away',
    traits: ['Gentle', 'Docile', 'Affectionate', 'Quiet'],
    characteristics: ['Indoor only', 'Grooming required', 'Vaccinated', 'Spayed'],
    size: 'Large',
    energy: 'Low',
    description: 'Princess is a stunning Ragdoll with beautiful blue eyes. She is the perfect lap cat and loves being held.',
    personality: 'Princess lives up to her name with a regal yet sweet demeanor. She goes limp when you pick her up.',
    idealHome: 'Calm household with time for regular grooming. Princess needs someone who appreciates her gentle nature.',
    medicalHistory: 'Senior cat, requires regular vet checkups, all vaccinations current, spayed, microchipped',
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
    idealHome: ''
  })

  // Dynamic scores and AI tags
  const [scoresById, setScoresById] = useState<Record<number, { compatibility?: number; deepMatch?: number }>>({})
  const [tagsById, setTagsById] = useState<Record<number, string[]>>({})
  const [adoptionTimeline, setAdoptionTimeline] = useState<Record<number, number>>({}) // Days until adoption
  const [loading, setLoading] = useState(true)
  const [sortedPets, setSortedPets] = useState<typeof PETS>([])
  const [viewMode, setViewMode] = useState<'cards' | 'grid'>('cards')
  const [showAllPets, setShowAllPets] = useState(false) // Toggle for showing all pets vs KNN filtered
  const [showAlgorithmInfo, setShowAlgorithmInfo] = useState<string | null>(null) // Track which algorithm info to show
  
  // KNN Filtering - Minimum match threshold for "nearest neighbors"
  const MIN_MATCH_THRESHOLD = 75 // Only show pets with 75%+ compatibility
  
  // Algorithm information
  const ALGORITHM_INFO = {
    svm: {
      title: 'Support Vector Machine (SVM)',
      description: 'A powerful machine learning algorithm that analyzes your profile and pet characteristics to calculate compatibility scores.',
      use: 'Used to predict the Match Score - how well a pet fits your lifestyle, activity level, and home environment based on multiple factors.'
    },
    ann: {
      title: 'Artificial Neural Network (ANN)',
      description: 'An advanced deep learning model inspired by the human brain, capable of recognizing complex patterns in data.',
      use: 'Provides the Deep Match Score - a sophisticated analysis that considers subtle behavioral patterns and deeper compatibility factors beyond basic traits.'
    },
    lr: {
      title: 'Linear Regression',
      description: 'A statistical model that predicts continuous numerical outcomes based on historical data and pet characteristics.',
      use: 'Predicts the Adoption Timeline - estimates how many days until a pet is likely to be adopted based on their profile, helping you make timely decisions.'
    },
    nb: {
      title: 'Naive Bayes Classifier',
      description: 'A probabilistic machine learning algorithm that excels at text classification and categorization tasks.',
      use: 'Generates AI Tags by analyzing pet descriptions and automatically identifying key traits, temperaments, and characteristics to help you quickly understand each pet.'
    },
    knn: {
      title: 'K-Nearest Neighbors (KNN)',
      description: 'An algorithm that finds the most similar matches by comparing data points and identifying the "nearest neighbors" based on compatibility.',
      use: `Filters your pet matches to show only those with ≥${75}% compatibility score, ensuring you see the best possible matches rather than pets that are too far from your preferences.`
    }
  }
  


  // Re-sort pets whenever AI scores load
  useEffect(() => {
    const allPets = [...PETS, ...customPets]
    
    const petsWithScores = allPets.map(pet => ({
      ...pet,
      currentMatchScore: scoresById[pet.id]?.compatibility ?? pet.compatibility,
      currentDeepScore: scoresById[pet.id]?.deepMatch ?? pet.deepMatch
    }))
    
    // KNN Filter: Only show "nearest neighbors" with match score >= threshold (unless showAllPets is true)
    const filteredPets = showAllPets 
      ? petsWithScores 
      : petsWithScores.filter(pet => pet.currentMatchScore >= MIN_MATCH_THRESHOLD)
    
    // Sort by BOTH compatibility and deep match - best overall match at top
    const sorted = [...filteredPets].sort((a, b) => {
      // Calculate average of both scores for true "best match"
      const scoreA = (a.currentMatchScore + a.currentDeepScore) / 2
      const scoreB = (b.currentMatchScore + b.currentDeepScore) / 2
      return scoreB - scoreA
    })
    setSortedPets(sorted)
  }, [scoresById, customPets, showAllPets])

  // Get user's pawsonality from quiz
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // First try to get the stored pawsonality directly from quiz
        const storedPawsonality = window.localStorage.getItem('userPawsonality')
        if (storedPawsonality) {
          setUserPawsonality(storedPawsonality)
          return
        }
        
        // Fallback: derive from profile if pawsonality not stored
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

  const derivePetAgeGroup = (pet: typeof PETS[number]): 'Puppy/Kitten' | 'Young_Adult' | 'Senior' => {
    const age = pet.age.years
    const breedLower = pet.breed.toLowerCase()
    const isDog = /(dog|retriever|labrador|beagle|terrier|shepherd|poodle|bulldog|husky)/i.test(breedLower)
    const isCat = /(cat|siamese|persian|shorthair|longhair|tabby|calico)/i.test(breedLower)
    
    // Determine age group based on pet type
    if (isDog) {
      if (age < 2) return 'Puppy/Kitten'
      if (age >= 7) return 'Senior'
      return 'Young_Adult'
    } else if (isCat) {
      if (age < 2) return 'Puppy/Kitten'
      if (age >= 10) return 'Senior'
      return 'Young_Adult'
    }
    
    // Default for unknown types
    if (age < 2) return 'Puppy/Kitten'
    if (age >= 7) return 'Senior'
    return 'Young_Adult'
  }

  const derivePetType = (pet: typeof PETS[number]): 'Dog' | 'Cat' => {
    const breedLower = pet.breed.toLowerCase()
    const isDog = /(dog|retriever|labrador|beagle|terrier|shepherd|poodle|bulldog|husky)/i.test(breedLower)
    return isDog ? 'Dog' : 'Cat'
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
          
          // Prepare adoption prediction payload
          const adoptionPayload = {
            Type: derivePetType(pet),
            Age_Group: derivePetAgeGroup(pet),
            Size: petProfile.Pet_Size,
            Energy_Level: petProfile.Pet_Energy_Level,
            Grooming_Needs: petProfile.Pet_Grooming_Needs,
          }
          
          const [m, d, t, a] = await Promise.all([
            api.matchScore(payload),
            api.deepMatch(payload),
            api.autoTags({ description: pet.description }),
            api.adoptionPrediction(adoptionPayload),
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
            if (a && typeof a.predicted_days === 'number') {
              setAdoptionTimeline(prev => ({ ...prev, [pet.id]: a.predicted_days }))
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
      image: newPetForm.image || '/images/dog1.jpg', // Default placeholder image for dogs
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
      size: newPetForm.size,
      energy: newPetForm.energy,
      description: newPetForm.description,
      personality: newPetForm.personality || newPetForm.description,
      idealHome: newPetForm.idealHome || 'Loving home with care and attention',
      medicalHistory: 'Please inquire with shelter',
      isCustom: true, // Mark as custom companion
    }

    // Close dialog and show loading state
    setShowAddCompanionDialog(false)
    setLoading(true)

    try {
      // Fetch AI scores for the new pet
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

      // Prepare adoption prediction payload
      const adoptionPayload = {
        Type: derivePetType(newPet),
        Age_Group: derivePetAgeGroup(newPet),
        Size: petProfile.Pet_Size,
        Energy_Level: petProfile.Pet_Energy_Level,
        Grooming_Needs: petProfile.Pet_Grooming_Needs,
      }

      // Fetch all AI scores
      const [m, d, t, a] = await Promise.all([
        api.matchScore(payload),
        api.deepMatch(payload),
        api.autoTags({ description: newPet.description }),
        api.adoptionPrediction(adoptionPayload),
      ])

      // Update scores with AI results
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
      
      if (a && typeof a.predicted_days === 'number') {
        setAdoptionTimeline(prev => ({ ...prev, [newPet.id]: a.predicted_days }))
      }

      // Add to custom pets AFTER getting AI scores
      setCustomPets(prev => [...prev, newPet])

    } catch (e) {
      console.error('Error fetching scores for new pet:', e)
      // Still add the pet even if AI fails
      setCustomPets(prev => [...prev, newPet])
    } finally {
      setLoading(false)
    }

    // Reset form
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
      idealHome: ''
    })
    setImagePreview(null)
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

      {/* Loading Screen - Show until AI scores are loaded */}
      {loading && (
        <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
            <p className="text-xl font-semibold text-gray-900 mb-2">Finding Your Perfect Matches</p>
            <p className="text-sm text-gray-600">Our AI is analyzing compatibility scores...</p>
          </div>
        </div>
      )}

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
            <div className="flex-1 flex justify-center gap-4 items-center">
              {userPawsonality && (
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full">
                    <span className="text-2xl">{PAWSONALITY_TYPES[userPawsonality as keyof typeof PAWSONALITY_TYPES]?.emoji}</span>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900">{userPawsonality}</span>
                      <span className="text-xs text-gray-600">{PAWSONALITY_TYPES[userPawsonality as keyof typeof PAWSONALITY_TYPES]?.description}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* KNN Filter Badge */}
              {!loading && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full">
                    <span className="text-sm font-medium text-gray-900">
                      {showAllPets 
                        ? `All ${sortedPets.length} pets` 
                        : `${sortedPets.length} matches`}
                    </span>
                    <button
                      onClick={() => setShowAlgorithmInfo('knn')}
                      className="hover:bg-gray-100 rounded-full p-0.5 transition-colors"
                    >
                      <Info className="w-3 h-3 text-gray-500 hover:text-gray-700" />
                    </button>
                    <button
                      onClick={() => setShowAllPets(!showAllPets)}
                      className="ml-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-full transition-colors"
                    >
                      {showAllPets ? 'Filter' : 'Show All'}
                    </button>
                  </div>
                </div>
              )}
              
              {/* View Toggle */}
              <button
                onClick={() => setViewMode(viewMode === 'cards' ? 'grid' : 'cards')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-sm font-medium text-gray-700 transition-colors"
              >
                {viewMode === 'cards' ? <Grid3x3 className="w-4 h-4" /> : <LayoutList className="w-4 h-4" />}
                {viewMode === 'cards' ? 'Grid View' : 'Card View'}
              </button>
              
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
        {sortedPets.length === 0 && !loading && !showAllPets ? (
          /* No Matches Found */
          <div className="pt-24 pb-8 px-4 max-w-4xl mx-auto">
            <div className="bg-gray-50 rounded-xl p-12 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Close Matches Found</h2>
              <p className="text-gray-600 mb-4">
                Our KNN algorithm couldn't find pets matching your profile with at least {MIN_MATCH_THRESHOLD}% compatibility.
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setShowAllPets(true)}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                >
                  Show All Pets Anyway
                </button>
                <button
                  onClick={() => router.push('/quiz')}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Retake Quiz
                </button>
                <button
                  onClick={() => setShowAddCompanionDialog(true)}
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-medium transition-colors"
                >
                  Add a Pet Manually
                </button>
              </div>
            </div>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="pt-24 pb-8 px-4 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedPets.map((pet, index) => {
                const matchScore = scoresById[pet.id]?.compatibility ?? pet.compatibility
                const deepMatchScore = scoresById[pet.id]?.deepMatch ?? pet.deepMatch
                const adoptionDays = adoptionTimeline[pet.id]

                return (
                  <div
                    key={pet.id}
                    className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all hover:border-blue-300"
                  >
                    {/* Image */}
                    <div className="relative h-48 w-full">
                      <Image
                        src={pet.image}
                        alt={pet.name}
                        fill
                        className="object-cover"
                      />
                      {index === 0 && sortedPets.length > 1 && (
                        <div className="absolute top-2 left-2 bg-black text-white text-xs font-bold px-3 py-1 rounded-full">
                          ✨ Best Match
                        </div>
                      )}
                      {(pet as any).isCustom === true && (
                        <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                          🆕 Added
                        </div>
                      )}
                      {showAllPets && matchScore < MIN_MATCH_THRESHOLD && !((pet as any).isCustom) && (
                        <div className="absolute bottom-2 right-2 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                          Below Threshold
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{pet.name}, {pet.age.years}</h3>
                      <p className="text-sm text-gray-600 mb-3">{pet.breed}</p>

                      {/* Scores */}
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="bg-blue-50 rounded-lg p-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <p className="text-xs text-blue-600 font-medium">Match</p>
                            <button onClick={() => setShowAlgorithmInfo('svm')} className="hover:bg-blue-100 rounded-full p-0.5">
                              <Info className="w-3 h-3 text-blue-400" />
                            </button>
                          </div>
                          <p className="text-xl font-bold text-blue-700">{matchScore}%</p>
                        </div>
                        <div className="bg-purple-50 rounded-lg p-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <p className="text-xs text-purple-600 font-medium">Deep</p>
                            <button onClick={() => setShowAlgorithmInfo('ann')} className="hover:bg-purple-100 rounded-full p-0.5">
                              <Info className="w-3 h-3 text-purple-400" />
                            </button>
                          </div>
                          <p className="text-xl font-bold text-purple-700">{deepMatchScore}%</p>
                        </div>
                      </div>

                      {adoptionDays && (
                        <div className="bg-green-50 rounded-lg p-2 text-center mb-3">
                          <div className="flex items-center justify-center gap-1">
                            <p className="text-xs text-green-600 font-medium">Timeline</p>
                            <button onClick={() => setShowAlgorithmInfo('lr')} className="hover:bg-green-100 rounded-full p-0.5">
                              <Info className="w-3 h-3 text-green-400" />
                            </button>
                          </div>
                          <p className="text-lg font-bold text-green-700">{adoptionDays} days</p>
                        </div>
                      )}

                      {/* AI Tags from Naive Bayes */}
                      {tagsById[pet.id] && tagsById[pet.id].length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {tagsById[pet.id].slice(0, 4).map((tag, i) => (
                            <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedPet(pet)
                            setShowDetailsDialog(true)
                          }}
                          className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPet(pet)
                            setShowContactDialog(true)
                          }}
                          className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center transition-colors"
                        >
                          <Heart className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          /* Card View */
        <div 
          ref={scrollContainerRef} 
          className="snap-container h-screen overflow-y-scroll snap-y snap-mandatory"
        >
          {sortedPets.map((pet, index) => {
            const matchScore = scoresById[pet.id]?.compatibility ?? pet.compatibility
            const deepMatchScore = scoresById[pet.id]?.deepMatch ?? pet.deepMatch
            // Best match is the one with highest compatibility score (first in sorted array)
            const isBestMatch = index === 0 && sortedPets.length > 1

            return (
              <div 
                key={pet.id} 
                id={`pet-card-${index}`} 
                className="h-screen snap-start snap-always flex flex-col items-center justify-center px-4"
              >
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
                    
                    {/* Best Match Badge - Top Left */}
                    {isBestMatch && (
                      <div className="absolute top-4 left-4 bg-black text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        ✨ Best Match
                      </div>
                    )}

                    {/* Added Badge - Top Right */}
                    {(pet as any).isCustom === true && (
                      <div className="absolute top-4 right-4 bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        🆕 Added
                      </div>
                    )}
                    
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
                    
                    {/* Below Threshold Badge - Bottom Right */}
                    {showAllPets && matchScore < MIN_MATCH_THRESHOLD && !((pet as any).isCustom) && (
                      <div className="absolute bottom-20 right-4 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                        ⚠️ Below {MIN_MATCH_THRESHOLD}% Threshold
                      </div>
                    )}
                  </div>

                  {/* Right Side - Details */}
                  <div className="flex-1 p-6 max-h-96 relative" style={{ overflowY: 'auto', overflowX: 'visible' }}>
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
                    <div className="flex gap-8 mb-4 pr-16">
                      <div>
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-sm font-medium text-gray-500">Match</span>
                          <button
                            onClick={() => setShowAlgorithmInfo('svm')}
                            className="hover:bg-gray-100 rounded-full p-0.5 transition-colors"
                          >
                            <Info className="w-3 h-3 text-gray-400 hover:text-blue-600" />
                          </button>
                        </div>
                        <div className="flex items-center gap-0.5">
                          <p className="text-4xl font-bold text-gray-900">{matchScore}</p>
                          <span className="text-4xl font-bold text-gray-900">%</span>
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-sm font-medium text-gray-500">Deep</span>
                          <button
                            onClick={() => setShowAlgorithmInfo('ann')}
                            className="hover:bg-gray-100 rounded-full p-0.5 transition-colors"
                          >
                            <Info className="w-3 h-3 text-gray-400 hover:text-purple-600" />
                          </button>
                        </div>
                        <div className="flex items-center gap-0.5">
                           <p className="text-4xl font-bold text-gray-900">{deepMatchScore}</p>
                          <span className="text-4xl font-bold text-gray-900">%</span>
                        </div>
                      </div>
                      {adoptionTimeline[pet.id] && (
                        <div>
                          <div className="flex items-center gap-1 mb-1">
                            <span className="text-sm font-medium text-gray-500">Timeline</span>
                            <button
                              onClick={() => setShowAlgorithmInfo('lr')}
                              className="hover:bg-gray-100 rounded-full p-0.5 transition-colors"
                            >
                              <Info className="w-3 h-3 text-gray-400 hover:text-green-600" />
                            </button>
                          </div>
                          <div className="flex items-center gap-1">
                            <p className="text-4xl font-bold text-green-600">{adoptionTimeline[pet.id]}</p>
                            <span className="text-sm font-medium text-gray-600">days</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* AI Tags - Only show if available */}
                    <div className="mb-4">
                      {tagsById[pet.id] && tagsById[pet.id].length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-2">
                          {tagsById[pet.id].map((tag, i) => (
                            <span
                              key={i}
                              className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      {tagsById[pet.id] && tagsById[pet.id].length > 0 && (
                        <div className="flex items-center gap-1 mt-2">
                          <span className="text-xs text-gray-500">AI Tags</span>
                          <button
                            onClick={() => setShowAlgorithmInfo('nb')}
                            className="hover:bg-gray-100 rounded-full p-0.5 transition-colors"
                          >
                            <Info className="w-3 h-3 text-gray-400 hover:text-green-600" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* About Section */}
                    <div className="mb-4">
                      <h3 className="text-sm font-bold text-gray-900 mb-2">About</h3>
                      <p className="text-sm text-gray-700 leading-relaxed">{pet.description}</p>
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
        )}

        {/* Navigation Arrows - Far Right, Close Together - Only in Card View */}
        {viewMode === 'cards' && (
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
        )}
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
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <div className="flex items-center gap-1 mb-1">
                    <div className="text-xs font-semibold text-blue-600">Match</div>
                    <button onClick={() => setShowAlgorithmInfo('svm')} className="hover:bg-blue-100 rounded-full p-0.5">
                      <Info className="w-3 h-3 text-blue-400" />
                    </button>
                  </div>
                  <div className="text-3xl font-bold text-blue-700">
                    {scoresById[selectedPet.id]?.compatibility ?? selectedPet.compatibility}%
                  </div>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl">
                  <div className="flex items-center gap-1 mb-1">
                    <div className="text-xs font-semibold text-purple-600">Deep</div>
                    <button onClick={() => setShowAlgorithmInfo('ann')} className="hover:bg-purple-100 rounded-full p-0.5">
                      <Info className="w-3 h-3 text-purple-400" />
                    </button>
                  </div>
                  <div className="text-3xl font-bold text-purple-700">
                    {scoresById[selectedPet.id]?.deepMatch ?? selectedPet.deepMatch}%
                  </div>
                </div>
                {adoptionTimeline[selectedPet.id] && (
                  <div className="p-4 bg-green-50 rounded-xl">
                    <div className="flex items-center gap-1 mb-1">
                      <div className="text-xs font-semibold text-green-600">Timeline</div>
                      <button onClick={() => setShowAlgorithmInfo('lr')} className="hover:bg-green-100 rounded-full p-0.5">
                        <Info className="w-3 h-3 text-green-400" />
                      </button>
                    </div>
                    <div className="text-3xl font-bold text-green-700">
                      {adoptionTimeline[selectedPet.id]} <span className="text-base font-medium">days</span>
                    </div>
                  </div>
                )}
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



              {/* AI Tags */}
              {tagsById[selectedPet.id] && tagsById[selectedPet.id].length > 0 && (
                <div>
                  <div className="flex items-center gap-1 mb-2">
                    <h3 className="text-sm font-bold text-gray-900">AI Tags</h3>
                    <button onClick={() => setShowAlgorithmInfo('nb')} className="hover:bg-gray-100 rounded-full p-0.5">
                      <Info className="w-3 h-3 text-gray-400" />
                    </button>
                  </div>
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

            {/* Note: AI Tags will be automatically generated using Naive Bayes model */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">🤖 AI Tags:</span> Tags will be automatically generated from the description using our Naive Bayes model after you add the companion.
              </p>
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

      {/* Algorithm Info Dialog */}
      <Dialog open={showAlgorithmInfo !== null} onOpenChange={() => setShowAlgorithmInfo(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {showAlgorithmInfo && ALGORITHM_INFO[showAlgorithmInfo as keyof typeof ALGORITHM_INFO]?.title}
            </DialogTitle>
          </DialogHeader>
          
          {showAlgorithmInfo && (
            <div className="space-y-4 py-4">
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">What is it?</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {ALGORITHM_INFO[showAlgorithmInfo as keyof typeof ALGORITHM_INFO]?.description}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2">How we use it</h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {ALGORITHM_INFO[showAlgorithmInfo as keyof typeof ALGORITHM_INFO]?.use}
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button onClick={() => setShowAlgorithmInfo(null)} className="w-full">
              Got it!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
