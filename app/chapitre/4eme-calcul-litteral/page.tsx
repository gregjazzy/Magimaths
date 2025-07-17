'use client'

import { useState } from 'react'
import { ChevronLeft, Clock, Trophy, Play } from 'lucide-react'
import Link from 'next/link'
import { getSubChapters } from '@/lib/chapters'

export default function CalculLitteral4emePage() {
  const [hoveredChapter, setHoveredChapter] = useState<string | null>(null)
  
  const subChapters = getSubChapters('4eme-calcul-litteral')
  const config = { color: '#54a0ff', icon: 'x', name: 'Calcul littéral - 4ème' }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">
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
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                  {config.icon}
                </div>
                <h1 className="text-3xl font-bold text-gray-900">{config.name}</h1>
              </div>
            </div>
          </div>
          <div className="mt-4 text-center">
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Perfectionnez votre maîtrise du calcul littéral ! Apprenez à manipuler les expressions avec des lettres, 
              à substituer des valeurs, simplifier et développer des expressions mathématiques complexes.
            </p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          
          {/* Autres chapitres */}
          {subChapters.filter(chapter => chapter.id !== '4eme-calcul-litteral-expressions-introduction').map((chapter) => {
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
                  href={`/chapitre/${chapter.id}`}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Play className="w-4 h-4" />
                  <span>Commencer</span>
                </Link>
              </div>
            )
          })}
        </div>

        <div className="mt-12 bg-white rounded-xl p-8 shadow-lg border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">🎯 Objectifs du calcul littéral - 4ème</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📝</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Comprendre</h3>
              <p className="text-sm text-gray-600">
                Maîtriser les expressions littérales complexes
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔢</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Calculer</h3>
              <p className="text-sm text-gray-600">
                Substituer efficacement les variables
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Simplifier</h3>
              <p className="text-sm text-gray-600">
                Regrouper et réduire les expressions
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📐</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">Développer</h3>
              <p className="text-sm text-gray-600">
                Maîtriser la distributivité avancée
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>© 2024 Mathématiques 4ème - Calcul littéral interactif</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 