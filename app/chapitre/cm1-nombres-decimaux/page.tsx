'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Eye, Edit, Grid, Target, Trophy, Clock, Play } from 'lucide-react';

export default function NombresDecimauxPage() {
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [xpEarned, setXpEarned] = useState(0);

  const sections = [
    {
      id: 'lire',
      title: 'Lire un nombre décimal',
      description: 'Apprendre à lire les nombres décimaux',
      icon: '👁️',
      duration: '10 min',
      xp: 15,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'ecrire',
      title: 'Écrire un nombre décimal',
      description: 'Écrire les nombres décimaux en chiffres',
      icon: '✏️',
      duration: '15 min',
      xp: 20,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'decomposition',
      title: 'Décomposer un nombre décimal',
      description: 'Décomposer selon les positions',
      icon: '🧩',
      duration: '10 min',
      xp: 15,
      color: 'from-purple-500 to-violet-500'
    },
    {
      id: 'representer',
      title: 'Représenter un nombre décimal',
      description: 'Placer sur une droite graduée',
      icon: '📏',
      duration: '15 min',
      xp: 20,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'encadrer',
      title: 'Encadrer un nombre décimal',
      description: 'Représenter sur la droite graduée (4 < 4,3 < 5)',
      icon: '🔢',
      duration: '12 min',
      xp: 18,
      color: 'from-teal-500 to-cyan-500'
    },
    {
      id: 'comparer',
      title: 'Comparer des nombres décimaux',
      description: 'Comparer et ordonner les nombres décimaux',
      icon: '⚖️',
      duration: '10 min',
      xp: 15,
      color: 'from-pink-500 to-rose-500'
    }
  ];

  const allSections = ['cours', ...sections.map(s => s.id)];

  const getSectionPath = (sectionId: string | number) => {
    if (sectionId === 'cours') {
      return '/chapitre/cm1-nombres-decimaux/lire';
    }
    return `/chapitre/cm1-nombres-decimaux/${sectionId}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header simple */}
        <div className="mb-8">
          <Link href="/cm1" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              🔢 Les nombres décimaux !
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
                  <div className="text-sm text-gray-500 mb-1">
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

        {/* Progression générale */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              <Target className="inline w-6 h-6 mr-2" />
              Progression générale
            </h2>
            <div className="text-sm text-gray-600">
              {completedSections.length} / {sections.length} sections terminées
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-blue-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${(completedSections.length / sections.length) * 100}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-sm text-gray-600">
            <span>0%</span>
            <span className="font-bold">
              {Math.round((completedSections.length / sections.length) * 100)}%
            </span>
            <span>100%</span>
          </div>
        </div>
      </div>
    </div>
  );
} 