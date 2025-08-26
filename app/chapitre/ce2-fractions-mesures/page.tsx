'use client'

import { useState } from 'react'
import { ChevronLeft, Clock, Trophy, Play } from 'lucide-react'
import Link from 'next/link'

export default function CE2FractionsMesuresPage() {
  const [hoveredChapter, setHoveredChapter] = useState<string | null>(null)
  
  const config = { color: '#4ecdc4', icon: '📐', name: 'Fractions et mesures' }

  // Sous-chapitres de Fractions et mesures CE2
  const subChapters = [
    {
      id: 'ce2-fractions-comparaison',
      title: 'Comparer des fractions',
      description: 'Apprends à comparer des fractions entre elles et à utiliser les symboles < et > !',
      icon: '⚖️',
      estimatedTime: 25,
      difficulty: 'Débutant',
      href: '/chapitre/ce2-fractions-mesures/comparer'
    },
    {
      id: 'ce2-fractions-bande-unite',
      title: 'Fractions avec bandes unité',
      description: 'Découvre les fractions avec des bandes colorées ! Apprends à lire et représenter les fractions.',
      icon: '📏',
      estimatedTime: 25,
      difficulty: 'Débutant',
      href: '/chapitre/ce2-fractions-bande-unite'
    },
    {
      id: 'ce2-fractions-vocabulaire',
      title: 'Vocabulaire des fractions',
      description: 'Numérateur, dénominateur... Apprends tous les mots importants pour parler des fractions !',
      icon: '📚',
      estimatedTime: 20,
      difficulty: 'Débutant',
      href: '/chapitre/ce2-fractions-mesures/vocabulaire'
    },
    {
      id: 'ce2-mesures-longueurs',
      title: 'Mesures de longueurs',
      description: 'Mètre, centimètre, millimètre... Maîtrise toutes les unités de longueur !',
      icon: '📐',
      estimatedTime: 30,
      difficulty: 'Débutant',
      href: '#' // À implémenter plus tard
    },
    {
      id: 'ce2-mesures-masses',
      title: 'Mesures de masses',
      description: 'Kilogramme, gramme... Apprends à peser et comparer les masses !',
      icon: '⚖️',
      estimatedTime: 25,
      difficulty: 'Débutant',
      href: '#' // À implémenter plus tard
    },
    {
      id: 'ce2-mesures-contenances',
      title: 'Mesures de contenances',
      description: 'Litre, millilitre... Découvre les mesures de liquides !',
      icon: '🥤',
      estimatedTime: 25,
      difficulty: 'Débutant',
      href: '#' // À implémenter plus tard
    },
    {
      id: 'ce2-fractions-addition',
      title: 'Addition de fractions simples',
      description: 'Apprends à additionner des fractions qui ont le même dénominateur !',
      icon: '🧮',
      estimatedTime: 25,
      difficulty: 'Débutant',
      href: '/chapitre/ce2-fractions-addition'
    },
    {
      id: 'ce2-mesures-temps',
      title: 'Mesures de temps',
      description: 'Heures, minutes, secondes... Maîtrise le temps qui passe !',
      icon: '⏰',
      estimatedTime: 30,
      difficulty: 'Intermédiaire',
      href: '#' // À implémenter plus tard
    }
  ]

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link href="/ce2" className="p-2 hover:bg-white/60 rounded-lg transition-colors">
                <ChevronLeft className="w-6 h-6 text-gray-600" />
              </Link>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {config.icon}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{config.name}</h1>
                  <p className="text-gray-600 mt-1">Fractions et mesures pour le CE2</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Introduction */}
        <div className="mb-8 text-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🎯 Explore les fractions et les mesures !</h2>
            <p className="text-gray-600 text-lg">
              Découvre le monde fascinant des fractions et des mesures. Chaque carte t'emmène dans une aventure différente !
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subChapters.map((chapter) => {
            const totalXP = chapter.estimatedTime * 2
            const isAvailable = chapter.href !== '#'
            
            return (
              <div key={chapter.id} className="group block">
                {isAvailable ? (
                  <Link href={chapter.href} className="block">
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
                          Commencer !
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="group relative bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20 overflow-hidden opacity-70">
                    {/* Barre colorée grisée */}
                    <div 
                      className="absolute top-0 left-0 right-0 h-1 bg-gray-300"
                    />
                    
                    <div className="relative z-10">
                      <div className="flex items-center space-x-4 mb-4">
                        <div 
                          className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg bg-gray-400"
                        >
                          {chapter.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-600">{chapter.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                              {chapter.difficulty}
                            </span>
                            <div className="flex items-center text-gray-500">
                              <div className="w-2 h-2 bg-gray-400 rounded-full mr-1"></div>
                              <span className="text-xs font-medium">Bientôt disponible</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                        {chapter.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{chapter.estimatedTime} min</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Trophy className="w-4 h-4" />
                          <span>{totalXP} XP</span>
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-400 text-white py-3 px-4 rounded-xl font-bold text-center cursor-not-allowed">
                        🔒 Bientôt disponible
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}