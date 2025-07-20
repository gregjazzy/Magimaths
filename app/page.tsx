'use client'

import { useState, useEffect } from 'react'
import { ChevronRight, Clock, Trophy, BookOpen, Play, GraduationCap, Star, Sparkles } from 'lucide-react'
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
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  const availableClasses = getAvailableClassLevels()
  const chaptersGrouped = getChaptersGroupedByClass()

  const renderClassOverview = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {availableClasses.map((classLevel) => {
        const config = classConfig[classLevel]
        const classChapters = chaptersGrouped[classLevel] || []
        const totalXP = isClient ? classChapters.reduce((sum, chapter) => sum + (chapter.estimatedTime * 2), 0) : 0
        
        return (
          <Link
            key={classLevel}
            href={`/${classLevel.toLowerCase()}`}
            className="group relative bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 hover:border-gray-200 p-4 sm:p-6 hover:shadow-2xl transition-all duration-500 cursor-pointer block transform hover:scale-105 sm:hover:scale-110 hover:-translate-y-2 sm:hover:-translate-y-3 overflow-hidden backdrop-blur-sm"
          >
            {/* Effet de fond magique */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500"
              style={{ background: `radial-gradient(circle at top right, ${config.color}15, transparent 60%)` }}
            />
            
            {/* Barre colorée animée */}
            <div 
              className="absolute top-0 left-0 right-0 h-1 transition-all duration-500 group-hover:h-3"
              style={{ background: `linear-gradient(90deg, ${config.color}, ${config.color}80, ${config.color}60)` }}
            />
            
            {/* Particules flottantes */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
            <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
              <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            </div>
            
            <div className="relative z-10">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div 
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-xl transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-300"
                    style={{ background: `linear-gradient(135deg, ${config.color}, ${config.color}CC, ${config.color}AA)` }}
                  >
                    {config.icon}
                  </div>
                <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors">{config.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-green-400"></span>
                      {isClient ? classChapters.length : '--'} chapitres
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300" />
            </div>
            
              <div className="space-y-2 sm:space-y-3 pt-3 sm:pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
                    XP Total
                  </span>
                  <span className="font-bold text-blue-600">{isClient ? totalXP : '---'}</span>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                    Durée
                  </span>
                  <span className="font-bold text-purple-600">{isClient ? Math.round(classChapters.reduce((sum, ch) => sum + ch.estimatedTime, 0) / 60) : '--'}h</span>
                </div>
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              <div className="relative bg-white rounded-3xl shadow-xl border border-gray-100 hover:border-gray-200 p-6 hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:scale-110 hover:-translate-y-3 overflow-hidden backdrop-blur-sm">
                {/* Effet de fond magique */}
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-500"
                  style={{ background: `radial-gradient(circle at center, ${config.color}20, transparent 70%)` }}
                />
                
                {/* Barre colorée animée */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1 transition-all duration-500 group-hover:h-2"
                  style={{ background: `linear-gradient(90deg, ${config.color}, ${config.color}80, ${config.color}60)` }}
                />
                
                {/* Particules magiques */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                  </div>
                <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
                  </div>
                <div className="absolute top-1/2 right-8 opacity-0 group-hover:opacity-100 transition-opacity duration-600">
                  <div className="w-1 h-1 bg-purple-400 rounded-full animate-pulse" style={{animationDelay: '0.7s'}}></div>
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
                
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-3 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span className="font-medium">{chapter.estimatedTime}min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 animate-pulse" />
                        <span className="font-bold text-yellow-600">{chapter.estimatedTime * 2} XP</span>
                  </div>
                    </div>
                    <div className="flex items-center space-x-1 text-blue-600 group-hover:text-blue-700 transform group-hover:translate-x-1 transition-all duration-300">
                      <Play className="w-4 h-4" />
                      <span className="text-sm font-bold">Démarrer</span>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Arrière-plan animé spectaculaire */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient animé de fond */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 animate-pulse"></div>
        
        {/* Constellation de particules magiques */}
        <div className="absolute top-20 left-5 sm:left-10 w-32 sm:w-48 md:w-64 h-32 sm:h-48 md:h-64 bg-blue-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-5 sm:right-10 md:right-20 w-24 sm:w-36 md:w-48 h-24 sm:h-36 md:h-48 bg-purple-400/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-5 sm:left-10 md:left-20 w-28 sm:w-42 md:w-56 h-28 sm:h-42 md:h-56 bg-pink-400/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-40 right-10 sm:right-20 md:right-40 w-16 sm:w-24 md:w-32 h-16 sm:h-24 md:h-32 bg-indigo-400/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/4 w-10 sm:w-16 md:w-20 h-10 sm:h-16 md:h-20 bg-yellow-400/25 rounded-full blur-2xl animate-pulse" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-1/3 right-1/3 w-14 sm:w-20 md:w-28 h-14 sm:h-20 md:h-28 bg-emerald-400/25 rounded-full blur-2xl animate-pulse" style={{animationDelay: '5s'}}></div>
        
        {/* Étoiles scintillantes */}
        <div className="absolute top-32 left-32 w-2 h-2 bg-yellow-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-48 right-48 w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-32 left-48 w-1.5 h-1.5 bg-pink-400 rounded-full animate-ping" style={{animationDelay: '3s'}}></div>
        <div className="absolute bottom-48 right-32 w-2 h-2 bg-purple-400 rounded-full animate-ping" style={{animationDelay: '4s'}}></div>
        
        {/* Symboles mathématiques flottants */}
        <div className="absolute top-24 left-1/4 text-blue-300/40 text-2xl animate-pulse font-bold" style={{animationDelay: '1s'}}>π</div>
        <div className="absolute top-64 right-1/4 text-purple-300/40 text-3xl animate-pulse font-bold" style={{animationDelay: '3s'}}>∑</div>
        <div className="absolute bottom-32 left-1/3 text-pink-300/40 text-2xl animate-pulse font-bold" style={{animationDelay: '2s'}}>√</div>
        <div className="absolute bottom-64 right-1/5 text-indigo-300/40 text-2xl animate-pulse font-bold" style={{animationDelay: '4s'}}>∞</div>
      </div>
      
      {/* Header ultra-moderne spectaculaire */}
      <header className="relative bg-white/95 backdrop-blur-xl shadow-2xl border-b border-white/50 overflow-hidden">
        {/* Effet de lueur derrière le header */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 animate-pulse"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 relative z-10">
          <div className="text-center">
            {/* Logo central spectaculaire */}
            <div className="flex justify-center mb-2">
              <div className="relative group">
                {/* Aura de lumière autour du logo */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 scale-125"></div>
                
                {/* Logo principal */}
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl sm:rounded-3xl flex items-center justify-center text-white text-2xl sm:text-3xl font-black shadow-2xl transform rotate-12 group-hover:rotate-0 transition-all duration-700 group-hover:scale-125">
                  ∫
                  {/* Étincelles internes */}
                  <div className="absolute inset-2 border border-white/30 rounded-xl sm:rounded-2xl animate-pulse"></div>
                </div>
                
                {/* Particules orbitales */}
                <div className="absolute -top-2 -right-2 sm:-top-3 sm:-right-3 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-xl animate-bounce">
                  <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                </div>
                <div className="absolute -bottom-1 -left-1 sm:-bottom-2 sm:-left-2 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full animate-pulse shadow-lg"></div>
                <div className="absolute top-1 right-1 w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full animate-ping"></div>
                <div className="absolute bottom-1 left-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
                
                {/* Rayons de lumière */}
                <div className="absolute top-0 left-1/2 w-px h-6 bg-gradient-to-t from-yellow-400 to-transparent transform -translate-x-1/2 -translate-y-full animate-pulse"></div>
                <div className="absolute bottom-0 left-1/2 w-px h-6 bg-gradient-to-b from-pink-400 to-transparent transform -translate-x-1/2 translate-y-full animate-pulse" style={{animationDelay: '1s'}}></div>
                <div className="absolute left-0 top-1/2 h-px w-6 bg-gradient-to-l from-blue-400 to-transparent transform -translate-y-1/2 -translate-x-full animate-pulse" style={{animationDelay: '2s'}}></div>
                <div className="absolute right-0 top-1/2 h-px w-6 bg-gradient-to-r from-purple-400 to-transparent transform -translate-y-1/2 translate-x-full animate-pulse" style={{animationDelay: '3s'}}></div>
              </div>
            </div>
            
            {/* Titre holographique */}
            <div className="relative mb-2 pb-2">
              <h1 className="text-4xl sm:text-6xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent tracking-tight relative leading-tight pb-1">
                MagiMaths ✨
                {/* Effet holographique */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 blur-lg -z-10 animate-pulse"></div>
              </h1>
              {/* Reflet sous le titre */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1">
                <div className="text-2xl sm:text-3xl font-black bg-gradient-to-t from-transparent via-gray-300/50 to-gray-400/80 bg-clip-text text-transparent tracking-tight opacity-40">
                  MagiMaths ✨
                </div>
              </div>
            </div>
            
            <p className="text-xl text-gray-800 max-w-4xl mx-auto leading-relaxed mb-2 font-semibold">
              Découvrez la magie des mathématiques du CE1 à la Terminale. 
              Chaque niveau propose des cours interactifs et des exercices enchantés ! 🎯
            </p>
            
            {/* Badges premium avec effets */}
            <div className="flex justify-center gap-4 flex-wrap">
              <div className="group relative">
                <div className="flex items-center gap-2 bg-white/90 backdrop-blur-lg px-4 py-2 rounded-2xl shadow-xl border border-white/60 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-1">
                  <BookOpen className="w-4 h-4 text-blue-600 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="text-blue-800 font-bold text-sm">Interactif</span>
                </div>
                <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
              </div>
              
              <div className="group relative">
                <div className="flex items-center gap-2 bg-white/90 backdrop-blur-lg px-4 py-2 rounded-2xl shadow-xl border border-white/60 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-1">
                  <Trophy className="w-4 h-4 text-purple-600 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="text-purple-800 font-bold text-sm">Système XP</span>
                </div>
                <div className="absolute inset-0 bg-purple-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
              </div>
              
              <div className="group relative">
                <div className="flex items-center gap-2 bg-white/90 backdrop-blur-lg px-4 py-2 rounded-2xl shadow-xl border border-white/60 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-1">
                  <Star className="w-4 h-4 text-pink-600 group-hover:rotate-12 transition-transform duration-300" />
                  <span className="text-pink-800 font-bold text-sm">Magique</span>
                </div>
                <div className="absolute inset-0 bg-pink-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </header>



      {/* Main content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
        {!selectedClass && renderClassOverview()}
        {selectedClass && renderClassDetail()}
      </div>

      {/* Footer */}
      <footer className="relative bg-gradient-to-r from-blue-900 via-purple-900 to-pink-900 mt-16 overflow-hidden">
        {/* Particules de fond */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-4 left-20 w-16 h-16 bg-blue-300 rounded-full opacity-10 animate-pulse"></div>
          <div className="absolute bottom-4 right-20 w-12 h-12 bg-purple-300 rounded-full opacity-10 animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-8 right-40 w-8 h-8 bg-pink-300 rounded-full opacity-10 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-2xl transform rotate-12 animate-pulse">
                ✨
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Merci d'avoir utilisé MagiMaths !
            </h3>
            <p className="text-blue-200 text-lg mb-6">
              Continuez à explorer la magie des mathématiques 🧙‍♂️
            </p>
            <div className="flex justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                <BookOpen className="w-5 h-5 text-blue-300" />
                <span className="text-blue-200 font-medium">Apprentissage</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                <Trophy className="w-5 h-5 text-purple-300" />
                <span className="text-purple-200 font-medium">Progression</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full">
                <Sparkles className="w-5 h-5 text-pink-300" />
                <span className="text-pink-200 font-medium">Magie</span>
              </div>
            </div>
            <p className="text-blue-300 text-sm">
              © 2024 MagiMaths - Application d'apprentissage interactive enchantée
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
} 