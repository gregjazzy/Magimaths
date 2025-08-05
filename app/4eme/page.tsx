'use client'

import { useState } from 'react'
import { ChevronLeft, Clock, Trophy, BookOpen, Play } from 'lucide-react'
import Link from 'next/link'
import { getChaptersByClass } from '@/lib/chapters'
import { useAnalytics } from '@/lib/useAnalytics'

export default function QuatrièmePage() {
  const [hoveredChapter, setHoveredChapter] = useState<string | null>(null)
  
  // ✅ Tracking automatique des visites sur la page 4ème
  useAnalytics({
    pageType: 'class',
    pageId: '4eme',
    pageTitle: 'Classe 4ème',
    classLevel: '4eme'
  });
  
  const quatriemeChapters = getChaptersByClass('4eme').filter(chapter => 
    !['4eme-calcul-litteral-expressions-regles', 
      '4eme-calcul-litteral-developpement', 
      '4eme-calcul-litteral-expressions-introduction', 
      '4eme-calcul-litteral-substitution', 
      '4eme-calcul-litteral-problemes',
      '4eme-calcul-litteral-factorisation',
      '4eme-cosinus-introduction',
      '4eme-cosinus-calculs',
      '4eme-cosinus-applications',
      '4eme-cosinus-constructions',
      '4eme-pythagore-introduction',
      '4eme-pythagore-calculs-directs',
      '4eme-pythagore-calculs-inverses',
      '4eme-pythagore-applications',
      '4eme-pythagore-reciproque'].includes(chapter.id)
  )
  
  const config = { color: '#54a0ff', icon: '📊', name: '4ème' }

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}min`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h${remainingMinutes}min` : `${hours}h`
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-blue-100 text-blue-800',
      advanced: 'bg-red-100 text-red-800'
    }
    return colors[difficulty as keyof typeof colors] || colors.intermediate
  }

  const getDifficultyText = (difficulty: string) => {
    const texts = {
      beginner: 'Débutant',
      intermediate: 'Intermédiaire', 
      advanced: 'Avancé'
    }
    return texts[difficulty as keyof typeof texts] || 'Intermédiaire'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
            <ChevronLeft className="w-5 h-5 mr-2" />
            Retour à l'accueil
          </Link>
          
          <div className="flex items-center mb-6">
            <div className="text-4xl mr-4">{config.icon}</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{config.name}</h1>
              <p className="text-gray-600">Découvrez les mathématiques de 4ème</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quatriemeChapters.map((chapter) => (
              <Link href={`/chapitre/${chapter.id}`} key={chapter.id} className="group block">
                <div 
                  className="group relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 hover:border-white/40 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 overflow-hidden"
                  onMouseEnter={() => setHoveredChapter(chapter.id)}
                  onMouseLeave={() => setHoveredChapter(null)}
                >
                  {/* Barre colorée animée */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-1 transition-all duration-500 group-hover:h-2"
                    style={{ background: `linear-gradient(90deg, ${chapter.color}, ${chapter.color}80, ${chapter.color}60)` }}
                  />
                  <div className="flex items-start justify-between mb-4">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                      style={{ backgroundColor: chapter.color }}
                    >
                      {chapter.icon}
                    </div>
                    {chapter.verified && (
                      <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        ✓ VÉRIFIÉ
                      </div>
                    )}
                  </div>
                  
                  <h3 className="font-bold text-lg mb-2 text-gray-900">
                    {chapter.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {chapter.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatTime(chapter.estimatedTime)}
                    </div>
                    <div className={`px-2 py-1 rounded-full ${getDifficultyColor(chapter.difficulty)}`}>
                      {getDifficultyText(chapter.difficulty)}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-yellow-600">
                      <Trophy className="w-4 h-4 mr-1" />
                      <span className="text-sm font-semibold">
                        {chapter.estimatedTime * 2} XP
                      </span>
                    </div>
                    <div className="flex items-center text-blue-600">
                      <span className="text-sm mr-2">Démarrer</span>
                      <Play className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 