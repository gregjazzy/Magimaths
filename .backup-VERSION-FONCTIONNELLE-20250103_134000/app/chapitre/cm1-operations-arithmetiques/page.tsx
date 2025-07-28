'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Eye, Edit, Grid, Target, Trophy, Clock, Play, Calculator } from 'lucide-react';

export default function OperationsArithmetiquesPage() {
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [xpEarned, setXpEarned] = useState(0);

  const sections = [
    {
      id: 'addition-soustraction',
      title: 'Addition et soustraction en colonnes',
      description: 'Maîtriser les techniques de calcul en colonnes avec retenues',
      icon: '➕',
      duration: '20 min',
      xp: 40,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'multiplication',
      title: 'Multiplication posée',
      description: 'Multiplication d\'un entier par un autre entier',
      icon: '✖️',
      duration: '25 min',
      xp: 50,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'division',
      title: 'Division euclidienne',
      description: 'Division avec diviseur à un chiffre',
      icon: '➗',
      duration: '20 min',
      xp: 40,
      color: 'from-purple-500 to-violet-500'
    },
    {
      id: 'calcul-mental',
      title: 'Calcul mental et automatismes',
      description: 'Développer la rapidité et les réflexes en calcul',
      icon: '🧠',
      duration: '15 min',
      xp: 30,
      color: 'from-orange-500 to-red-500'
    }
  ];

  const allSections = ['cours', ...sections.map(s => s.id)];

  const getSectionPath = (sectionId: string | number) => {
    if (sectionId === 'cours') {
      return '/chapitre/cm1-operations-arithmetiques/addition-soustraction';
    }
    return `/chapitre/cm1-operations-arithmetiques/${sectionId}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header simple */}
        <div className="mb-8">
          <Link href="/cm1" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              ➕ Opérations arithmétiques !
            </h1>
            <div className="text-2xl mb-6">
              <span className="bg-yellow-200 px-4 py-2 rounded-full font-bold text-gray-800">
                {xpEarned} XP gagné !
              </span>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {completedSections.length}
            </div>
            <div className="text-gray-600">Sections complétées</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {sections.reduce((total, section) => total + section.xp, 0)}
            </div>
            <div className="text-gray-600">XP total disponible</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {sections.reduce((total, section) => total + parseInt(section.duration), 0)}
            </div>
            <div className="text-gray-600">Minutes d'apprentissage</div>
          </div>
        </div>

        {/* Exercices - grille simple */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {sections.map((section) => {
            const isCompleted = completedSections.includes(section.id);
            
            return (
              <div
                key={section.id}
                className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 ${
                  isCompleted ? 'ring-2 ring-green-400' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${section.color} flex items-center justify-center text-white text-2xl font-bold`}>
                      {section.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{section.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{section.description}</p>
                    </div>
                  </div>
                  {isCompleted && (
                    <div className="text-green-500">
                      <Trophy className="w-6 h-6" />
                    </div>
                  )}
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{section.duration}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Target className="w-4 h-4" />
                      <span>{section.xp} XP</span>
                    </div>
                  </div>
                </div>
                
                <Link
                  href={getSectionPath(section.id)}
                  className={`w-full bg-gradient-to-r ${section.color} text-white py-3 px-6 rounded-lg font-medium text-center inline-block hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2`}
                >
                  <Play className="w-4 h-4" />
                  <span>Commencer</span>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Section d'informations */}
        <div className="mt-12 bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">À propos des opérations arithmétiques</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">🎯 Objectifs du chapitre</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Maîtriser les techniques de calcul en colonnes</li>
                <li>• Développer l'automatisme des opérations</li>
                <li>• Résoudre des problèmes concrets</li>
                <li>• Acquérir de la rapidité en calcul mental</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">📚 Compétences développées</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Addition et soustraction avec retenues</li>
                <li>• Multiplication posée d'entiers</li>
                <li>• Division euclidienne simple</li>
                <li>• Stratégies de calcul mental</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="w-5 h-5 text-green-600" />
              <span className="font-bold text-green-800">Programme CM1 - Opérations arithmétiques</span>
            </div>
            <p className="text-sm text-gray-700">
              Ce chapitre suit le programme officiel français du CM1 pour les opérations arithmétiques. 
              Les élèves apprennent les techniques de calcul posé en colonnes, développent leurs automatismes 
              et acquièrent de la fluidité dans le calcul mental. L'accent est mis sur la compréhension 
              des mécanismes avant l'automatisation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 