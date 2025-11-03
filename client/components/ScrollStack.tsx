'use client'
import React from 'react'

const FEATURES = [
  {
    title: 'Personality Assessment',
    description: 'Complete our comprehensive 5-minute quiz to discover your unique compatibility profile and lifestyle preferences',
    icon: '📝',
  },
  {
    title: 'Smart Matching',
    description: 'Our AI analyzes thousands of data points to find pets that truly match your personality and living situation',
    icon: '🎯',
  },
  {
    title: 'Detailed Profiles',
    description: 'Access comprehensive pet profiles with behavioral insights, health records, and compatibility scores',
    icon: '📊',
  },
  {
    title: 'Transparent Process',
    description: 'Understand exactly why each pet is a match with clear, data-driven explanations',
    icon: '💡',
  },
]

export default function ScrollStack() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our scientifically-backed matching process ensures successful, long-term adoptions
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {FEATURES.map((feature, idx) => (
            <div 
              key={idx}
              className="bg-white p-8 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
