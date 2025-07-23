'use client'

import React from 'react'
import Link from 'next/link'

const sections = [
  {
    id: 'reperage-espace',
    title: 'Se repérer dans l\'espace',
    description: 'Apprendre les mots : dessus, dessous, devant, derrière...',
    color: 'indigo',
    completed: false
  },
  {
    id: 'formes-geometriques',
    title: 'Les formes géométriques',
    description: 'Reconnaître les carrés, cercles, triangles et rectangles',
    color: 'blue',
    completed: false
  },
  {
    id: 'lignes-traits',
    title: 'Lignes et traits',
    description: 'Tracer des lignes droites et courbes',
    color: 'green',
    completed: false
  },
  {
    id: 'reproductions',
    title: 'Reproduire des figures',
    description: 'Copier des dessins simples et des motifs',
    color: 'purple',
    completed: false
  },
  {
    id: 'quadrillages',
    title: 'Se repérer sur quadrillage',
    description: 'Utiliser un quadrillage pour dessiner et se repérer',
    color: 'red',
    completed: false
  }
]

export default function CPGeometrieEspacePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 rounded-full mb-6">
            <span className="text-3xl">📐</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Géométrie et espace
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Découvre les formes qui t'entourent et apprends à te repérer dans l'espace !
          </p>
          
          {/* Navigation */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Link 
              href="/cp" 
              className="px-4 py-2 bg-white border-2 border-indigo-200 text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors text-sm font-medium"
            >
              ← Retour CP
            </Link>
          </div>
        </div>

        {/* Progression globale */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-indigo-100 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800">Progression du chapitre</h2>
            <div className="text-sm text-gray-600">
              <span className="font-medium">0</span> / {sections.length} sections complétées
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-3 rounded-full transition-all duration-500"
              style={{ width: '0%' }}
            ></div>
          </div>
        </div>

        {/* Ce qu'il faut retenir */}
        <div className="bg-white rounded-xl p-8 shadow-lg border border-indigo-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="text-3xl mr-3">💡</span>
            Ce qu'il faut retenir
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
              <h3 className="font-bold text-indigo-800 mb-3">📐 Les formes</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  Le <strong>carré</strong> a 4 côtés égaux
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  Le <strong>cercle</strong> est tout rond
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  Le <strong>triangle</strong> a 3 côtés
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  Le <strong>rectangle</strong> a 4 côtés, 2 longs et 2 courts
                </li>
              </ul>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h3 className="font-bold text-blue-800 mb-3">🧭 Se repérer</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <strong>Dessus</strong> / <strong>Dessous</strong>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <strong>Devant</strong> / <strong>Derrière</strong>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <strong>À droite</strong> / <strong>À gauche</strong>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <strong>Près</strong> / <strong>Loin</strong>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Mini-jeu des formes */}
        <div className="bg-white rounded-xl p-8 shadow-lg border border-indigo-100 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="text-3xl mr-3">🎮</span>
            Mini-jeu : Trouve les formes !
          </h2>
          <div className="bg-gradient-to-r from-indigo-100 to-blue-100 p-6 rounded-lg">
            <p className="text-center text-lg font-medium text-gray-700 mb-6">
              Clique sur tous les <strong className="text-indigo-600">cercles</strong> !
            </p>
            <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
              {/* Formes géométriques */}
              <div className="aspect-square bg-white rounded-lg shadow-md flex items-center justify-center cursor-pointer hover:bg-indigo-50 transition-colors">
                <div className="w-12 h-12 bg-red-400 rounded-full"></div>
              </div>
              <div className="aspect-square bg-white rounded-lg shadow-md flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 bg-blue-400"></div>
              </div>
              <div className="aspect-square bg-white rounded-lg shadow-md flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                <div 
                  className="w-0 h-0 border-l-6 border-r-6 border-b-10 border-transparent border-b-green-400"
                  style={{
                    borderLeftWidth: '24px',
                    borderRightWidth: '24px',
                    borderBottomWidth: '40px'
                  }}
                ></div>
              </div>
              <div className="aspect-square bg-white rounded-lg shadow-md flex items-center justify-center cursor-pointer hover:bg-indigo-50 transition-colors">
                <div className="w-12 h-12 bg-yellow-400 rounded-full"></div>
              </div>
            </div>
            <p className="text-center text-sm text-gray-600 mt-4">
              Score : 0 / 2 cercles trouvés
            </p>
          </div>
        </div>

        {/* Sections du chapitre */}
        <div className="bg-white rounded-xl p-8 shadow-lg border border-indigo-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
            <span className="text-3xl mr-3">📚</span>
            Sections du chapitre
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sections.map((section, index) => (
              <Link 
                key={section.id}
                href={`/chapitre/cp-geometrie-espace/${section.id}`}
                className="block group"
              >
                <div className={`
                  bg-gradient-to-br p-6 rounded-xl shadow-lg border-2 
                  transition-all duration-300 hover:shadow-2xl hover:scale-105
                  ${section.color === 'indigo' ? 'from-indigo-50 to-indigo-100 border-indigo-200 hover:border-indigo-400' : ''}
                  ${section.color === 'blue' ? 'from-blue-50 to-blue-100 border-blue-200 hover:border-blue-400' : ''}
                  ${section.color === 'green' ? 'from-green-50 to-green-100 border-green-200 hover:border-green-400' : ''}
                  ${section.color === 'purple' ? 'from-purple-50 to-purple-100 border-purple-200 hover:border-purple-400' : ''}
                  ${section.color === 'red' ? 'from-red-50 to-red-100 border-red-200 hover:border-red-400' : ''}
                `}>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`
                      w-12 h-12 rounded-lg flex items-center justify-center text-2xl text-white
                      ${section.color === 'indigo' ? 'bg-indigo-500' : ''}
                      ${section.color === 'blue' ? 'bg-blue-500' : ''}
                      ${section.color === 'green' ? 'bg-green-500' : ''}
                      ${section.color === 'purple' ? 'bg-purple-500' : ''}
                      ${section.color === 'red' ? 'bg-red-500' : ''}
                    `}>
                      {index + 1}
                    </div>
                    <span className="text-sm font-medium text-gray-500">
                      {section.completed ? '✅' : '⭕'}
                    </span>
                  </div>
                  
                  <h3 className="font-bold text-lg text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                    {section.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4">
                    {section.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="text-orange-500 mr-1">⭐</span>
                      <span>40 XP</span>
                    </div>
                    <div className="flex items-center text-indigo-600 group-hover:translate-x-1 transition-transform">
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