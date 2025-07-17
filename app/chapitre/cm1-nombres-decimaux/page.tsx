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

  const progressPercentage = (completedSections.length / allSections.length) * 100;
  const totalXP = sections.reduce((sum, section) => sum + section.xp, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Particules de fond pour l'effet magique */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blue-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-purple-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-20 w-56 h-56 bg-pink-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
        <div className="absolute bottom-40 right-40 w-32 h-32 bg-indigo-300/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
        {/* Header moderne */}
        <div className="mb-8">
          <Link href="/cm1" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour</span>
          </Link>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 text-center">
            <div className="relative">
              <div className="absolute top-3 right-3 w-5 h-5 text-yellow-400 animate-pulse">✨</div>
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              🔢 Les nombres décimaux !
            </h1>
            <div className="text-2xl mb-6">
                <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 px-6 py-3 rounded-full font-bold text-white shadow-lg">
                {xpEarned} XP gagné !
              </span>
              </div>
            </div>
          </div>
        </div>

        {/* Exercices - grille moderne */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="text-3xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      {section.icon}
                    </div>
                  <div>
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{section.title}</h3>
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
                  className={`w-full bg-gradient-to-r ${section.color} text-white py-3 px-4 rounded-xl font-bold text-center inline-block hover:opacity-90 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl`}
              >
                <Play className="inline w-4 h-4 mr-2" />
                Commencer
              </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Progression générale moderne */}
        <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              <Target className="inline w-6 h-6 mr-2" />
              Progression générale
            </h2>
            <div className="text-sm text-gray-600">
              {completedSections.length} / {allSections.length} sections terminées
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between items-center text-sm text-gray-600">
            <span>{Math.round(progressPercentage)}% terminé</span>
            <span>XP total possible: {totalXP}</span>
          </div>
        </div>
      </div>
    </div>
  );
} 