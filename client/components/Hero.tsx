'use client'
import React from 'react'
import { LayoutGroup, motion } from "motion/react"
import { Star } from "lucide-react"
import TextRotate from "@/components/fancy/text/text-rotate"

export default function Hero() {
  return (
    <section className="relative overflow-hidden min-h-screen pt-24 sm:pt-32 md:pt-40 pb-12 sm:pb-16 md:pb-20 flex items-center">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="text-left max-w-5xl">
          {/* Main Headline with Text Rotation */}
          <LayoutGroup>
            <motion.h1
              className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 flex flex-col items-start justify-start gap-y-1 sm:gap-y-2 text-left leading-tight"
              layout
            >
              <motion.span
                className="inline-block"
                layout
                transition={{ type: "spring", damping: 30, stiffness: 400 }}
              >
                Meet your new
              </motion.span>
              <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 mt-1 text-3xl xs:text-4xl sm:text-5xl md:text-6xl">
                <span className="text-gray-900">Furever</span>
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
              </div>
            </motion.h1>
          </LayoutGroup>

          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mb-6 sm:mb-8 leading-relaxed">
            Match your personality with the perfect pet companion using AI-powered insights to find your ideal furry friend, anywhere in the world.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-start justify-start gap-3 sm:gap-4">


            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 sm:py-3.5 bg-black text-white rounded-md font-medium text-sm sm:text-base hover:bg-zinc-700 transition-colors shadow-sm relative z-20 flex items-center justify-center gap-2"
            >
              <Star className="w-4 h-4 sm:w-5 sm:h-5" />
              Star on GitHub
            </a>


            <a
              href="/browse"
              className="px-6 py-3 sm:py-3.5 bg-blue-600 text-white rounded-md font-medium text-sm sm:text-base hover:bg-blue-700 transition-colors shadow-sm relative z-20 text-center"
            >
              Match a Companion
            </a>
          </div>
        </div>
      </div>

      {/* Subtle scroll indicator */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-300 animate-bounce" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </section>
  )
}
