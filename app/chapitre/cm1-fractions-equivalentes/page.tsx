'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Eye, Edit, Grid, Target, Trophy, Clock, Play, Calculator } from 'lucide-react';

export default function FractionsEquivalentesPage() {
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [xpEarned, setXpEarned] = useState(0);

  const sections = [
    {
      id: 'comprendre',
      title: 'Comprendre les fractions',
      description: 'Découvrir ce qu\'est une fraction et sa représentation',
      icon: '🧩',
      duration: '15 min',
      xp: 20,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'equivalentes',
      title: 'Fractions équivalentes',
      description: 'Identifier et créer des fractions équivalentes',
      icon: '⚖️',
      duration: '20 min',
      xp: 25,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'comparer',
      title: 'Comparer des fractions',
      description: 'Méthodes pour comparer et ordonner les fractions',
      icon: '📊',
      duration: '18 min',
      xp: 22,
      color: 'from-purple-500 to-violet-500'
    },
    {
      id: 'representer',
      title: 'Représenter sur une droite',
      description: 'Placer les fractions sur une droite graduée',
      icon: '📏',
      duration: '15 min',
      xp: 20,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'decomposer',
      title: 'Décomposer les fractions',
      description: 'Écrire une fraction sous différentes formes',
      icon: '🔧',
      duration: '12 min',
      xp: 18,
      color: 'from-teal-500 to-cyan-500'
    }
  ];

  const allSections = ['cours', ...sections.map(s => s.id)];

  const getSectionPath = (sectionId: string | number) => {
    if (sectionId === 'cours') {
      return '/chapitre/cm1-fractions-equivalentes/comprendre';
    }
    return `/chapitre/cm1-fractions-equivalentes/${sectionId}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header simple */}
        <div className="mb-8">
          <Link href="/cm1" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              ½ Les fractions équivalentes !
            </h1>
            <div className="text-2xl mb-6">
              <span className="bg-yellow-200 px-4 py-2 rounded-full font-bold text-gray-800">
                {xpEarned} XP gagné !
              </span>
            </div>
          </div>
        </div>

        {/* Exercices - grille simple */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section) => (
            <div key={section.id} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{section.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
                    <p className="text-gray-600 text-sm">{section.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-700 mb-1">
                    <Clock className="inline w-4 h-4 mr-1" />
                    {section.duration}
                  </div>
                  <div className="text-sm text-yellow-600 font-bold">
                    <Trophy className="inline w-4 h-4 mr-1" />
                    {section.xp} XP
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`bg-gradient-to-r ${section.color} h-2 rounded-full transition-all duration-300`}
                    style={{ width: completedSections.includes(section.id) ? '100%' : '0%' }}
                  ></div>
                </div>
              </div>
              
              <Link 
                href={getSectionPath(section.id)}
                className={`w-full bg-gradient-to-r ${section.color} text-white py-3 px-4 rounded-lg font-bold text-center inline-block hover:opacity-90 transition-all transform hover:scale-105 shadow-md`}
              >
                <Play className="inline w-4 h-4 mr-2" />
                Commencer
              </Link>
            </div>
          ))}
        </div>

        {/* Info pédagogique */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">📚 À propos de ce chapitre</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-gray-800 mb-2">🎯 Objectifs pédagogiques</h3>
              <ul className="space-y-1 text-gray-600 text-sm">
                <li>• Comprendre ce qu'est une fraction (numérateur/dénominateur)</li>
                <li>• Reconnaître des fractions équivalentes</li>
                <li>• Comparer et ordonner des fractions simples</li>
                <li>• Représenter des fractions sur une droite graduée</li>
                <li>• Simplifier des fractions à leur forme irréductible</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-gray-800 mb-2">💡 Compétences développées</h3>
              <ul className="space-y-1 text-gray-600 text-sm">
                <li>• Représentation graphique des fractions</li>
                <li>• Calcul mental avec les fractions simples</li>
                <li>• Raisonnement mathématique et logique</li>
                <li>• Résolution de problèmes concrets</li>
                <li>• Maîtrise du vocabulaire mathématique</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="w-5 h-5 text-purple-600" />
              <span className="font-bold text-purple-800">Programme CM1 - Fractions</span>
            </div>
            <p className="text-sm text-gray-700">
              Ce chapitre suit le programme officiel français du CM1 pour les fractions. 
              Les élèves découvrent les fractions comme parts d'un tout, apprennent à les 
              comparer et à les représenter. L'accent est mis sur la compréhension visuelle 
              et les manipulations concrètes avant l'abstraction.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 