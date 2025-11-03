import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import HowItWorks from '@/components/HowItWorks'
import ScrollStack from '@/components/ScrollStack'
import PawsonalityQuiz from '@/components/PawsonalityQuiz'
import SwipeCards from '@/components/SwipeCards'
import Features from '@/components/Features'

export default function Page() {
  return (
    <main className="min-h-screen">
      {/* Navbar */}
      <Navbar />
      
      {/* Hero Section with Big Text */}
      <Hero />

      {/* How It Works Section */}
      <HowItWorks />
      
      {/* Features Grid */}
      <Features />

      {/* Personality Quiz Section */}
      <PawsonalityQuiz />

      {/* Swipe Cards Section */}
      <SwipeCards />

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              FurEver.AI
            </h3>
            <p className="text-gray-600">
              Powered by PawTech Inc. • Making perfect matches since 2025
            </p>
          </div>
          <div className="flex justify-center gap-8 text-sm text-gray-600">
            <a href="#" className="hover:text-blue-600 transition">About</a>
            <a href="#" className="hover:text-blue-600 transition">For Shelters</a>
            <a href="#" className="hover:text-blue-600 transition">Privacy</a>
            <a href="#" className="hover:text-blue-600 transition">Contact</a>
          </div>
        </div>
      </footer>
    </main>
  )
}