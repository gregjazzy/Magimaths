'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Trophy, Play } from 'lucide-react';

export default function CE1DivisionPage() {
  const config = { color: '#8b5cf6', icon: '➗', name: 'Division CE1' };

  const subChapters = [
    {
      id: 'sens-division',
      title: 'Le sens de la division',
      description: 'Comprendre ce que signifie diviser : partager et grouper !',
      icon: '🎯',
      estimatedTime: 20,
      difficulty: 'Débutant',
      href: '/chapitre/ce1-quatre-operations/division-ce1/sens-division'
    },
    {
      id: 'partage-equitable',
      title: 'Partage équitable',
      description: 'Apprends à partager équitablement des objets !',
      icon: '⚖️',
      estimatedTime: 25,
      difficulty: 'Débutant',
      href: '/chapitre/ce1-quatre-operations/division-ce1/partage-equitable'
    },
    {
      id: 'division-euclidienne',
      title: 'Division euclidienne simple',
      description: 'Découvre la division avec quotient et reste !',
      icon: '🔢',
      estimatedTime: 30,
      difficulty: 'Intermédiaire',
      href: '/chapitre/ce1-quatre-operations/division-ce1/division-euclidienne'
    },
    {
      id: 'problemes-division',
      title: 'Problèmes de division',
      description: 'Résous des problèmes concrets avec la division !',
      icon: '🧩',
      estimatedTime: 25,
      difficulty: 'Avancé',
      href: '/chapitre/ce1-quatre-operations/division-ce1/problemes-division'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-violet-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/chapitre/ce1-quatre-operations" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux quatre opérations</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              ➗ Division - CE1
            </h1>
            <p className="text-lg text-gray-600">
              Découvre la division : partager et grouper des quantités !
            </p>
          </div>
        </div>



        {/* Grille des sous-chapitres */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subChapters.map((chapter) => {
            const totalXP = chapter.estimatedTime * 2;
            const isAvailable = chapter.href !== '#';
            
            return (
              <div key={chapter.id} className="group block">
                {isAvailable ? (
                  <Link href={chapter.href}>
                    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer border-2 border-transparent hover:border-purple-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="text-3xl">{chapter.icon}</div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{chapter.title}</h3>
                            <p className="text-gray-600 text-sm">{chapter.description}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{chapter.estimatedTime} min</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Trophy className="w-4 h-4" />
                            <span>{totalXP} XP</span>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          chapter.difficulty === 'Débutant' ? 'bg-green-100 text-green-800' :
                          chapter.difficulty === 'Intermédiaire' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {chapter.difficulty}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-center">
                        <div className="bg-purple-500 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 group-hover:bg-purple-600 transition-colors">
                          <Play className="w-4 h-4" />
                          <span>Commencer</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="bg-gray-100 rounded-xl p-6 shadow-lg opacity-60 cursor-not-allowed border-2 border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl grayscale">{chapter.icon}</div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-500">{chapter.title}</h3>
                          <p className="text-gray-400 text-sm">{chapter.description}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{chapter.estimatedTime} min</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Trophy className="w-4 h-4" />
                          <span>{totalXP} XP</span>
                        </div>
                      </div>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-500">
                        {chapter.difficulty}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-center">
                      <div className="bg-gray-400 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2">
                        <span>Bientôt disponible</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Section d'encouragement */}
        <div className="mt-12 bg-gradient-to-r from-purple-400 to-violet-500 rounded-xl p-8 text-white text-center">
          <div className="text-4xl mb-4">🎯</div>
          <h2 className="text-2xl font-bold mb-2">Prêt à découvrir la division ?</h2>
          <p className="text-lg opacity-90">
            La division t'aidera à partager équitablement et à résoudre de nouveaux problèmes !
          </p>
        </div>
      </div>
    </div>
  );
}

