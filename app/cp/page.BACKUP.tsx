'use client'

import React from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { useAnalytics } from '@/lib/useAnalytics'

const chapters = [
  {
    id: 'cp-nombres-jusqu-20',
    title: 'Nombres jusqu\'à 20 (1ère partie année)',
    description: 'Dénombrer, lire, écrire 0-20. Décompositions et compléments à 10',
    sections: [
      { id: 'reconnaissance', title: 'Reconnaître les nombres', completed: false },
      { id: 'comptage', title: 'Compter jusqu\'à 20', completed: false },
      { id: 'ecriture', title: 'Lire et écrire', completed: false },
      { id: 'decompositions', title: 'Décompositions additives', completed: false },
      { id: 'complements-10', title: 'Compléments à 10', completed: false }
    ],
    color: 'blue'
  },
  {
    id: 'cp-nombres-jusqu-100',
    title: 'Nombres jusqu\'à 100 (2nde partie année)',
    description: 'Extension 21-100. Unités/dizaines, comparer, doubles/moitiés',
    sections: [
      { id: 'dizaines', title: 'Les dizaines', completed: false },
      { id: 'unites-dizaines', title: 'Unités et dizaines', completed: false },
      { id: 'lecture-ecriture', title: 'Lire et écrire jusqu\'à 100', completed: false },
      { id: 'ordonner-comparer', title: 'Ordonner et comparer', completed: false },
      { id: 'doubles-moities', title: 'Doubles et moitiés', completed: false }
    ],
        color: 'green' 
  },
  {
    id: 'cp-additions-simples',
    title: 'Additions simples',
    description: 'Découvrir l\'addition avec des objets et des nombres jusqu\'à 20',
    sections: [
      { id: 'sens-addition', title: 'Le sens de l\'addition', completed: false },
      { id: 'decompositions', title: 'Décompositions additives', completed: false },
      { id: 'complements-10', title: 'Compléments à 10', completed: false },
      { id: 'additions-jusqu-20', title: 'Additions jusqu\'à 20', completed: false },
      { id: 'problemes', title: 'Problèmes d\'addition', completed: false }
    ],
    color: 'purple'
  },

  {
    id: 'cp-soustractions-simples', 
    title: 'Soustractions simples',
    description: 'Apprendre à soustraire dans la limite de 20',
    sections: [
      { id: 'sens-soustraction', title: 'Le sens de la soustraction', completed: false },
      { id: 'soustractions-10', title: 'Soustractions jusqu\'à 10', completed: false },
      { id: 'soustractions-20', title: 'Soustractions jusqu\'à 20', completed: false },
      { id: 'techniques', title: 'Techniques de calcul', completed: false },
      { id: 'problemes', title: 'Problèmes de soustraction', completed: false }
    ],
    color: 'red'
  },
  {
    id: 'cp-multiplications-simples',
    title: 'Premières multiplications',
    description: 'Découvrir la multiplication avec des groupes et des objets',
    sections: [
      { id: 'sens-multiplication', title: 'Le sens de la multiplication', completed: false },
      { id: 'groupes-egaux', title: 'Groupes égaux', completed: false },
      { id: 'addition-repetee', title: 'Addition répétée', completed: false },
      { id: 'table-2', title: 'Table de 2', completed: false },
      { id: 'table-5', title: 'Table de 5', completed: false },
      { id: 'table-10', title: 'Table de 10', completed: false },
      { id: 'problemes-simples', title: 'Problèmes simples', completed: false }
    ],
    color: 'emerald'
  },
  {
    id: 'cp-calcul-mental',
    title: 'Calcul mental',
    description: 'Développer la rapidité et l\'aisance en calcul mental',
    sections: [
      { id: 'additions-simples', title: 'Additions simples', completed: false },
      { id: 'soustractions-simples', title: 'Soustractions simples', completed: false },
      { id: 'doubles-moities', title: 'Doubles et moitiés', completed: false },
      { id: 'complements-10', title: 'Compléments à 10', completed: false },
      { id: 'multiplications-2-5-10', title: 'Tables de 2, 5 et 10', completed: false }
    ],
    color: 'cyan'
  },
  {
    id: 'cp-geometrie-espace',
    title: 'Géométrie et espace',
    description: 'Se repérer dans l\'espace et reconnaître les formes',
    sections: [
      { id: 'reperage-espace', title: 'Se repérer dans l\'espace', completed: false },
      { id: 'formes-geometriques', title: 'Les formes géométriques', completed: false },
      { id: 'lignes-traits', title: 'Lignes et traits', completed: false },
      { id: 'reproductions', title: 'Reproduire des figures', completed: false },
      { id: 'quadrillages', title: 'Se repérer sur quadrillage', completed: false }
    ],
    color: 'indigo'
  },
  {
    id: 'cp-grandeurs-mesures',
    title: 'Grandeurs et mesures',
    description: 'Comparer, mesurer et ordonner des grandeurs',
    sections: [
      { id: 'longueurs', title: 'Comparer des longueurs', completed: false },
      { id: 'masses', title: 'Comparer des masses', completed: false },
      { id: 'contenances', title: 'Comparer des contenances', completed: false },
      { id: 'temps', title: 'Se repérer dans le temps', completed: false },
      { id: 'monnaie', title: 'La monnaie', completed: false }
    ],
    color: 'yellow'
  }
]

