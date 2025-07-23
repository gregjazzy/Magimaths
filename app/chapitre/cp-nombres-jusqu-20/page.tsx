'use client'

import React from 'react'
import Link from 'next/link'

const sections = [
  {
    id: 'reconnaissance',
    title: 'Reconnaître les nombres',
    description: 'Apprendre à identifier les nombres de 0 à 20',
    color: 'blue',
    completed: false
  },
  {
    id: 'ecriture',
    title: 'Écrire les nombres',
    description: 'Savoir écrire les chiffres et nombres en lettres',
    color: 'green',
    completed: false
  },
  {
    id: 'comptage',
    title: 'Compter jusqu\'à 20',
    description: 'Compter des objets et réciter la suite numérique',
    color: 'purple',
    completed: false
  },
  {
    id: 'ordre',
    title: 'Ranger les nombres',
    description: 'Comparer et ordonner les nombres de 0 à 20',
    color: 'red',
    completed: false
  },
  {
    id: 'decomposition',
    title: 'Décomposer les nombres',
    description: 'Comprendre la structure des nombres (dizaines et unités)',
    color: 'indigo',
    completed: false
  }
]

export default function CPNombresJusqu20Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
            <span className="text-3xl">🔢</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Nombres jusqu'à 20
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Découvre les nombres de 0 à 20 ! Apprends à les reconnaître, les écrire et à compter.
          </p>
          
          {/* Navigation */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Link 
              href="/cp" 
              className="px-4 py-2 bg-white border-2 border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
            >
              ← Retour CP
            </Link>
          </div>
        </div>

        {/* Progression globale */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Progression du chapitre</h2>
            <div className="text-sm text-gray-600">
              <span className="font-medium">0</span> / {sections.length} sections complétées
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500"
              style={{ width: '0%' }}
            ></div>
          </div>
        </div>

        {/* Ce qu'il faut retenir */}
        <div className="bg-white rounded-xl p-8 shadow-lg border border-blue-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="text-3xl mr-3">💡</span>
            Ce qu'il faut retenir
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="font-bold text-blue-800 mb-3">🔢 Les nombres jusqu'à 20</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Je sais compter de 0 à 20
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Je reconnais les chiffres et les nombres
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Je sais ranger les nombres du plus petit au plus grand
                </li>
              </ul>
            </div>
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="font-bold text-green-800 mb-3">✍️ Écrire les nombres</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  J'écris les chiffres de 0 à 9
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  J'écris les nombres en lettres (un, deux, trois...)
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Je comprends : 10 = dix, 15 = quinze...
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sections du chapitre */}
        <div className="bg-white rounded-xl p-8 shadow-lg border border-blue-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
            <span className="text-3xl mr-3">📚</span>
            Sections du chapitre
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section, index) => (
              <Link 
                key={section.id}
                href={`/chapitre/cp-nombres-jusqu-20/${section.id}`}
                className="block group"
              >
                <div className={`
                  bg-gradient-to-br p-6 rounded-xl shadow-lg border-2 
                  transition-all duration-300 hover:shadow-2xl hover:scale-105
                  ${section.color === 'blue' ? 'from-blue-50 to-blue-100 border-blue-200 hover:border-blue-400' : ''}
                  ${section.color === 'green' ? 'from-green-50 to-green-100 border-green-200 hover:border-green-400' : ''}
                  ${section.color === 'purple' ? 'from-purple-50 to-purple-100 border-purple-200 hover:border-purple-400' : ''}
                  ${section.color === 'red' ? 'from-red-50 to-red-100 border-red-200 hover:border-red-400' : ''}
                  ${section.color === 'indigo' ? 'from-indigo-50 to-indigo-100 border-indigo-200 hover:border-indigo-400' : ''}
                `}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`
                      w-12 h-12 rounded-lg flex items-center justify-center text-2xl text-white
                      ${section.color === 'blue' ? 'bg-blue-500' : ''}
                      ${section.color === 'green' ? 'bg-green-500' : ''}
                      ${section.color === 'purple' ? 'bg-purple-500' : ''}
                      ${section.color === 'red' ? 'bg-red-500' : ''}
                      ${section.color === 'indigo' ? 'bg-indigo-500' : ''}
                    `}>
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium text-gray-500">
                      {section.completed ? '✅' : '⭕'}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {section.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4">
                    {section.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="text-orange-500 mr-1">⭐</span>
                      <span>50 XP</span>
                    </div>
                    <div className="flex items-center text-blue-600 group-hover:translate-x-1 transition-transform">
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