'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Eye, Edit, Grid, Target, Trophy, Clock, Play } from 'lucide-react';

export default function NombresEntiersJusquAuMillionPage() {
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [xpEarned, setXpEarned] = useState(0);

  const sections = [
    {
      id: 'lire',
      title: 'Lire un nombre',
      description: 'Apprendre à lire les nombres jusqu\'au million',
      icon: '👁️',
      duration: '10 min',
      xp: 15,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'ecrire',
      title: 'Écrire un nombre',
      description: 'Écrire les nombres en chiffres',
      icon: '✏️',
      duration: '15 min',
      xp: 20,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'decomposition',
      title: 'Décomposer un nombre',
      description: 'Décomposer selon les positions',
      icon: '🧩',
      duration: '10 min',
      xp: 15,
      color: 'from-purple-500 to-violet-500'
    },
    {
      id: 'representer',
      title: 'Représenter un nombre',
      description: 'Placer sur une droite graduée',
      icon: '📏',
      duration: '15 min',
      xp: 20,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'ordonner',
      title: 'Ordonner les nombres',
      description: 'Comparer et ranger les nombres jusqu\'au million',
      icon: '🔢',
      duration: '20 min',
      xp: 25,
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  const allSections = ['cours', ...sections.map(s => s.id)];

  const getSectionPath = (sectionId: string | number) => {
    if (sectionId === 'cours') {
      return '/chapitre/nombres-entiers-jusqu-au-million/lire';
    }
    return `/chapitre/nombres-entiers-jusqu-au-million/${sectionId}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header simple */}
        <div className="mb-8">
          <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              🔢 Les nombres jusqu'au million !
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
              <div className="text-center mb-4">
                <div className="text-5xl mb-3">{section.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900">{section.title}</h3>
              </div>
              
              <div className="text-center mb-6">
                <p className="text-gray-600 text-lg">{section.description}</p>
                <div className="flex justify-center items-center space-x-4 mt-3 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{section.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Trophy className="w-4 h-4" />
                    <span>{section.xp} XP</span>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <Link 
                  href={getSectionPath(section.id)}
                  className={`inline-flex items-center space-x-2 px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105 bg-gradient-to-r ${section.color} text-white hover:shadow-lg`}
                >
                  <span className="text-xl">
                    {completedSections.includes(section.id) ? '✅' : '▶️'}
                  </span>
                  <span>
                    {completedSections.includes(section.id) ? 'Terminé !' : 'Jouer'}
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Barre de progression simple */}
        {completedSections.length > 0 && (
          <div className="mt-8 bg-white rounded-xl p-6 shadow-lg">
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold text-gray-900">🏆 Tes progrès</h3>
            </div>
            <div className="flex justify-center">
              <div className="bg-gray-200 rounded-full h-8 w-80">
                <div 
                  className="bg-gradient-to-r from-green-400 to-green-600 h-8 rounded-full transition-all duration-1000 flex items-center justify-center"
                  style={{ width: `${(completedSections.length / allSections.length) * 100}%` }}
                >
                  <span className="text-white font-bold">
                    {Math.round((completedSections.length / allSections.length) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 