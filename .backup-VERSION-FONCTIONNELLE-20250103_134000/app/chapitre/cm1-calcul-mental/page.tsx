'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Eye, Edit, Grid, Target, Trophy, Clock, Play, Calculator, Zap, Brain, ArrowUp, ArrowDown } from 'lucide-react';

export default function CalculMentalPage() {
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [xpEarned, setXpEarned] = useState(0);

  const sections = [
    {
      id: 'tables-multiplication',
      title: 'Tables de multiplication',
      description: 'Mémoriser les tables jusqu\'à 10×10',
      icon: '✖️',
      duration: '20 min',
      xp: 40,
      color: 'from-red-500 to-orange-500'
    },
    {
      id: 'multiplier-diviser-10-100-1000',
      title: 'Multiplier et diviser par 10, 100, 1000',
      description: 'Maîtriser les règles avec les nombres entiers',
      icon: '🔢',
      duration: '15 min',
      xp: 30,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'complements',
      title: 'Compléments',
      description: 'À l\'unité supérieure, à la dizaine, à la centaine, au millier',
      icon: '🎯',
      duration: '18 min',
      xp: 35,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'doubles-moities',
      title: 'Doubles et moitiés',
      description: 'Calculer rapidement les doubles et moitiés de nombres plus grands',
      icon: '⚡',
      duration: '15 min',
      xp: 30,
      color: 'from-purple-500 to-violet-500'
    },
    {
      id: 'calculs-approches',
      title: 'Calculs approchés',
      description: 'Estimation d\'un ordre de grandeur',
      icon: '🧠',
      duration: '12 min',
      xp: 25,
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  const allSections = ['cours', ...sections.map(s => s.id)];

  const getSectionPath = (sectionId: string | number) => {
    if (sectionId === 'cours') {
      return '/chapitre/cm1-calcul-mental/tables-multiplication';
    }
    return `/chapitre/cm1-calcul-mental/${sectionId}`;
  };

  const totalXP = sections.reduce((sum, section) => sum + section.xp, 0);
  const progressPercentage = (xpEarned / totalXP) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header simple */}
        <div className="mb-8">
          <Link href="/cm1" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              🧠 Calcul Mental !
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Développer des stratégies de calcul rapide et des automatismes
            </p>
            <div className="text-2xl mb-6">
              <span className="bg-yellow-200 px-4 py-2 rounded-full font-bold text-gray-800">
                {xpEarned} XP gagné !
              </span>
            </div>
            
            {/* Barre de progression */}
            <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
              <div 
                className="bg-gradient-to-r from-orange-500 to-red-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">
              Progression : {Math.round(progressPercentage)}% ({xpEarned}/{totalXP} XP)
            </p>
          </div>
        </div>

        {/* Sections principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {sections.map((section, index) => (
            <Link href={getSectionPath(section.id)} key={section.id}>
              <div className={`bg-gradient-to-br ${section.color} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer group`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">{section.icon}</div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-white" />
                    <span className="text-white font-semibold text-sm">{section.duration}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-yellow-200 transition-colors">
                  {section.title}
                </h3>
                
                <p className="text-white/90 text-sm mb-4 leading-relaxed">
                  {section.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-4 h-4 text-yellow-300" />
                    <span className="text-yellow-300 font-semibold text-sm">{section.xp} XP</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Play className="w-4 h-4 text-white" />
                    <span className="text-white font-semibold text-sm">Commencer</span>
                  </div>
                </div>
                
                {/* Indicateur de progression */}
                <div className="mt-4 w-full bg-white/20 rounded-full h-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-300"
                    style={{ width: completedSections.includes(section.id) ? '100%' : '0%' }}
                  ></div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl text-blue-600 mb-2">
              <Calculator className="w-8 h-8 mx-auto" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Stratégies</h3>
            <p className="text-gray-600">
              Méthodes rapides pour calculer efficacement
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl text-green-600 mb-2">
              <Zap className="w-8 h-8 mx-auto" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Automatismes</h3>
            <p className="text-gray-600">
              Réflexes de calcul développés par la pratique
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="text-3xl text-purple-600 mb-2">
              <Brain className="w-8 h-8 mx-auto" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Mental</h3>
            <p className="text-gray-600">
              Calculs sans poser l'opération
            </p>
          </div>
        </div>

        {/* Conseils */}
        <div className="bg-gradient-to-r from-orange-400 to-red-400 rounded-xl p-6 text-white">
          <h3 className="text-xl font-bold mb-3">💡 Conseils pour réussir</h3>
          <ul className="space-y-2">
            <li className="flex items-start space-x-2">
              <span className="text-yellow-300">•</span>
              <span>Commencez par les tables de multiplication - elles sont la base du calcul mental</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-yellow-300">•</span>
              <span>Pratiquez régulièrement pour développer vos automatismes</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-yellow-300">•</span>
              <span>Utilisez des stratégies pour simplifier les calculs complexes</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-yellow-300">•</span>
              <span>N'hésitez pas à décomposer les nombres pour faciliter le calcul</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 