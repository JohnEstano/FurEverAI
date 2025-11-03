'use client'
import React from 'react'
import { motion } from 'motion/react'

const STEPS = [
  {
    image: '/images/1.png',
    title: 'Take the Personality Quiz',
    description: 'Answer questions about your lifestyle and preferences to help our AI understand your unique personality.',
    color: 'bg-gradient-to-br from-pink-400 to-rose-500',
  },
  {
    image: '/images/2.png',
    title: 'AI Matches Your Profile',
    description: 'Advanced algorithms compare your profile against thousands of shelter pets to find perfect matches.',
    color: 'bg-gradient-to-br from-blue-400 to-indigo-500',
  },
  {
    image: '/images/3.png',
    title: 'Browse Your Matches',
    description: 'Swipe through personalized recommendations ranked by compatibility with detailed match insights.',
    color: 'bg-gradient-to-br from-emerald-400 to-teal-500',
  },
  {
    image: '/images/4.png',
    title: 'Connect & Adopt',
    description: 'Connect with shelters to schedule meet-and-greets and start your journey with your new companion.',
    color: 'bg-gradient-to-br from-amber-400 to-orange-500',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-12 sm:py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto px-4">
            Find your perfect pet companion in four simple steps
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {STEPS.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="flex flex-col"
            >
              {/* Image Card with Sharp Color Background */}
              <div className={`${step.color} rounded-lg sm:rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 mb-3 sm:mb-4 aspect-square group`}>
                <img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Text Content Outside Card */}
              <div className="flex-1 px-2 sm:px-0">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
