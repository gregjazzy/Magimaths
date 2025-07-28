'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Clock, Star, CheckCircle, Play } from 'lucide-react'

export default function CPMultiplicationsSimples() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const sections = [
    {
      id: 'sens-multiplication',
      title: 'Le sens de la multiplication',
      description: 'Comprendre ce que veut dire multiplier avec des objets',
      icon: '🤔',
      duration: '8 min',
      xp: 15,
      color: 'from-pink-500 to-rose-500',
      verified: true
    },
    {
      id: 'groupes-egaux',
      title: 'Groupes égaux',
      description: 'Faire des groupes qui ont le même nombre d\'objets',
      icon: '👥',
      duration: '10 min',
      xp: 18,
      color: 'from-blue-500 to-cyan-500',
      verified: true
    },
    {
      id: 'addition-repetee',
      title: 'Addition répétée',
      description: 'Additionner le même nombre plusieurs fois',
      icon: '🔄',
      duration: '12 min',
      xp: 20,
      color: 'from-purple-500 to-violet-500',
      verified: true
    },
    {
      id: 'table-2',
      title: 'Table de 2',
      description: 'Apprendre à compter de 2 en 2',
      icon: '2️⃣',
      duration: '15 min',
      xp: 25,
      color: 'from-green-500 to-emerald-500',
      verified: true
    },
    {
      id: 'table-5',
      title: 'Table de 5',
      description: 'Apprendre à compter de 5 en 5',
      icon: '5️⃣',
      duration: '15 min',
      xp: 25,
      color: 'from-yellow-500 to-orange-500',
      verified: true
    },
    {
      id: 'table-10',
      title: 'Table de 10',
      description: 'Apprendre à compter de 10 en 10',
      icon: '🔟',
      duration: '12 min',
      xp: 22,
      color: 'from-indigo-500 to-blue-500',
      verified: true
    },
    {
      id: 'problemes-simples',
      title: 'Problèmes simples',
      description: 'Résoudre des petits problèmes de multiplication',
      icon: '🧩',
      duration: '18 min',
      xp: 30,
      color: 'from-red-500 to-pink-500',
      verified: true
    }
  ]

  const getSectionPath = (sectionId: string) => {
    return `/chapitre/cp-multiplications-simples/${sectionId}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Link 
              href="/cp" 
              className="p-2 sm:p-3 hover:bg-white/60 rounded-xl transition-colors touch-manipulation bg-white/40 backdrop-blur-sm"
            >
              <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold text-emerald-800 flex items-center">
                <span className="mr-3 text-3xl sm:text-5xl">✖️</span>
                Premières multiplications
              </h1>
              <p className="text-emerald-700 text-sm sm:text-base mt-1 sm:mt-2">
                Découvre la magie de la multiplication ! 🪄
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4 text-sm sm:text-base">
            <div className="flex items-center space-x-1 sm:space-x-2 bg-white/60 px-3 sm:px-4 py-2 rounded-full">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
              <span className="font-semibold text-emerald-700">
                {sections.reduce((total, section) => total + section.xp, 0)} XP
              </span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2 bg-white/60 px-3 sm:px-4 py-2 rounded-full">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />
              <span className="font-semibold text-emerald-700">{sections.length} activités</span>
            </div>
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-8 mb-6 sm:mb-8 border border-emerald-200/50 shadow-xl">
          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-emerald-800 mb-3 sm:mb-4">
              🌟 Bienvenue dans le monde magique des multiplications ! 🌟
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 text-center">
              <div className="bg-emerald-100/70 rounded-xl p-3 sm:p-4">
                <div className="text-2xl sm:text-3xl mb-2">👥</div>
                <h3 className="font-bold text-emerald-800 text-sm sm:text-base">Groupes</h3>
                <p className="text-emerald-600 text-xs sm:text-sm">Regrouper des objets</p>
              </div>
              <div className="bg-emerald-100/70 rounded-xl p-3 sm:p-4">
                <div className="text-2xl sm:text-3xl mb-2">🔄</div>
                <h3 className="font-bold text-emerald-800 text-sm sm:text-base">Répétition</h3>
                <p className="text-emerald-600 text-xs sm:text-sm">Additionner plusieurs fois</p>
              </div>
              <div className="bg-emerald-100/70 rounded-xl p-3 sm:p-4">
                <div className="text-2xl sm:text-3xl mb-2">🧮</div>
                <h3 className="font-bold text-emerald-800 text-sm sm:text-base">Tables</h3>
                <p className="text-emerald-600 text-xs sm:text-sm">Apprendre les premières tables</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {sections.map((section, index) => (
            <Link
              key={section.id}
              href={getSectionPath(section.id)}
              className="group block touch-manipulation"
            >
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-6 shadow-lg border border-white/50 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 active:scale-[0.98] will-change-transform">
                {/* Header avec icône et badge vérifié */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`
                    w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-lg
                    bg-gradient-to-br ${section.color} text-white
                    transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300
                  `}>
                    {section.icon}
                  </div>
                  {section.verified && (
                    <div className="flex items-center space-x-1 bg-green-100 text-green-800 px-2 sm:px-3 py-1 rounded-full text-xs font-semibold">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline">Vérifié</span>
                      <span className="sm:hidden">✓</span>
                    </div>
                  )}
                </div>
                
                {/* Titre */}
                <h3 className="font-bold text-base sm:text-lg text-gray-800 mb-2 sm:mb-3 group-hover:text-emerald-700 transition-colors leading-tight">
                  {section.title}
                </h3>
                
                {/* Description */}
                <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-5 leading-relaxed group-hover:text-gray-700">
                  {section.description}
                </p>
                
                {/* Stats */}
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500" />
                      <span className="text-gray-600">{section.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                      <span className="text-yellow-600 font-semibold">{section.xp} XP</span>
                    </div>
                  </div>
                  
                  <div className={`
                    flex items-center px-2 sm:px-3 py-1 sm:py-2 rounded-lg text-white font-semibold text-xs sm:text-sm
                    bg-gradient-to-r ${section.color} shadow-sm
                    transform group-hover:scale-105 transition-all duration-300
                    min-h-[24px] sm:min-h-[32px] touch-manipulation
                  `}>
                    <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <span>Jouer</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Ce qu'il faut retenir */}
        <div className="mt-8 sm:mt-12 bg-gradient-to-r from-emerald-100/80 to-teal-100/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-emerald-200/50">
          <h3 className="text-lg sm:text-xl font-bold text-emerald-800 mb-3 sm:mb-4 flex items-center">
            <span className="mr-2 sm:mr-3 text-xl sm:text-2xl">🎯</span>
            Ce qu'il faut retenir (Programme officiel)
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 text-sm sm:text-base">
            <div>
              <h4 className="font-semibold text-emerald-700 mb-2 sm:mb-3">✨ Objectifs :</h4>
              <ul className="space-y-1 sm:space-y-2 text-emerald-600">
                <li>• Comprendre le sens de la multiplication</li>
                <li>• Reconnaître des groupes égaux</li>
                <li>• Faire le lien avec l'addition répétée</li>
                <li>• Mémoriser les tables de 2, 5 et 10</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-emerald-700 mb-2 sm:mb-3">🎲 Compétences :</h4>
              <ul className="space-y-1 sm:space-y-2 text-emerald-600">
                <li>• Dénombrer des collections organisées</li>
                <li>• Utiliser la commutativité</li>
                <li>• Résoudre des problèmes simples</li>
                <li>• Calculer mentalement</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Progression indicator */}
        <div className="mt-6 sm:mt-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-emerald-200/50">
            <span className="text-emerald-700 font-medium text-sm sm:text-base">
              Prêt pour l'aventure des multiplications ? 
            </span>
            <div className="text-lg sm:text-xl">🚀</div>
          </div>
        </div>
      </div>
    </div>
  )
} 