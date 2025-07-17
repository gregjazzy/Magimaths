'use client'

import { useState } from 'react'
import { ChevronRight, Clock, Trophy, BookOpen, Play, GraduationCap } from 'lucide-react'
import Link from 'next/link'
import { getAvailableClassLevels, getChaptersByClass, getChaptersGroupedByClass } from '@/lib/chapters'
import { ClassLevel } from '@/types'



// Configuration des classes avec couleurs et icônes
const classConfig = {
  'CE1': { color: '#ff6b6b', icon: '📚', name: 'CE1' },
  'CE2': { color: '#4ecdc4', icon: '📖', name: 'CE2' },
  'CM1': { color: '#45b7d1', icon: '📝', name: 'CM1' },
  'CM2': { color: '#96ceb4', icon: '📐', name: 'CM2' },
  '6eme': { color: '#feca57', icon: '🔢', name: '6ème' },
  '5eme': { color: '#ff9ff3', icon: '🧮', name: '5ème' },
  '4eme': { color: '#54a0ff', icon: '📊', name: '4ème' },
  '3eme': { color: '#5f27cd', icon: '📈', name: '3ème' },
  '2nde': { color: '#00d2d3', icon: '🎯', name: '2nde' },
  '1ere': { color: '#10b981', icon: '🎓', name: '1ère' },
  'terminale': { color: '#f59e0b', icon: '🏆', name: 'Terminale' }
}

export default function HomePage() {
  const [selectedClass, setSelectedClass] = useState<ClassLevel | null>(null)
  const [hoveredChapter, setHoveredChapter] = useState<number | null>(null)
  
  const availableClasses = getAvailableClassLevels()
  const chaptersGrouped = getChaptersGroupedByClass()

  const renderClassOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {availableClasses.map((classLevel) => {
        const config = classConfig[classLevel]
        const classChapters = chaptersGrouped[classLevel] || []
        const totalXP = classChapters.reduce((sum, chapter) => sum + (chapter.estimatedTime * 2), 0)
        
        return (
          <Link
            key={classLevel}
            href={classLevel === 'CM1' ? '/cm1' : '#'}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300 cursor-pointer block"
            onClick={(e) => {
              if (classLevel !== 'CM1') {
                e.preventDefault();
                setSelectedClass(classLevel);
              }
            }}
            style={{ borderTop: `4px solid ${config.color}` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{config.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{config.name}</h3>
                  <p className="text-sm text-gray-500">{classChapters.length} chapitres</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">XP Total</span>
                <span className="font-medium">{totalXP}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Durée</span>
                <span className="font-medium">{Math.floor(classChapters.reduce((sum, ch) => sum + ch.estimatedTime, 0) / 60)}h</span>
              </div>
            </div>
          </Link>
        )
      })}

    </div>
  )

  const renderClassDetail = () => {
    if (!selectedClass) return null
    
    const config = classConfig[selectedClass]
    const classChapters = chaptersGrouped[selectedClass] || []
    
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSelectedClass(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              ← Retour aux classes
            </button>
            <div className="text-2xl">{config.icon}</div>
            <h2 className="text-2xl font-bold text-gray-900">{config.name}</h2>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classChapters.map((chapter) => (
            <Link
              key={chapter.id}
              href={
                chapter.id === 'equations-second-degre' ? '/chapitre/equations-second-degre-overview' :
                chapter.id === 'nombres-derives' ? '/chapitre/nombres-derives-overview' :
                `/chapitre/${chapter.id}`
              }
              className="group block"
            >
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all duration-300 cursor-pointer">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                       style={{ backgroundColor: config.color }}>
                    {chapter.icon}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">{chapter.title}</h3>
                    <p className="text-xs text-gray-500">{chapter.difficulty}</p>
                  </div>
                </div>
                
                <p className="text-gray-600 text-xs mb-3 line-clamp-2">
                  {chapter.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{chapter.estimatedTime}min</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-gray-500">Disponible</span>
                    </div>
                    <div className="flex items-center space-x-1 text-blue-600 group-hover:text-blue-700">
                      <Play className="w-3 h-3" />
                      <span className="text-xs font-medium">Démarrer</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    )
  }



  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Mathématiques - Tous niveaux
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Découvrez tous les chapitres de mathématiques du CE1 à la Terminale.
              Chaque niveau propose des cours interactifs et des exercices adaptés.
            </p>
          </div>
        </div>
      </header>



      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedClass && renderClassOverview()}
        {selectedClass && renderClassDetail()}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-500">
            <p>© 2024 Mathématiques - Application d'apprentissage interactive</p>
          </div>
        </div>
      </footer>
    </div>
  )
} 