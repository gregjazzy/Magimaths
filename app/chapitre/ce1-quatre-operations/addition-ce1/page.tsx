'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, Trophy, Play } from 'lucide-react';

export default function CE1AdditionPage() {
  const config = { color: '#10b981', icon: '➕', name: 'Addition CE1' };

  const subChapters = [

    {
      id: 'addition-posee',
      title: 'Addition posée',
      description: 'Maîtrise la technique de l\'addition en colonnes !',
      icon: '📝',
      estimatedTime: 25,
      difficulty: 'Intermédiaire',
      href: '/chapitre/ce1-quatre-operations/addition-ce1/addition-posee'
    },
    {
      id: 'addition-retenue',
      title: 'Addition avec retenue',
      description: 'Découvre comment gérer les retenues dans les additions !',
      icon: '🔄',
      estimatedTime: 30,
      difficulty: 'Intermédiaire',
      href: '/chapitre/ce1-quatre-operations/addition-ce1/addition-retenue'
    },
    {
      id: 'problemes-addition',
      title: 'Problèmes d\'addition',
      description: 'Résous des problèmes concrets avec l\'addition !',
      icon: '🧩',
      estimatedTime: 25,
      difficulty: 'Avancé',
      href: '/chapitre/ce1-quatre-operations/addition-ce1/problemes-addition'
    },
    {
      id: 'additions-jusqu-100',
      title: 'Additions jusqu\'à 100',
      description: 'Maîtrise les additions avec des nombres plus grands !',
      icon: '🧮',
      estimatedTime: 35,
      difficulty: 'Avancé',
      href: '/chapitre/ce1-quatre-operations/addition-ce1/additions-jusqu-100'
    },
    {
      id: 'calcul-mental',
      title: 'Calcul mental',
      description: 'Développe ta rapidité avec les additions mentales !',
      icon: '🧠',
      estimatedTime: 15,
      difficulty: 'Débutant',
      href: '/chapitre/ce1-quatre-operations/addition-ce1/calcul-mental'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/chapitre/ce1-quatre-operations" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux quatre opérations</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              ➕ Addition - CE1
            </h1>
            <p className="text-lg text-gray-600">
              Découvre l'addition : assembler et ajouter des quantités !
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
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-green-600 transition-colors">{chapter.title}</h3>
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
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gray-300" />
                    <div className="relative z-10">
                      <div className="text-center">
                        <div className="text-4xl mb-3">🔒</div>
                        <h3 className="text-lg font-bold text-gray-600">{chapter.title}</h3>
                        <p className="text-gray-500 text-sm mt-2">Bientôt disponible</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}