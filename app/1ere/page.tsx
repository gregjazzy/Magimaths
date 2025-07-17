'use client'

import { useState } from 'react'
import { ChevronLeft, Clock, Trophy, BookOpen, Play } from 'lucide-react'
import Link from 'next/link'
import { getChaptersByClass } from '@/lib/chapters'

export default function PremierePage() {
  const [hoveredChapter, setHoveredChapter] = useState<string | null>(null)
  
  const premiereChapters = getChaptersByClass('1ere')
  const config = { color: '#10b981', icon: '🎓', name: '1ère' }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Particules de fond pour l'effet magique */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-purple-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-20 w-56 h-56 bg-pink-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-40 right-40 w-32 h-32 bg-indigo-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      {/* Header moderne */}
      <div className="relative z-10 bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4 lg:space-x-6">
              <Link href="/" className="p-1.5 sm:p-2 hover:bg-white/60 rounded-lg transition-colors">
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
              </Link>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-2xl font-bold shadow-lg">
                  {config.icon}
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{config.name}</h1>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base">Découvrez les mathématiques de 1ère</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {premiereChapters.map((chapter) => {
            const totalXP = chapter.estimatedTime * 2
            return (
              <Link
                key={chapter.id}
                href={
                  chapter.id === 'equations-second-degre' ? '/chapitre/equations-second-degre-overview' :
                  chapter.id === 'nombres-derives' ? '/chapitre/nombres-derives-overview' :
                  chapter.id === 'fonctions-references-derivees' ? '/chapitre/fonctions-references-derivees-overview' :
                  `/chapitre/${chapter.id}`
                }
                className="group block"
              >
                <div className="group relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 hover:border-white/40 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 overflow-hidden">
                  {/* Barre colorée animée */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-1 transition-all duration-500 group-hover:h-2"
                    style={{ background: `linear-gradient(90deg, ${config.color}, ${config.color}80, ${config.color}60)` }}
                  />
                  
                  {/* Particules magiques */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  </div>
                  <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
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
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{chapter.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
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
                    
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{chapter.estimatedTime} min</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Trophy className="w-4 h-4" />
                        <span>{totalXP} XP</span>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gradient-to-r text-white py-3 px-4 rounded-xl font-bold text-center hover:opacity-90 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
                         style={{ background: `linear-gradient(90deg, ${config.color}, ${config.color}CC)` }}>
                      <Play className="inline w-4 h-4 mr-2" />
                      Commencer
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
} 