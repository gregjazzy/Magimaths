'use client'

import React from 'react'
import Link from 'next/link'

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
    description: 'Apprendre à additionner dans la limite de 20',
    sections: [
      { id: 'sens-addition', title: 'Le sens de l\'addition', completed: false },
      { id: 'additions-10', title: 'Additions jusqu\'à 10', completed: false },
      { id: 'additions-20', title: 'Additions jusqu\'à 20', completed: false },
      { id: 'techniques', title: 'Techniques de calcul', completed: false },
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
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-6">
            <span className="text-3xl">🎒</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Mathématiques CP
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Découvre les mathématiques avec des activités ludiques et adaptées au <strong>Cours Préparatoire</strong>. 
            Apprends les nombres, les calculs et les formes en t'amusant !
          </p>
          
          {/* Navigation des niveaux */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Link 
              href="/ce1" 
              className="px-4 py-2 bg-white border-2 border-orange-200 text-orange-700 rounded-lg hover:bg-orange-50 transition-colors text-sm font-medium"
            >
              CE1 →
            </Link>
            <Link 
              href="/ce2" 
              className="px-4 py-2 bg-white border-2 border-orange-200 text-orange-700 rounded-lg hover:bg-orange-50 transition-colors text-sm font-medium"
            >
              CE2 →
            </Link>
          </div>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-orange-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">📚</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{chapters.length}</p>
                <p className="text-sm text-gray-600">Chapitres</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-orange-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">🎯</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {chapters.reduce((acc, chapter) => acc + chapter.sections.length, 0)}
                </p>
                <p className="text-sm text-gray-600">Sections</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-orange-100">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">⭐</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">0</p>
                <p className="text-sm text-gray-600">XP Total</p>
              </div>
            </div>
          </div>
        </div>

        {/* Objectifs pédagogiques CP */}
        <div className="bg-white rounded-xl p-8 shadow-lg border border-orange-100 mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="text-3xl mr-3">🎯</span>
            Objectifs du CP
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-orange-800 mb-3">🔢 Nombres et calculs</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  Comprendre et utiliser les nombres jusqu'à 100
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  Calculer avec des nombres entiers
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  Résoudre des problèmes simples
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-orange-800 mb-3">📐 Espace et géométrie</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  Se repérer dans l'espace
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  Reconnaître des formes géométriques
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  Comparer et mesurer des grandeurs
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Chapitres */}
        <div className="bg-white rounded-xl p-8 shadow-lg border border-orange-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
            <span className="text-3xl mr-3">📖</span>
            Chapitres de mathématiques CP
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chapters.map((chapter) => (
              <Link 
                key={chapter.id}
                href={`/chapitre/${chapter.id}`}
                className="block group"
              >
                <div className={`
                  bg-gradient-to-br p-6 rounded-xl shadow-lg border-2 
                  transition-all duration-300 hover:shadow-2xl hover:scale-105
                  ${chapter.color === 'blue' ? 'from-blue-50 to-blue-100 border-blue-200 hover:border-blue-400' : ''}
                  ${chapter.color === 'green' ? 'from-green-50 to-green-100 border-green-200 hover:border-green-400' : ''}
                  ${chapter.color === 'purple' ? 'from-purple-50 to-purple-100 border-purple-200 hover:border-purple-400' : ''}
                  ${chapter.color === 'red' ? 'from-red-50 to-red-100 border-red-200 hover:border-red-400' : ''}
                  ${chapter.color === 'indigo' ? 'from-indigo-50 to-indigo-100 border-indigo-200 hover:border-indigo-400' : ''}
                  ${chapter.color === 'yellow' ? 'from-yellow-50 to-yellow-100 border-yellow-200 hover:border-yellow-400' : ''}
                `}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`
                      w-12 h-12 rounded-lg flex items-center justify-center text-2xl
                      ${chapter.color === 'blue' ? 'bg-blue-500' : ''}
                      ${chapter.color === 'green' ? 'bg-green-500' : ''}
                      ${chapter.color === 'purple' ? 'bg-purple-500' : ''}
                      ${chapter.color === 'red' ? 'bg-red-500' : ''}
                      ${chapter.color === 'indigo' ? 'bg-indigo-500' : ''}
                      ${chapter.color === 'yellow' ? 'bg-yellow-500' : ''}
                    `}>
                      {chapter.color === 'blue' && '🔢'}
                      {chapter.color === 'green' && '💯'}
                      {chapter.color === 'purple' && '➕'}
                      {chapter.color === 'red' && '➖'}
                      {chapter.color === 'indigo' && '📐'}
                      {chapter.color === 'yellow' && '📏'}
                    </div>
                    <span className="text-sm font-medium text-gray-500">
                      {chapter.sections.length} sections
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">
                    {chapter.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {chapter.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="text-orange-500 mr-1">⭐</span>
                      <span>{chapter.sections.length * 20} XP</span>
                    </div>
                    <div className="flex items-center text-orange-600 group-hover:translate-x-1 transition-transform">
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