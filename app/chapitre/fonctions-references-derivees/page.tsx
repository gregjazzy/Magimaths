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
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100">
      {/* Header fixe avec navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-2">
          {/* Titre et infos sur une ligne compacte */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <span className="text-sm">Retour</span>
              </Link>
              <div className="h-4 w-px bg-gray-300" />
              <h1 className="text-base font-bold text-gray-900">Fonctions de Référence et Dérivées</h1>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span className="bg-cyan-100 px-2 py-1 rounded text-cyan-700">{totalXP} XP</span>
                <span className="bg-blue-100 px-2 py-1 rounded text-blue-700">0/3</span>
              </div>
            </div>
          </div>
          
          {/* Navigation compacte */}
          <div className="grid grid-cols-3 gap-1">
            <Link href="/chapitre/fonctions-references-derivees/domaine-derivabilite" className="flex items-center justify-center px-2 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-medium transition-colors text-center">
              Domaine de dérivabilité
            </Link>
            <Link href="/chapitre/fonctions-references-derivees/formules-base" className="flex items-center justify-center px-2 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-medium transition-colors text-center">
              Formules de base
            </Link>
            <Link href="/chapitre/fonctions-references-derivees/formules-complexes" className="flex items-center justify-center px-2 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-medium transition-colors text-center">
              Formules complexes
            </Link>
          </div>
        </div>
      </header>

      <div className="pt-20 max-w-4xl mx-auto p-6 space-y-10">
        
        {/* Introduction du chapitre */}
        <section className="bg-white rounded-3xl p-8 shadow-xl border border-gray-200">
          <div className="text-center mb-8">
            <div className="inline-flex items-center space-x-2 bg-cyan-100 px-4 py-2 rounded-full mb-4">
              <Target className="h-5 w-5 text-cyan-600" />
              <span className="font-semibold text-cyan-800">Concept Fondamental</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              📐 Fonctions de référence et dérivées
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              Maîtrise toutes les formules essentielles pour calculer les dérivées
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {sections.map((section, index) => (
              <div key={section.id} className={`${section.bgColor} ${section.borderColor} border-2 rounded-2xl p-6 hover:shadow-lg transition-all`}>
                <div className="text-center">
                  <div className="text-4xl mb-3">{section.icon}</div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {section.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {section.description}
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-xs text-gray-500 mb-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{section.estimatedTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Trophy className="h-3 w-3" />
                      <span>{section.xp} XP</span>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(section.difficulty)} mb-4 inline-block`}>
                    {section.difficulty}
                  </span>
                  <div className="mt-4">
                    <Link href={`/chapitre/fonctions-references-derivees/${section.id}`}>
                      <button className={`bg-gradient-to-r ${section.color} text-white px-4 py-2 rounded-lg font-bold hover:shadow-lg transition-all flex items-center space-x-2 mx-auto group text-sm`}>
                        <Play className="h-4 w-4" />
                        <span>Commencer</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Récapitulatif */}
        <section className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 shadow-xl text-white">
          <div className="text-center">
            <div className="text-5xl mb-6">🎯</div>
            <h2 className="text-3xl font-bold mb-6">
              OBJECTIFS DU CHAPITRE
            </h2>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white/20 p-6 rounded-2xl">
                <div className="text-3xl mb-3">📍</div>
                <h3 className="text-xl font-bold mb-2">Comprendre</h3>
                <p className="text-indigo-100">Le domaine de dérivabilité des fonctions</p>
              </div>
              <div className="bg-white/20 p-6 rounded-2xl">
                <div className="text-3xl mb-3">📋</div>
                <h3 className="text-xl font-bold mb-2">Mémoriser</h3>
                <p className="text-indigo-100">Les formules de dérivation essentielles</p>
              </div>
              <div className="bg-white/20 p-6 rounded-2xl">
                <div className="text-3xl mb-3">🏆</div>
                <h3 className="text-xl font-bold mb-2">Maîtriser</h3>
                <p className="text-indigo-100">Les techniques avancées de dérivation</p>
              </div>
            </div>
            <div className="mt-8 bg-white/30 p-4 rounded-2xl">
              <div className="text-2xl font-bold">Total : {totalXP} XP à gagner</div>
              <div className="text-sm mt-2 text-indigo-100">Durée estimée : 75 minutes</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}