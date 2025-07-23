'use client'

import React from 'react'
import Link from 'next/link'

const sections = [
  {
    id: 'sens-addition',
    title: 'Le sens de l\'addition',
    description: 'Comprendre ce que veut dire "ajouter" avec des objets',
    color: 'purple',
    completed: false
  },
  {
    id: 'additions-10',
    title: 'Additions jusqu\'à 10',
    description: 'Mes premières additions avec des petits nombres',
    color: 'blue',
    completed: false
  },
  {
    id: 'additions-20',
    title: 'Additions jusqu\'à 20',
    description: 'Additions plus grandes en comptant sur mes doigts',
    color: 'green',
    completed: false
  },
  {
    id: 'techniques',
    title: 'Techniques de calcul',
    description: 'Apprendre des astuces pour calculer plus facilement',
    color: 'indigo',
    completed: false
  },
  {
    id: 'problemes',
    title: 'Problèmes d\'addition',
    description: 'Résoudre des petits problèmes de la vie quotidienne',
    color: 'red',
    completed: false
  }
]

export default function CPAdditionsSimplesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-100 rounded-full mb-6">
            <span className="text-3xl">➕</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Additions simples
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Apprends à additionner ! Découvre comment ajouter des nombres pour en faire de plus grands.
          </p>
          
          {/* Navigation */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Link 
              href="/cp" 
              className="px-4 py-2 bg-white border-2 border-purple-200 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors text-sm font-medium"
            >
              ← Retour CP
            </Link>
          </div>
        </div>

        {/* Progression globale */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-purple-100 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Progression du chapitre</h2>
            <div className="text-sm text-gray-600">
              <span className="font-medium">0</span> / {sections.length} sections complétées
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-500"
              style={{ width: '0%' }}
            ></div>
          </div>
        </div>

        {/* Ce qu'il faut retenir */}
        <div className="bg-white rounded-xl p-8 shadow-lg border border-purple-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="text-3xl mr-3">💡</span>
            Ce qu'il faut retenir
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <h3 className="font-bold text-purple-800 mb-3">➕ L'addition</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  Additionner = ajouter, mettre ensemble
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  3 + 2 = 5 (trois plus deux égale cinq)
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  Je peux compter sur mes doigts
                </li>
              </ul>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="font-bold text-blue-800 mb-3">🔢 Techniques</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Je compte à partir du plus grand nombre
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  J'utilise mes doigts pour m'aider
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Je dessine pour visualiser
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Mini-game d'addition */}
        <div className="bg-white rounded-xl p-8 shadow-lg border border-purple-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="text-3xl mr-3">🎮</span>
            Mini-jeu : Addition rapide !
          </h2>
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-lg text-center">
            <div className="text-4xl font-bold text-purple-800 mb-4">
              2 + 3 = ?
            </div>
            <div className="flex justify-center gap-4 mb-4">
              <button className="w-16 h-16 bg-white rounded-lg shadow-md hover:bg-purple-50 transition-colors font-bold text-xl">
                4
              </button>
              <button className="w-16 h-16 bg-white rounded-lg shadow-md hover:bg-purple-50 transition-colors font-bold text-xl">
                5
              </button>
              <button className="w-16 h-16 bg-white rounded-lg shadow-md hover:bg-purple-50 transition-colors font-bold text-xl">
                6
              </button>
            </div>
            <p className="text-sm text-gray-600">Clique sur la bonne réponse !</p>
          </div>
        </div>

        {/* Sections du chapitre */}
        <div className="bg-white rounded-xl p-8 shadow-lg border border-purple-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
            <span className="text-3xl mr-3">📚</span>
            Sections du chapitre
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section, index) => (
              <Link 
                key={section.id}
                href={`/chapitre/cp-additions-simples/${section.id}`}
                className="block group"
              >
                <div className={`
                  bg-gradient-to-br p-6 rounded-xl shadow-lg border-2 
                  transition-all duration-300 hover:shadow-2xl hover:scale-105
                  ${section.color === 'purple' ? 'from-purple-50 to-purple-100 border-purple-200 hover:border-purple-400' : ''}
                  ${section.color === 'blue' ? 'from-blue-50 to-blue-100 border-blue-200 hover:border-blue-400' : ''}
                  ${section.color === 'green' ? 'from-green-50 to-green-100 border-green-200 hover:border-green-400' : ''}
                  ${section.color === 'indigo' ? 'from-indigo-50 to-indigo-100 border-indigo-200 hover:border-indigo-400' : ''}
                  ${section.color === 'red' ? 'from-red-50 to-red-100 border-red-200 hover:border-red-400' : ''}
                `}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`
                      w-12 h-12 rounded-lg flex items-center justify-center text-2xl text-white
                      ${section.color === 'purple' ? 'bg-purple-500' : ''}
                      ${section.color === 'blue' ? 'bg-blue-500' : ''}
                      ${section.color === 'green' ? 'bg-green-500' : ''}
                      ${section.color === 'indigo' ? 'bg-indigo-500' : ''}
                      ${section.color === 'red' ? 'bg-red-500' : ''}
                    `}>
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium text-gray-500">
                      {section.completed ? '✅' : '⭕'}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-purple-600 transition-colors">
                    {section.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4">
                    {section.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="text-orange-500 mr-1">⭐</span>
                      <span>60 XP</span>
                    </div>
                    <div className="flex items-center text-purple-600 group-hover:translate-x-1 transition-transform">
                      <span className="text-sm font-medium mr-1">Commencer</span>
                      <span className="text-lg">→</span>
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