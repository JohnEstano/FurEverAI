'use client'
import React from 'react'
import { LayoutGroup, motion } from "motion/react"
import { Star } from "lucide-react"
import TextRotate from "@/components/fancy/text/text-rotate"

export default function Hero() {
  return (
    <section className="relative overflow-hidden min-h-screen pt-32 md:pt-40 pb-20 md:pb-32">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(/images/5.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* Main Headline with Text Rotation */}
          <LayoutGroup>
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 flex flex-wrap items-center justify-center gap-x-4"
              layout
            >
              <motion.span
                className="inline-block"
                layout
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
              >
                Meet your new Furever 
              </motion.span>
              <TextRotate
                texts={[
                  "Best Friend.",
                  "Companion.",
                  "Family Member.",
                  "Soulmate.",
                ]}
                mainClassName="text-blue-600 inline-flex"
                staggerFrom="first"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "-120%" }}
                staggerDuration={0.025}
                splitLevelClassName="overflow-hidden"
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                rotationInterval={2500}
              />
            </motion.h1>
          </LayoutGroup>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Match your personality with the perfect pet companion using AI-powered insights to find your ideal furry friend, anywhere in the world.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => document.getElementById('quiz')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-blue-600 text-white rounded-md font-medium text-lg hover:bg-blue-700 transition-colors shadow-sm relative z-20"
            >
              Match a Companion
            </button>
            
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-black text-white rounded-md font-medium text-lg hover:bg-zinc-700 transition-colors shadow-sm relative z-20 flex items-center gap-2"
            >
              <Star className="w-5 h-5" />
              Star on GitHub
            </a>
          </div>
        </div>
      </div>

      {/* Subtle scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <svg className="w-6 h-6 text-gray-300 animate-bounce" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  )
}