export default function CPPage() {
  // ✅ Tracking automatique des visites sur la page CP
  useAnalytics({
    pageType: 'class',
    pageId: 'cp',
    pageTitle: 'Classe CP - Cours Préparatoire',
    classLevel: 'cp'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 relative overflow-hidden">
      {/* Header avec navigation */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 sm:space-x-6">
              <Link href="/" className="p-2 hover:bg-white/60 rounded-lg transition-colors touch-manipulation">
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
              </Link>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg">
                  🎒
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">CP</h1>
                  <p className="text-sm sm:text-base text-gray-600 mt-1 hidden sm:block">Découvrez les mathématiques du CP</p>
                  <p className="text-xs text-gray-600 mt-1 sm:hidden">Mathématiques CP</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">




        {/* Particules de fond pour l'effet magique - ajustées pour mobile */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 sm:top-32 left-4 sm:left-16 w-32 sm:w-48 h-32 sm:h-48 bg-pink-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 sm:top-64 right-4 sm:right-24 w-24 sm:w-32 h-24 sm:h-32 bg-orange-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute bottom-20 sm:bottom-32 left-4 sm:left-32 w-28 sm:w-40 h-28 sm:h-40 bg-yellow-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute bottom-40 sm:bottom-64 right-4 sm:right-16 w-20 sm:w-24 h-20 sm:h-24 bg-purple-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '3s'}}></div>
        </div>

        {/* Chapitres */}
        <div className="relative z-10 bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl border border-orange-200/50">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 flex flex-col sm:flex-row items-center justify-center text-center">
            <span className="text-3xl sm:text-5xl mb-2 sm:mb-0 sm:mr-4 animate-bounce">📚</span>
            <span className="bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent leading-tight">
              Mes aventures mathématiques !
            </span>
            <span className="text-3xl sm:text-5xl mt-2 sm:mt-0 sm:ml-4 animate-bounce" style={{animationDelay: '0.5s'}}>🌟</span>
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
            {chapters.map((chapter, index) => (
              <Link 
                key={chapter.id}
                href={`/chapitre/${chapter.id}`}
                className="block group touch-manipulation"
              >
                <div className={`
                  relative overflow-hidden bg-white rounded-2xl shadow-lg border-2 p-4 sm:p-6 
                  transition-all duration-300 hover:shadow-xl transform hover:scale-[1.02] hover:-translate-y-1
                  active:scale-[0.98] active:shadow-md
                  will-change-transform backface-visibility-hidden
                  ${chapter.color === 'blue' ? 'border-blue-200 hover:border-blue-500' : ''}
                  ${chapter.color === 'green' ? 'border-green-200 hover:border-green-500' : ''}
                  ${chapter.color === 'purple' ? 'border-purple-200 hover:border-purple-500' : ''}
                  ${chapter.color === 'red' ? 'border-red-200 hover:border-red-500' : ''}
                  ${chapter.color === 'emerald' ? 'border-emerald-200 hover:border-emerald-500' : ''}
                  ${chapter.color === 'cyan' ? 'border-cyan-200 hover:border-cyan-500' : ''}
                  ${chapter.color === 'indigo' ? 'border-indigo-200 hover:border-indigo-500' : ''}
                  ${chapter.color === 'yellow' ? 'border-yellow-200 hover:border-yellow-500' : ''}
                `}>
                  {/* Bande colorée subtile en haut */}
                  <div className={`
                    absolute top-0 left-0 right-0 h-1 rounded-t-2xl
                    ${chapter.color === 'blue' ? 'bg-gradient-to-r from-blue-300 to-blue-400' : ''}
                    ${chapter.color === 'green' ? 'bg-gradient-to-r from-green-300 to-green-400' : ''}
                    ${chapter.color === 'purple' ? 'bg-gradient-to-r from-purple-300 to-purple-400' : ''}
                    ${chapter.color === 'red' ? 'bg-gradient-to-r from-red-300 to-red-400' : ''}
                    ${chapter.color === 'emerald' ? 'bg-gradient-to-r from-emerald-300 to-emerald-400' : ''}
                    ${chapter.color === 'cyan' ? 'bg-gradient-to-r from-cyan-300 to-cyan-400' : ''}
                    ${chapter.color === 'indigo' ? 'bg-gradient-to-r from-indigo-300 to-indigo-400' : ''}  
                    ${chapter.color === 'yellow' ? 'bg-gradient-to-r from-yellow-300 to-yellow-400' : ''}
                  `} />
                  
                  {/* Effet de fond magique */}
                  <div className={`
                    absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-500
                    ${chapter.color === 'blue' ? 'bg-gradient-to-br from-blue-100 to-blue-200' : ''}
                    ${chapter.color === 'green' ? 'bg-gradient-to-br from-green-100 to-green-200' : ''}
                    ${chapter.color === 'purple' ? 'bg-gradient-to-br from-purple-100 to-purple-200' : ''}
                    ${chapter.color === 'red' ? 'bg-gradient-to-br from-red-100 to-red-200' : ''}
                    ${chapter.color === 'emerald' ? 'bg-gradient-to-br from-emerald-100 to-emerald-200' : ''}
                    ${chapter.color === 'cyan' ? 'bg-gradient-to-br from-cyan-100 to-cyan-200' : ''}
                    ${chapter.color === 'indigo' ? 'bg-gradient-to-br from-indigo-100 to-indigo-200' : ''}
                    ${chapter.color === 'yellow' ? 'bg-gradient-to-br from-yellow-100 to-yellow-200' : ''}
                  `} />

                  {/* Étoiles magiques */}
                  <div className="absolute top-2 sm:top-3 right-2 sm:right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-lg sm:text-xl animate-spin">✨</div>
                  </div>
                  <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{animationDelay: '0.2s'}}>
                    <div className="text-sm sm:text-base animate-pulse">🌟</div>
                  </div>

                  <div className="relative z-10">
                    {/* Header avec icône et badge */}
                    <div className="flex items-center justify-between mb-4 sm:mb-5">
                      <div className={`
                        w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl flex items-center justify-center text-2xl sm:text-3xl shadow-md
                        transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300
                        ${chapter.color === 'blue' ? 'bg-gradient-to-br from-blue-300 to-blue-500' : ''}
                        ${chapter.color === 'green' ? 'bg-gradient-to-br from-green-300 to-green-500' : ''}
                        ${chapter.color === 'purple' ? 'bg-gradient-to-br from-purple-300 to-purple-500' : ''}
                        ${chapter.color === 'red' ? 'bg-gradient-to-br from-red-300 to-red-500' : ''}
                        ${chapter.color === 'emerald' ? 'bg-gradient-to-br from-emerald-300 to-emerald-500' : ''}
                        ${chapter.color === 'cyan' ? 'bg-gradient-to-br from-cyan-300 to-cyan-500' : ''}
                        ${chapter.color === 'indigo' ? 'bg-gradient-to-br from-indigo-300 to-indigo-500' : ''}
                        ${chapter.color === 'yellow' ? 'bg-gradient-to-br from-yellow-300 to-yellow-500' : ''}
                      `}>
                        {chapter.color === 'blue' && '🔢'}
                        {chapter.color === 'green' && '💯'}
                        {chapter.color === 'purple' && '➕'}
                        {chapter.color === 'red' && '➖'}
                        {chapter.color === 'emerald' && '✖️'}
                        {chapter.color === 'cyan' && '🧠'}
                        {chapter.color === 'indigo' && '📐'}
                        {chapter.color === 'yellow' && '📏'}
                      </div>
                      <div className={`
                        px-2 sm:px-3 py-1 rounded-full text-xs font-semibold text-white shadow-sm
                        ${chapter.color === 'blue' ? 'bg-blue-400' : ''}
                        ${chapter.color === 'green' ? 'bg-green-400' : ''}
                        ${chapter.color === 'purple' ? 'bg-purple-400' : ''}
                        ${chapter.color === 'red' ? 'bg-red-400' : ''}
                        ${chapter.color === 'emerald' ? 'bg-emerald-400' : ''}
                        ${chapter.color === 'cyan' ? 'bg-cyan-400' : ''}
                        ${chapter.color === 'indigo' ? 'bg-indigo-400' : ''}
                        ${chapter.color === 'yellow' ? 'bg-yellow-400' : ''}
                      `}>
                        {chapter.sections.length} activités
                      </div>
                    </div>
                    
                    {/* Titre coloré */}
                    <h3 className="font-bold text-base sm:text-lg text-gray-800 mb-2 sm:mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-orange-500 group-hover:bg-clip-text transition-all duration-300 leading-tight">
                      {chapter.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-5 line-clamp-2 group-hover:text-gray-700 leading-relaxed">
                      {chapter.description}
                    </p>
                    
                    {/* Footer avec XP et bouton */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center text-sm sm:text-base font-semibold">
                        <span className="text-xl sm:text-2xl mr-1 sm:mr-2 animate-pulse">⭐</span>
                        <span className="text-orange-500">{chapter.sections.length * 20} XP</span>
                      </div>
                      <div className={`
                        flex items-center px-2 sm:px-3 py-1 sm:py-2 rounded-lg font-semibold text-white shadow-sm text-xs sm:text-sm
                        transform group-hover:scale-105 group-hover:translate-x-1 transition-all duration-300
                        min-h-[32px] sm:min-h-[36px] touch-manipulation
                        ${chapter.color === 'blue' ? 'bg-gradient-to-r from-blue-400 to-blue-500' : ''}
                        ${chapter.color === 'green' ? 'bg-gradient-to-r from-green-400 to-green-500' : ''}
                        ${chapter.color === 'purple' ? 'bg-gradient-to-r from-purple-400 to-purple-500' : ''}
                        ${chapter.color === 'red' ? 'bg-gradient-to-r from-red-400 to-red-500' : ''}
                        ${chapter.color === 'emerald' ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : ''}
                        ${chapter.color === 'cyan' ? 'bg-gradient-to-r from-cyan-400 to-cyan-500' : ''}
                        ${chapter.color === 'indigo' ? 'bg-gradient-to-r from-indigo-400 to-indigo-500' : ''}
                        ${chapter.color === 'yellow' ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : ''}
                      `}>
                        <span className="mr-1">C'est parti !</span>
                        <span className="text-sm sm:text-base">🚀</span>
                      </div>
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

