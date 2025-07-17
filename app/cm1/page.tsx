'use client'

import { useState } from 'react'
import { ChevronLeft, Clock, Trophy, BookOpen, Play } from 'lucide-react'
import Link from 'next/link'
import { getChaptersByClass } from '@/lib/chapters'

export default function CM1Page() {
  const [hoveredChapter, setHoveredChapter] = useState<string | null>(null)
  
  const cm1Chapters = getChaptersByClass('CM1')
  const config = { color: '#45b7d1', icon: '📝', name: 'CM1' }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/" 
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
                <span>Retour aux classes</span>
              </Link>
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{config.icon}</div>
                <h1 className="text-3xl font-bold text-gray-900">{config.name}</h1>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez tous les chapitres de mathématiques du CE1 à la Terminale. Chaque 
              niveau propose des cours interactifs et des exercices adaptés.
            </p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cm1Chapters.map((chapter) => {
            const totalXP = chapter.estimatedTime * 2
            return (
              <div
                key={chapter.id}
                className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 ${
                  hoveredChapter === chapter.id ? 'transform scale-105' : ''
                }`}
                onMouseEnter={() => setHoveredChapter(chapter.id)}
                onMouseLeave={() => setHoveredChapter(null)}
                style={{ borderTop: `4px solid ${config.color}` }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: config.color }}
                  >
                    {chapter.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{chapter.title}</h3>
                    <p className="text-sm text-gray-500">{chapter.difficulty}</p>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
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
                
                <Link
                  href={
                    chapter.id === 'equations-second-degre' ? '/chapitre/equations-second-degre-overview' :
                    chapter.id === 'nombres-derives' ? '/chapitre/nombres-derives-overview' :
                    `/chapitre/${chapter.id}`
                  }
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium text-center inline-block hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-md flex items-center justify-center space-x-2"
                >
                  <Play className="w-4 h-4" />
                  <span>Commencer</span>
                </Link>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>© 2024 Mathématiques CM1 - Application d'apprentissage interactive</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 