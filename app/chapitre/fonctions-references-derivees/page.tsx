'use client';

import { useState } from 'react';
import { ArrowLeft, Clock, Trophy, Star, ArrowRight, Play, Target } from 'lucide-react';
import Link from 'next/link';

export default function FonctionsReferencesDerivesPage() {
  const [xpEarned, setXpEarned] = useState(0);

  const sections = [
    {
      id: 'domaine-derivabilite',
      title: 'Domaine de dérivabilité',
      description: 'Comprendre où une fonction est dérivable et les restrictions',
      icon: '📍',
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      estimatedTime: '15 min',
      xp: 30,
      difficulty: 'Fondamental',
      available: true
    },
    {
      id: 'formules-base',
      title: 'Formules de base',
      description: 'Mémoriser les dérivées des fonctions de référence + exercices simples',
      icon: '📋',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      estimatedTime: '25 min',
      xp: 80,
      difficulty: 'Intermédiaire',
      available: true
    },
    {
      id: 'formules-complexes',
      title: 'Formules complexes',
      description: 'Maîtriser les fonctions avancées et expertes avec techniques avancées',
      icon: '🏆',
      color: 'from-purple-500 to-indigo-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      estimatedTime: '35 min',
      xp: 120,
      difficulty: 'Expert',
      available: true
    }
  ];

  const totalXP = sections.reduce((sum, section) => sum + section.xp, 0);
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Fondamental': return 'bg-green-100 text-green-800';
      case 'Intermédiaire': return 'bg-blue-100 text-blue-800';
      case 'Expert': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
              <Link href="/chapitre/fonctions-references-derivees-overview" className="p-2 hover:bg-white/60 rounded-lg transition-colors">
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Fonctions de Référence et Dérivées</h1>
                <p className="text-gray-600 mt-1">Maîtrisez les dérivées des fonctions usuelles</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                {totalXP} XP disponibles
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {/* Introduction */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 text-center">
            <div className="relative">
              <div className="absolute top-3 right-3 w-5 h-5 text-yellow-400 animate-pulse">✨</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Maîtrisez les dérivées des fonctions usuelles
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Apprenez à calculer les dérivées des fonctions de référence avec des formules et des techniques avancées.
              </p>
            </div>
          </div>
        </div>

        {/* Grille des sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <div key={section.id} className="group relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 hover:border-white/40 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 overflow-hidden">
              {/* Barre colorée animée */}
              <div 
                className="absolute top-0 left-0 right-0 h-1 transition-all duration-500 group-hover:h-2"
                style={{ background: `linear-gradient(90deg, ${section.color.replace('from-', '').replace('to-', '').replace(' ', ', ')})` }}
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
                  <div className="text-3xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    {section.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {section.title}
                  </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(section.difficulty)}`}>
                        {section.difficulty}
                      </span>
                      <div className="flex items-center text-green-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                        <span className="text-xs font-medium">Disponible</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {section.description}
                  </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                      <span>{section.estimatedTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                    <Trophy className="w-4 h-4" />
                      <span>{section.xp} XP</span>
                  </div>
                </div>
                
                <Link 
                  href={`/chapitre/fonctions-references-derivees/${section.id}`}
                  className={`w-full bg-gradient-to-r ${section.color} text-white py-3 px-4 rounded-xl font-bold text-center inline-block hover:opacity-90 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl`}
                >
                  <Play className="inline w-4 h-4 mr-2" />
                  Commencer
                </Link>
                </div>
              </div>
            ))}
          </div>

        {/* Progression générale */}
        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              <Target className="inline w-6 h-6 mr-2" />
              Progression générale
            </h2>
            <div className="text-sm text-gray-600">
              0 / {sections.length} sections terminées
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
              style={{ width: '0%' }}
            ></div>
          </div>
          
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>0% terminé</span>
            <span>XP total possible: {totalXP}</span>
          </div>
        </div>
      </div>
    </div>
  );
}