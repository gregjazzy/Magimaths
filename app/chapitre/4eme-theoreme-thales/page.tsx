'use client'

import { useState } from 'react'
import { ChevronLeft, Clock, Trophy, Play } from 'lucide-react'
import Link from 'next/link'
import { getSubChapters } from '@/lib/chapters'

export default function TheoremeThalePage() {
  const [hoveredChapter, setHoveredChapter] = useState<string | null>(null)
  
  const subChapters = getSubChapters('4eme-theoreme-thales')
  const config = { color: '#10b981', icon: '⫽', name: 'Théorème de Thalès - 4ème' }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Particules de fond pour l'effet magique */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-green-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-emerald-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-20 w-56 h-56 bg-teal-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-40 right-40 w-32 h-32 bg-green-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Header moderne */}
      <header className="relative bg-white/95 backdrop-blur-xl shadow-2xl border-b border-white/50 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/4eme" className="inline-flex items-center text-green-600 hover:text-green-800 mr-6">
                <ChevronLeft className="w-5 h-5 mr-2" />
                Retour à 4ème
              </Link>
              
              <div className="flex items-center">
                <div className="relative group mr-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 scale-125"></div>
                  <div className="relative w-12 h-12 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-2xl transform rotate-12 group-hover:rotate-0 transition-all duration-700 group-hover:scale-125">
                    {config.icon}
                  </div>
                </div>
                
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">{config.name}</h1>
                  <p className="text-gray-600">Perfectionnez votre maîtrise du théorème de Thalès</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

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
                  <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
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
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors">{chapter.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          {chapter.difficulty === 'beginner' ? 'Débutant' : chapter.difficulty === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
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
                
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-3 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">{chapter.estimatedTime}min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="w-4 h-4 text-yellow-500 animate-pulse" />
                        <span className="font-bold text-yellow-600">{totalXP} XP</span>
                    </div>
                    </div>
                    <Link 
                      href={`/chapitre/${chapter.id}`}
                      className="flex items-center space-x-1 text-green-600 group-hover:text-green-700 transform group-hover:translate-x-1 transition-all duration-300"
                    >
                      <Play className="w-4 h-4" />
                      <span className="text-sm font-bold">Commencer</span>
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
} 