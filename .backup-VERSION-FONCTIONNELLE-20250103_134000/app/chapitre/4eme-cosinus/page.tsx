'use client'

import { useState } from 'react'
import { ChevronLeft, Clock, Trophy, Play } from 'lucide-react'
import Link from 'next/link'

export default function Cosinus4emePage() {
  const [hoveredChapter, setHoveredChapter] = useState<string | null>(null)
  
  const subChapters = [
    {
      id: '4eme-cosinus-introduction',
      title: 'Introduction au cosinus',
      description: 'Découvrir le cosinus dans le triangle rectangle avec animations 📐',
      icon: '📐',
      difficulty: 'beginner',
      estimatedTime: 15,
      verified: true
    },
    {
      id: '4eme-cosinus-calculs',
      title: 'Calculs et valeurs remarquables',
      description: 'Calculer le cosinus et mémoriser les valeurs importantes 🧮',
      icon: '🧮',
      difficulty: 'intermediate',
      estimatedTime: 20,
      verified: true
    },
    {
      id: '4eme-cosinus-applications',
      title: 'Applications et problèmes',
      description: 'Résoudre des problèmes concrets avec le cosinus 🏗️',
      icon: '🏗️',
      difficulty: 'intermediate',
      estimatedTime: 18,
      verified: true
    },
    {
      id: '4eme-cosinus-constructions',
      title: 'Constructions géométriques',
      description: 'Construire des angles et des figures avec le cosinus 📏',
      icon: '📏',
      difficulty: 'intermediate',
      estimatedTime: 22,
      verified: true
    }
  ]
  
  const config = { color: '#e74c3c', icon: 'cos', name: 'Cosinus - 4ème' }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-pink-50 relative overflow-hidden">
      {/* Particules de fond pour l'effet magique */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-red-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-orange-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-20 w-56 h-56 bg-pink-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-40 right-40 w-32 h-32 bg-red-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Header moderne */}
      <div className="relative z-10 bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link href="/4eme" className="p-2 hover:bg-white/60 rounded-lg transition-colors">
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {config.icon}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{config.name}</h1>
                  <p className="text-gray-600 mt-1">Perfectionnez votre maîtrise du cosinus d'un angle aigu</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Grille des chapitres */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Chapitres */}
          {subChapters.map((chapter) => {
            const totalXP = chapter.estimatedTime * 2
            return (
              <div key={chapter.id} className="group relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 hover:border-white/40 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 overflow-hidden">
                {/* Barre colorée animée */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1 transition-all duration-500 group-hover:h-2"
                  style={{ background: `linear-gradient(90deg, ${config.color}, ${config.color}80, ${config.color}60)` }}
                />
                
                {/* Badge vérifié */}
                {chapter.verified && (
                  <div className="absolute top-2 right-2 z-20">
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
                      <span>✓</span>
                      <span>VÉRIFIÉ</span>
                    </div>
                  </div>
                )}
                
                {/* Particules magiques */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                </div>
                <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="w-1 h-1 bg-red-400 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-center space-x-4 mb-4">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-xl transform group-hover:scale-125 group-hover:rotate-6 transition-all duration-300"
                      style={{ background: `linear-gradient(135deg, ${config.color}, ${config.color}AA, ${config.color}80)` }}
                    >
                      {chapter.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-red-600 transition-colors">{chapter.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                          {chapter.difficulty}
                        </span>
                        <div className="flex items-center text-green-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                          <span className="text-xs font-medium">Disponible</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {chapter.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{chapter.estimatedTime} min</span>
                      </div>
                      <div className="flex items-center text-orange-500">
                        <Trophy className="w-4 h-4 mr-1" />
                        <span>{totalXP} XP</span>
                      </div>
                    </div>
                    
                    <Link href={`/chapitre/${chapter.id}`}>
                      <button className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                        <Play className="w-4 h-4" />
                        <span className="font-medium">Commencer</span>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  )
} 