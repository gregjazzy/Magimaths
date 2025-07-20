'use client'

import { useState } from 'react'
import { ChevronLeft, Clock, Trophy, Play } from 'lucide-react'
import Link from 'next/link'

export default function TheoremeThalePage() {
  const [hoveredChapter, setHoveredChapter] = useState<string | null>(null)
  
  const subChapters = [
    {
      id: '4eme-thales-introduction',
      title: 'Introduction et découverte',
      description: 'Découvrir le théorème de Thalès avec des animations 📐',
      icon: '📐',
      difficulty: 'beginner',
      estimatedTime: 15,
      verified: false
    },
    {
      id: '4eme-thales-proportionnalite',
      title: 'Proportionnalité et calculs',
      description: 'Calculer des longueurs avec le théorème de Thalès 📏',
      icon: '📏',
      difficulty: 'intermediate',
      estimatedTime: 20,
      verified: false
    },
    {
      id: '4eme-thales-reciproque',
      title: 'Réciproque du théorème',
      description: 'Démontrer le parallélisme avec la réciproque 🔄',
      icon: '🔄',
      difficulty: 'intermediate',
      estimatedTime: 18,
      verified: false
    },
    {
      id: '4eme-thales-applications',
      title: 'Applications et problèmes',
      description: 'Résoudre des problèmes concrets avec Thalès 🏗️',
      icon: '🏗️',
      difficulty: 'intermediate',
      estimatedTime: 22,
      verified: false
    },
    {
      id: '4eme-thales-contraposee',
      title: 'Contraposée et non-parallélisme',
      description: 'Prouver qu\'il n\'y a pas de parallélisme ❌',
      icon: '❌',
      difficulty: 'advanced',
      estimatedTime: 15,
      verified: false
    }
  ]
  
  const config = { color: '#10b981', icon: '⫽', name: 'Théorème de Thalès - 4ème' }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-blue-100 text-blue-800'
      case 'advanced': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const totalTime = subChapters.reduce((sum, chapter) => sum + chapter.estimatedTime, 0)
  const totalXP = totalTime * 2

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
      {/* Particules de fond pour l'effet magique */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-5 sm:left-10 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-green-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-5 sm:right-10 md:right-20 w-24 sm:w-36 md:w-48 h-24 sm:h-36 md:h-48 bg-emerald-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-5 sm:left-10 md:left-20 w-28 sm:w-42 md:w-56 h-28 sm:h-42 md:h-56 bg-teal-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-40 right-10 sm:right-20 md:right-40 w-16 sm:w-24 md:w-32 h-16 sm:h-24 md:h-32 bg-cyan-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        
        {/* Symboles mathématiques flottants */}
        <div className="absolute top-32 left-32 text-green-300/40 text-2xl animate-pulse font-bold" style={{animationDelay: '1s'}}>∥</div>
        <div className="absolute top-64 right-1/4 text-emerald-300/40 text-3xl animate-pulse font-bold" style={{animationDelay: '3s'}}>△</div>
        <div className="absolute bottom-32 left-1/3 text-teal-300/40 text-2xl animate-pulse font-bold" style={{animationDelay: '2s'}}>∝</div>
        <div className="absolute bottom-64 right-1/5 text-cyan-300/40 text-2xl animate-pulse font-bold" style={{animationDelay: '4s'}}>⫽</div>
      </div>

      {/* Header moderne */}
      <div className="relative z-10 bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4 lg:space-x-6">
              <Link href="/4eme" className="p-1.5 sm:p-2 hover:bg-white/60 rounded-lg transition-colors">
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
              </Link>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-lg sm:text-2xl font-bold shadow-lg">
                  {config.icon}
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{config.name}</h1>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base">Proportionnalité et parallélisme dans les triangles</p>
                </div>
              </div>
            </div>
            
            {/* Stats du chapitre */}
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-center">
                <div className="flex items-center text-green-600">
                  <Clock className="w-4 h-4 mr-1" />
                  <span className="text-sm font-bold">{totalTime} min</span>
                </div>
                <div className="text-xs text-gray-500">Durée totale</div>
              </div>
              <div className="text-center">
                <div className="flex items-center text-green-600">
                  <Trophy className="w-4 h-4 mr-1" />
                  <span className="text-sm font-bold">{totalXP} XP</span>
                </div>
                <div className="text-xs text-gray-500">Points total</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Introduction du chapitre */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 mb-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Le Théorème de Thalès</h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Découvrez l'un des théorèmes les plus importants de la géométrie ! Le théorème de Thalès établit une relation 
                fondamentale entre <strong>proportionnalité</strong> et <strong>parallélisme</strong> dans les triangles.
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Calculs de longueurs dans les triangles</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Démonstration de parallélisme</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-teal-500 rounded-full mr-3"></div>
                  <span className="text-gray-700">Applications concrètes et problèmes</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 p-8 rounded-2xl">
                <div className="text-center mb-4">
                  <div className="text-6xl mb-2">⫽</div>
                  <h3 className="text-xl font-bold text-green-800">Configuration de Thalès</h3>
                </div>
                <div className="bg-white/80 p-4 rounded-lg">
                  <div className="text-center space-y-2">
                    <div className="text-lg font-bold text-green-700">Si (MN) ∥ (BC)</div>
                    <div className="text-sm text-gray-600">alors</div>
                    <div className="text-lg font-bold text-emerald-700">AM/AB = AN/AC = MN/BC</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des sous-chapitres */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subChapters.map((chapter, index) => (
            <Link
              key={chapter.id}
              href={`/chapitre/${chapter.id}`}
              className="group block"
              onMouseEnter={() => setHoveredChapter(chapter.id)}
              onMouseLeave={() => setHoveredChapter(null)}
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20 hover:border-white/40 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 overflow-hidden relative">
                {/* Barre colorée animée */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1 transition-all duration-500 group-hover:h-2"
                  style={{ background: `linear-gradient(90deg, ${config.color}, ${config.color}80, ${config.color}60)` }}
                />
                
                {/* Badge vérifié */}
                {chapter.verified && (
                  <div className="absolute top-3 right-3 z-20">
                    <div className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
                      <span>✓</span>
                      <span>VÉRIFIÉ</span>
                    </div>
                  </div>
                )}
                
                {/* Numéro du chapitre */}
                <div className="absolute top-3 left-3 z-20">
                  <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
                
                {/* Particules magiques */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                </div>
                <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="w-1 h-1 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
                </div>
                
                <div className="relative z-10 pt-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-xl transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-300"
                      style={{ background: `linear-gradient(135deg, ${config.color}, ${config.color}CC, ${config.color}AA)` }}
                    >
                      {chapter.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-gray-700 transition-colors">
                        {chapter.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${getDifficultyColor(chapter.difficulty)}`}>
                          {chapter.difficulty === 'beginner' ? 'Débutant' : 
                           chapter.difficulty === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                    {chapter.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{chapter.estimatedTime} min</span>
                    </div>
                    <div className="flex items-center text-green-600">
                      <Trophy className="w-4 h-4 mr-1" />
                      <span>{chapter.estimatedTime * 2} XP</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center justify-center">
                    <div className="flex items-center text-green-600 group-hover:text-green-700 transition-colors">
                      <Play className="w-4 h-4 mr-2" />
                      <span className="font-semibold">Commencer</span>
                    </div>
                  </div>
                </div>
                
                {/* Effet de survol */}
                <div 
                  className={`absolute inset-0 transition-all duration-500 ${
                    hoveredChapter === chapter.id ? 'opacity-20' : 'opacity-0'
                  }`}
                  style={{ 
                    background: `radial-gradient(circle at top right, ${config.color}15, transparent 60%)` 
                  }}
                />
              </div>
            </Link>
          ))}
        </div>

        {/* Résumé du parcours */}
        <div className="mt-8 bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Votre parcours d'apprentissage</h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                📐
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Découverte</h4>
              <p className="text-gray-600 text-sm">
                Comprenez les bases du théorème de Thalès et ses applications
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                📏
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Pratique</h4>
              <p className="text-gray-600 text-sm">
                Maîtrisez les calculs de proportionnalité et de parallélisme
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                🏗️
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">Application</h4>
              <p className="text-gray-600 text-sm">
                Résolvez des problèmes concrets avec le théorème de Thalès
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 