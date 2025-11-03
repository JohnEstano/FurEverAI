'use client'
import React from 'react'
import { motion } from 'motion/react'

const FEATURES = [
  {
    icon: '🧠',
    title: 'Decision Tree',
    subtitle: 'Personality Assessment',
    description: 'Classifies you into 8 distinct personality types based on your lifestyle and preferences',
    gradient: 'from-purple-100 to-pink-100',
    iconBg: 'bg-purple-200',
  },
  {
    icon: '🎯',
    title: 'Support Vector Machine',
    subtitle: 'Core Matching',
    description: 'Calculates compatibility scores between you and pets using advanced ML algorithms',
    gradient: 'from-blue-100 to-cyan-100',
    iconBg: 'bg-blue-200',
  },
  {
    icon: '🏷️',
    title: 'Naive Bayes',
    subtitle: 'Auto-Tagging',
    description: 'Automatically tags pet descriptions with relevant traits for easy filtering',
    gradient: 'from-green-100 to-emerald-100',
    iconBg: 'bg-green-200',
  },
  {
    icon: '🔍',
    title: 'K-Nearest Neighbors',
    subtitle: 'Smart Recommendations',
    description: 'Suggests similar pets when you show interest in an animal',
    gradient: 'from-orange-100 to-amber-100',
    iconBg: 'bg-orange-200',
  },
  {
    icon: '🧬',
    title: 'Neural Network',
    subtitle: 'Deep Matching',
    description: 'Provides advanced compatibility analysis finding complex patterns',
    gradient: 'from-rose-100 to-red-100',
    iconBg: 'bg-rose-200',
  },
  {
    icon: '📊',
    title: 'Linear Regression',
    subtitle: 'Adoption Predictions',
    description: 'Estimates how long pets will stay in shelter based on match data',
    gradient: 'from-indigo-100 to-violet-100',
    iconBg: 'bg-indigo-200',
  },
]

export default function Features() {
  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4 px-4">
            Powered by Six AI Algorithms
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto px-4">
            Our sophisticated machine learning system ensures perfect matches through multi-layered analysis
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {FEATURES.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08 }}
              className="group"
            >
              <div className={`bg-gradient-to-br ${feature.gradient} rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 hover:shadow-lg transition-all duration-300 h-full border border-gray-100`}>
                <div className={`w-12 h-12 sm:w-14 sm:h-14 ${feature.iconBg} rounded-lg sm:rounded-xl flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-2xl sm:text-3xl">{feature.icon}</span>
                </div>
                <div className="text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5 sm:mb-2">
                  {feature.subtitle}
                </div>
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
