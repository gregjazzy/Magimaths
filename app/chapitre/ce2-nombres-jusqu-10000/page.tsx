'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Eye, Edit, Grid, Target, Trophy, Clock, Play } from 'lucide-react';

export default function CE2NombresJusqu10000Page() {
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [xpEarned, setXpEarned] = useState(0);

  const sections = [
    {
      id: 'lire',
      title: 'Lire un nombre',
      description: 'Apprendre à lire les nombres jusqu\'à 10 000',
      icon: '👁️',
      duration: '8 min',
      xp: 12,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'ecrire',
      title: 'Écrire un nombre',
      description: 'Écrire les nombres en chiffres',
      icon: '✏️',
      duration: '10 min',
      xp: 15,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'decomposition',
      title: 'Décomposer un nombre',
      description: 'Décomposer en milliers, centaines, dizaines, unités',
      icon: '🧩',
      duration: '8 min',
      xp: 12,
      color: 'from-purple-500 to-violet-500'
    },
    {
      id: 'representer',
      title: 'Représenter un nombre',
      description: 'Placer sur une droite numérique',
      icon: '📏',
      duration: '10 min',
      xp: 15,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'ordonner',
      title: 'Ordonner les nombres',
      description: 'Comparer et ranger les nombres jusqu\'à 10 000',
      icon: '🔢',
      duration: '12 min',
      xp: 18,
      color: 'from-teal-500 to-cyan-500'
    }
  ];

  const getSectionPath = (sectionId: string) => {
    return `/chapitre/ce2-nombres-jusqu-10000/${sectionId}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header simple */}
        <div className="mb-8">
          <Link href="/ce2" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au CE2</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🔢 Les nombres jusqu'à 10 000 !
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Explore les grands nombres et apprends à les maîtriser parfaitement !
            </p>
            <div className="text-xl mb-6">
              <span className="bg-teal-200 px-4 py-2 rounded-full font-bold text-gray-800">
                {xpEarned} XP gagné !
              </span>
            </div>
          </div>
        </div>

        {/* Introduction ludique */}
        <div className="bg-gradient-to-r from-teal-400 to-cyan-500 rounded-xl p-6 mb-8 text-white">
          <div className="flex items-center justify-center space-x-4">
            <div className="text-6xl">🎯</div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Objectif du chapitre</h2>
              <p className="text-lg">
                À la fin de ce chapitre, tu maîtriseras parfaitement tous les nombres jusqu'à 10 000 !
              </p>
            </div>
          </div>
        </div>

        {/* Sections - grille simple */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section) => (
            <div key={section.id} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
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
              
              <Link 
                href={getSectionPath(section.id)}
                className={`block w-full bg-gradient-to-r ${section.color} text-white text-center py-3 px-6 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity`}
              >
                <Play className="inline w-5 h-5 mr-2" />
                Commencer !
              </Link>
            </div>
          ))}
        </div>

        {/* Progression */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
            📊 Ta progression
          </h3>
          <div className="flex justify-center space-x-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-600">{completedSections.length}</div>
              <div className="text-sm text-gray-600">Sections terminées</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-cyan-600">{sections.length}</div>
              <div className="text-sm text-gray-600">Sections au total</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-600">{xpEarned}</div>
              <div className="text-sm text-gray-600">Points d'expérience</div>
            </div>
          </div>
          
          {/* Barre de progression */}
          <div className="mt-4">
            <div className="bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-teal-400 to-cyan-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(completedSections.length / sections.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-center text-sm text-gray-600 mt-2">
              {Math.round((completedSections.length / sections.length) * 100)}% terminé
            </p>
          </div>
        </div>

        {/* Encouragements */}
        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-orange-400 to-red-400 rounded-xl p-6 text-white">
            <div className="text-4xl mb-3">🌟</div>
            <h3 className="text-xl font-bold mb-2">Bravo petit champion !</h3>
            <p className="text-lg">
              {completedSections.length === 0 && "Lance-toi dans cette nouvelle aventure avec les grands nombres !"}
              {completedSections.length > 0 && completedSections.length < sections.length && "Tu progresses très bien, continue comme ça !"}
              {completedSections.length === sections.length && "Fantastique ! Tu maîtrises les nombres jusqu'à 10 000 !"}
            </p>
          </div>
        </div>

        {/* Information pédagogique */}
        <div className="mt-8 bg-blue-50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-blue-800 mb-3">💡 Ce que tu vas apprendre</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-700">
            <div>• Lire les nombres à 4 chiffres</div>
            <div>• Écrire les nombres en lettres et en chiffres</div>
            <div>• Comprendre les milliers, centaines, dizaines, unités</div>
            <div>• Placer les nombres sur une droite</div>
          </div>
        </div>
      </div>
    </div>
  );
} 