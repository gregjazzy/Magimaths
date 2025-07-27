'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Clock, Star, CheckCircle, Play, Zap, Trophy, Timer, Target } from 'lucide-react'

export default function CPCalculMental() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const sections = [
    {
      id: 'debut-annee',
      title: 'Début d\'année',
      subtitle: 'Les premiers pas du ninja !',
      description: 'Calculs jusqu\'à 10 avec des défis rigolos et des chronos adaptés',
      icon: '🐣',
      duration: '20 min',
      xp: 30,
      color: 'from-green-400 to-emerald-500',
      verified: true,
      level: 'Débutant',
      features: ['⚡ Calculs jusqu\'à 10', '🎯 Défis mignons', '⏱️ Chronos doux', '🎮 Mini-jeux'],
      challenges: ['🏃‍♂️ Course aux additions', '🧩 Puzzle des soustractions', '🎲 Dé magique', '👨‍👩‍👧‍👦 Défi famille']
    },
    {
      id: 'milieu-annee',
      title: 'Milieu d\'année',
      subtitle: 'Le guerrier s\'entraîne !',
      description: 'Calculs jusqu\'à 20 avec des défis plus corsés et des chronos motivants',
      icon: '⚔️',
      duration: '25 min',
      xp: 45,
      color: 'from-blue-400 to-cyan-500',
      verified: true,
      level: 'Intermédiaire',
      features: ['⚡ Calculs jusqu\'à 20', '🔥 Défis sportifs', '⏱️ Chronos challenge', '🎮 Jeux d\'action'],
      challenges: ['🏆 Tournoi du calcul', '🎯 Précision ninja', '⚡ Speed mental', '🥊 Combat parents']
    },
    {
      id: 'fin-annee',
      title: 'Fin d\'année',
      subtitle: 'Le maître du calcul !',
      description: 'Calculs complexes avec des défis de champion et des chronos de pro',
      icon: '👑',
      duration: '30 min',
      xp: 60,
      color: 'from-purple-400 to-pink-500',
      verified: true,
      level: 'Expert',
      features: ['⚡ Calculs avancés', '🏆 Défis épiques', '⏱️ Chronos pro', '🎮 Jeux de maître'],
      challenges: ['🔥 Défi ultime', '⚡ Lightning round', '🏅 Champion du CP', '😎 Boss final parents']
    }
  ]

  const getSectionPath = (sectionId: string) => {
    return `/chapitre/cp-calcul-mental/${sectionId}`
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Débutant': return 'bg-green-100 text-green-800'
      case 'Intermédiaire': return 'bg-blue-100 text-blue-800'
      case 'Expert': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 relative overflow-hidden">
      {/* Particules animées pour l'effet gaming */}
      <div className="absolute inset-0 pointer-events-none">
      </div>

      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link 
              href="/cp" 
              className="p-2 sm:p-3 hover:bg-white/60 rounded-xl transition-colors touch-manipulation bg-white/40 backdrop-blur-sm"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold text-cyan-800 flex items-center">
                Calcul mental
              </h1>
              <p className="text-cyan-700 text-sm sm:text-base mt-1 sm:mt-2">
                Deviens un ninja du calcul rapide ! ⚡🥷
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4 text-sm sm:text-base">
            <div className="flex items-center space-x-1 sm:space-x-2 bg-white/60 px-3 sm:px-4 py-2 rounded-full">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
              <span className="font-semibold text-cyan-700">
                {sections.reduce((total, section) => total + section.xp, 0)} XP
              </span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 bg-white/60 px-3 sm:px-4 py-2 rounded-full">
              <Timer className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-600" />
              <span className="font-semibold text-cyan-700">3 niveaux</span>
            </div>
          </div>
        </div>

        {/* Introduction gaming */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-8 mb-6 sm:mb-8 border border-cyan-200/50 shadow-xl">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-cyan-800 mb-3 sm:mb-4">
              🎮 Entraînement de ninja mathématique ! 🥷
            </h2>
            <p className="text-cyan-700 mb-6">
              3 niveaux progressifs pour devenir le champion du calcul mental !
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-6 text-center">
              <div className="bg-cyan-100/70 rounded-xl p-3 sm:p-4">
                <div className="text-2xl sm:text-3xl mb-2">⚡</div>
                <h3 className="font-bold text-cyan-800 text-sm sm:text-base">Speed</h3>
                <p className="text-cyan-600 text-xs sm:text-sm">Calcul ultra-rapide</p>
              </div>
              <div className="bg-cyan-100/70 rounded-xl p-3 sm:p-4">
                <div className="text-2xl sm:text-3xl mb-2">🏆</div>
                <h3 className="font-bold text-cyan-800 text-sm sm:text-base">Défis</h3>
                <p className="text-cyan-600 text-xs sm:text-sm">Challenges épiques</p>
              </div>
              <div className="bg-cyan-100/70 rounded-xl p-3 sm:p-4">
                <div className="text-2xl sm:text-3xl mb-2">⏱️</div>
                <h3 className="font-bold text-cyan-800 text-sm sm:text-base">Chronos</h3>
                <p className="text-cyan-600 text-xs sm:text-sm">Course contre la montre</p>
              </div>
              <div className="bg-cyan-100/70 rounded-xl p-3 sm:p-4">
                <div className="text-2xl sm:text-3xl mb-2">👨‍👩‍👧‍👦</div>
                <h3 className="font-bold text-cyan-800 text-sm sm:text-base">Famille</h3>
                <p className="text-cyan-600 text-xs sm:text-sm">Défie tes parents !</p>
              </div>
            </div>
          </div>
        </div>

        {/* Niveaux */}
        <div className="space-y-8">
          {sections.map((section, index) => (
            <div key={section.id} className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-xl border border-white/50">
              {/* Header du niveau */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className={`
                    w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl shadow-lg
                    bg-gradient-to-br ${section.color} text-white
                    transform hover:scale-110 hover:rotate-6 transition-all duration-300
                  `}>
                    {section.icon}
                  </div>
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-2xl sm:text-3xl font-bold text-gray-800">
                        {section.title}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(section.level)}`}>
                        {section.level}
                      </span>
                    </div>
                    <p className="text-lg font-semibold text-gray-600 mb-1">
                      {section.subtitle}
                    </p>
                    <p className="text-gray-600">
                      {section.description}
                    </p>
                  </div>
                </div>
                
                <Link
                  href={getSectionPath(section.id)}
                  className="group block touch-manipulation"
                >
                  <div className={`
                    flex items-center px-6 py-3 rounded-xl text-white font-bold text-lg shadow-lg
                    bg-gradient-to-r ${section.color}
                    transform group-hover:scale-105 group-hover:-translate-y-1 transition-all duration-300
                    touch-manipulation
                  `}>
                    <Play className="w-5 h-5 mr-2" />
                    <span>Jouer !</span>
                  </div>
                </Link>
              </div>

              {/* Features et challenges */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Features */}
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-gray-800 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-cyan-600" />
                    Fonctionnalités
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {section.features.map((feature, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-3 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Challenges */}
                <div className="space-y-4">
                  <h4 className="text-lg font-bold text-gray-800 flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
                    Défis inclus
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {section.challenges.map((challenge, idx) => (
                      <div key={idx} className={`
                        bg-gradient-to-r ${section.color} bg-opacity-10 rounded-lg p-3 text-sm font-medium
                        hover:bg-opacity-20 transition-all duration-300 cursor-pointer
                        border border-transparent hover:border-current
                      `}>
                        {challenge}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{section.duration}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="text-yellow-600 font-semibold">{section.xp} XP</span>
                  </div>
                  {section.verified && (
                    <div className="flex items-center space-x-1 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-xs font-semibold">Vérifié</span>
                    </div>
                  )}
                </div>
                
                  {index === 0 && '🌟'}
                  {index === 1 && '🔥'}
                  {index === 2 && '💎'}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Motivation finale */}
        <div className="mt-8 sm:mt-12 bg-gradient-to-r from-cyan-100/80 to-blue-100/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-cyan-200/50 text-center">
          <h3 className="text-xl sm:text-2xl font-bold text-cyan-800 mb-4 flex items-center justify-center">
            Mission : Devenir le champion du calcul mental !
          </h3>
          
          <p className="text-cyan-700 mb-6 text-lg">
            Progresse niveau par niveau et deviens imbattable en calcul rapide ! 
            Tes parents n'auront qu'à bien se tenir ! 😎
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="bg-white/60 rounded-xl p-4">
              <div className="text-2xl mb-2">🎮</div>
              <h4 className="font-bold text-cyan-800">Gaming</h4>
              <p className="text-cyan-600">Apprendre en s'amusant</p>
            </div>
            <div className="bg-white/60 rounded-xl p-4">
              <div className="text-2xl mb-2">⚡</div>
              <h4 className="font-bold text-cyan-800">Rapidité</h4>
              <p className="text-cyan-600">Calcul ultra-rapide</p>
            </div>
            <div className="bg-white/60 rounded-xl p-4">
              <div className="text-2xl mb-2">👨‍👩‍👧‍👦</div>
              <h4 className="font-bold text-cyan-800">Famille</h4>
              <p className="text-cyan-600">Défis avec les parents</p>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-6 sm:mt-8 text-center">
          <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer">
            <span>🚀</span>
            <span>Prêt pour l'entraînement ninja ?</span>
            <span>🥷</span>
          </div>
        </div>
      </div>
    </div>
  )
} 