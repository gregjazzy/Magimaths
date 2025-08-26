'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, Trophy, Target } from 'lucide-react';

export default function MultiplicationCE2Page() {
  const config = { color: '#3b82f6', icon: '✖️', name: 'Multiplication CE2' };

  const subChapters = [
    {
      id: 'tables-multiplication',
      title: 'Tables de multiplication',
      description: 'Apprends et révise toutes les tables de multiplication !',
      icon: '📊',
      estimatedTime: 25,
      difficulty: 'Intermédiaire',
      href: '/chapitre/ce2-operations-complexes/multiplication-ce2/tables-multiplication'
    },
    {
      id: 'multiplication-posee',
      title: 'Multiplication posée',
      description: 'Maîtrise la technique de la multiplication en colonnes !',
      icon: '📝',
      estimatedTime: 30,
      difficulty: 'Avancé',
      href: '/chapitre/ce2-operations-complexes/multiplication-ce2/multiplication-posee'
    },
    {
      id: 'multiplication-par-10-100',
      title: 'Multiplier par 10, 100',
      description: 'Découvre les astuces pour multiplier par 10 et 100 !',
      icon: '🔢',
      estimatedTime: 20,
      difficulty: 'Intermédiaire',
      href: '/chapitre/ce2-operations-complexes/multiplication-ce2/multiplication-par-10-100'
    },
    {
      id: 'problemes-multiplication',
      title: 'Problèmes de multiplication',
      description: 'Résous des problèmes concrets avec la multiplication !',
      icon: '🧩',
      estimatedTime: 25,
      difficulty: 'Avancé',
      href: '/chapitre/ce2-operations-complexes/multiplication-ce2/problemes-multiplication'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/chapitre/ce2-operations-complexes" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux opérations complexes</span>
          </Link>

          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              ✖️ Multiplication - CE2
            </h1>
            <p className="text-lg text-gray-600">
              Maîtrise la multiplication avec des techniques avancées et des nombres plus grands !
            </p>
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl p-6 mb-8 text-white">
          <div className="flex items-center justify-center space-x-4">
            <div className="text-6xl">🎯</div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Objectif du chapitre</h2>
              <p className="text-lg">
                À la fin de ce chapitre, tu sauras multiplier des nombres à plusieurs chiffres et résoudre des problèmes complexes !
              </p>
            </div>
          </div>
        </div>

        {/* Sub-chapters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subChapters.map((subChapter) => (
            <div key={subChapter.id} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              <div className="text-center mb-4">
                <div className="text-5xl mb-3">{subChapter.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900">{subChapter.title}</h3>
              </div>
              
              <div className="text-center mb-6">
                <p className="text-gray-600 text-lg mb-4">{subChapter.description}</p>
                <div className="flex justify-center items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{subChapter.estimatedTime} min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Target className="w-4 h-4" />
                    <span>{subChapter.difficulty}</span>
                  </div>
                </div>
              </div>
              
              <Link 
                href={subChapter.href}
                className="block w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-center py-3 px-6 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity"
              >
                <BookOpen className="inline w-5 h-5 mr-2" />
                Commencer !
              </Link>
            </div>
          ))}
        </div>

        {/* Coming Soon Message */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
          <div className="text-4xl mb-3">🚧</div>
          <h3 className="text-xl font-bold text-yellow-800 mb-2">Chapitre en construction</h3>
          <p className="text-yellow-700">
            Ce chapitre est actuellement en développement. Les sous-chapitres seront bientôt disponibles !
          </p>
        </div>
      </div>
    </div>
  );
}



