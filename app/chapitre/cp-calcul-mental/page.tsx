'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Clock, Star, CheckCircle, Play } from 'lucide-react'

export default function CPCalculMental() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const sections = [
    {
      id: 'additions-simples',
      title: 'Additions simples',
      description: 'Apprendre à calculer rapidement des additions jusqu\'à 20',
      icon: '➕',
      duration: '12 min',
      xp: 20,
      color: 'from-green-500 to-emerald-500',
      verified: true
    },
    {
      id: 'soustractions-simples',
      title: 'Soustractions simples',
      description: 'Calculer des soustractions rapidement jusqu\'à 20',
      icon: '➖',
      duration: '12 min',
      xp: 20,
      color: 'from-red-500 to-pink-500',
      verified: true
    },
    {
      id: 'complements-10',
      title: 'Compléments à 10',
      description: 'Trouver rapidement ce qui manque pour faire 10',
      icon: '🔟',
      duration: '10 min',
      xp: 15,
      color: 'from-blue-500 to-cyan-500',
      verified: true
    },
    {
      id: 'doubles-moities',
      title: 'Doubles et moitiés',
      description: 'Maîtriser les doubles et leurs moitiés',
      icon: '🔄',
      duration: '8 min',
      xp: 15,
      color: 'from-purple-500 to-violet-500',
      verified: true
    },
    {
      id: 'multiplications-2-5-10',
      title: 'Tables de 2, 5 et 10',
      description: 'Premières tables de multiplication simples',
      icon: '✖️',  
      duration: '15 min',
      xp: 25,
      color: 'from-orange-500 to-red-500',
      verified: true
    }
  ]

  const getSectionPath = (sectionId: string) => {
    return `/chapitre/cp-calcul-mental/${sectionId}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link 
              href="/cp" 
              className="p-2 sm:p-3 hover:bg-white/60 rounded-xl transition-colors touch-manipulation bg-white/40 backdrop-blur-sm"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 leading-tight">
                🧠 Calcul Mental CP
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Développe tes réflexes mathématiques !
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="flex items-center space-x-2 bg-yellow-100 px-3 py-2 rounded-full">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium text-yellow-700">Niveau CP</span>
            </div>
          </div>
        </div>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className="group bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer"
              onClick={() => window.location.href = getSectionPath(section.id)}
            >
              {/* Header de la section */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${section.color} flex items-center justify-center text-xl sm:text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                  {section.icon}
                </div>
                <div className="flex items-center space-x-2">
                  {section.verified && (
                    <CheckCircle className="w-5 h-5 text-green-500 fill-current" />
                  )}
                  <div className="flex items-center space-x-1 text-xs sm:text-sm text-gray-500">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{section.duration}</span>
                  </div>
                </div>
              </div>

              {/* Contenu */}
              <div className="space-y-3">
                <div>
                  <h3 className="font-bold text-lg sm:text-xl text-gray-800 group-hover:text-gray-900 transition-colors leading-tight">
                    {section.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mt-1 leading-relaxed">
                    {section.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1 bg-amber-100 px-2 py-1 rounded-full">
                      <Star className="w-3 h-3 text-amber-500 fill-current" />
                      <span className="text-xs font-medium text-amber-700">+{section.xp} XP</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-blue-600 group-hover:text-blue-700 transition-colors">
                    <Play className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium">Commencer</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section conseils */}
        <div className="mt-8 sm:mt-12 bg-white/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/20">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
              💡 Conseils pour réussir
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Quelques astuces pour développer tes compétences en calcul mental
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div>
              <div className="text-2xl sm:text-3xl mb-2">🎯</div>
              <div className="font-bold text-sm sm:text-base mb-1">Concentre-toi</div>
              <div className="text-xs sm:text-sm opacity-90">Évite les distractions pendant les exercices</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl mb-2">🚀</div>
              <div className="font-bold text-sm sm:text-base mb-1">Progresse</div>
              <div className="text-xs sm:text-sm opacity-90">Commence facile, puis augmente la difficulté</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl mb-2">🔄</div>
              <div className="font-bold text-sm sm:text-base mb-1">Entraîne-toi</div>
              <div className="text-xs sm:text-sm opacity-90">Quelques minutes chaque jour</div>
            </div>
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="text-2xl sm:text-3xl mb-2">😊</div>
              <div className="font-bold text-sm sm:text-base mb-1">Amuse-toi</div>
              <div className="text-xs sm:text-sm opacity-90">Les maths, c'est un jeu !</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 