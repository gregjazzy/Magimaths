'use client'

import { useState } from 'react'
import { ChevronLeft, Clock, Trophy, BookOpen, Play } from 'lucide-react'
import Link from 'next/link'
import { getChaptersByClass } from '@/lib/chapters'

export default function QuatrièmePage() {
  const [hoveredChapter, setHoveredChapter] = useState<string | null>(null)
  
  const quatriemeChapters = getChaptersByClass('4eme')
  const config = { color: '#54a0ff', icon: '📊', name: '4ème' }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Particules de fond pour l'effet magique */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-5 sm:left-10 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-blue-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-5 sm:right-10 md:right-20 w-24 sm:w-36 md:w-48 h-24 sm:h-36 md:h-48 bg-purple-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-5 sm:left-10 md:left-20 w-28 sm:w-42 md:w-56 h-28 sm:h-42 md:h-56 bg-pink-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-40 right-10 sm:right-20 md:right-40 w-16 sm:w-24 md:w-32 h-16 sm:h-24 md:h-32 bg-indigo-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
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
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-sky-500 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-2xl font-bold shadow-lg">
                  {config.icon}
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{config.name}</h1>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base">Découvrez les mathématiques de 4ème</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {quatriemeChapters.map((chapter) => {
            const totalXP = chapter.estimatedTime * 2
            return (
              <Link
                key={chapter.id}
                href={`/chapitre/${chapter.id}`}
                className="group block"
              >
                <div className="group relative bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl border border-white/20 hover:border-white/40 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 overflow-hidden">
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
                    <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                      <div 
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-xl transform group-hover:scale-125 group-hover:rotate-6 transition-all duration-300"
                        style={{ background: `linear-gradient(135deg, ${config.color}, ${config.color}AA, ${config.color}80)` }}
                      >
                        {chapter.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{chapter.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                            {chapter.difficulty}
                          </span>
                          <div className="flex items-center text-green-600">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full mr-1"></div>
                            <span className="text-xs font-medium">Disponible</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                      {chapter.description}
                    </p>
                    
                    <div className="flex items-center justify-between pt-3 sm:pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-2 sm:space-x-3 text-xs sm:text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span className="font-medium">{chapter.estimatedTime}min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 animate-pulse" />
                          <span className="font-bold text-yellow-600">{totalXP} XP</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-blue-600 group-hover:text-blue-700 transform group-hover:translate-x-1 transition-all duration-300">
                        <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="text-xs sm:text-sm font-bold">Démarrer</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900 mt-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 left-20 w-16 h-16 bg-blue-300 rounded-full opacity-10 animate-pulse"></div>
          <div className="absolute bottom-4 right-20 w-12 h-12 bg-purple-300 rounded-full opacity-10 animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-4">
              Prêt à maîtriser les mathématiques de 4ème ?
            </h3>
            <p className="text-base sm:text-lg text-blue-200 mb-6 sm:mb-8">
              Explorez nos chapitres interactifs et gagnez de l'XP en résolvant des exercices !
            </p>
            <div className="flex justify-center">
              <Link href="#" className="bg-white text-blue-900 px-6 sm:px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition-colors">
                Commencer maintenant
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 