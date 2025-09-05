'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, Trophy, Target } from 'lucide-react';

export default function PremiersCalculsCP() {
  const config = { color: '#4ade80', icon: '123', name: 'Premiers Calculs CP' };

  const subChapters = [
    {
      id: 'compter-objets',
      title: 'Je compte les objets',
      description: 'On va compter ensemble ! Comme quand tu comptes tes jouets ou tes bonbons 🍬',
      icon: '🧸',  // Ours en peluche - représente les objets à compter
      estimatedTime: 15,
      difficulty: 'Pour débuter',
      href: '/chapitre/cp-premiers-calculs/compter-objets'
    },
    {
      id: 'ajouter-nombres',
      title: 'J\'ajoute des nombres',
      description: 'Quand on met des choses ensemble, on ajoute ! Comme quand tu mets des billes dans ton sac 👜',
      icon: '🎯',  // Cible - représente l'objectif d'ajouter
      estimatedTime: 20,
      difficulty: 'Je commence',
      href: '/chapitre/cp-premiers-calculs/ajouter-nombres'
    },
    {
      id: 'enlever-nombres',
      title: 'J\'enlève des nombres',
      description: 'Parfois on enlève des choses. Comme quand tu manges des bonbons de ton paquet 🍪',
      icon: '🎈',  // Ballon - quand on en enlève un d'un groupe
      estimatedTime: 20,
      difficulty: 'Je progresse',
      href: '/chapitre/cp-premiers-calculs/enlever-nombres'
    },
    {
      id: 'petits-problemes',
      title: 'Je résous des problèmes',
      description: 'On va jouer avec les nombres pour résoudre des devinettes amusantes !',
      icon: '🌟',  // Étoile - représente la réussite
      estimatedTime: 25,
      difficulty: 'Je deviens fort',
      href: '/chapitre/cp-premiers-calculs/petits-problemes'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête simple */}
        <div className="mb-8">
          <Link href="/cp" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à ma classe de CP</span>
          </Link>

          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              123 Mes premiers calculs
            </h1>
            <p className="text-xl text-gray-600">
              Viens t'amuser avec les nombres !
            </p>
          </div>
        </div>

        {/* Message d'encouragement */}
        <div className="bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl p-6 mb-8 text-white">
          <div className="flex items-center justify-center space-x-4">
            <div className="text-6xl">🌈</div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Tu es prêt ?</h2>
              <p className="text-xl">
                On va découvrir ensemble comment compter et calculer, comme un grand !
              </p>
            </div>
          </div>
        </div>

        {/* Grille des activités */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subChapters.map((subChapter) => (
            <div key={subChapter.id} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              {/* Grande icône avec explication */}
              <div className="text-center mb-4">
                <div className="text-7xl mb-3">{subChapter.icon}</div>
                <div className="text-sm text-gray-500 mb-2">
                  {subChapter.icon === '🧸' && "Compte les objets comme tes jouets !"}
                  {subChapter.icon === '🎯' && "Ajoute comme dans un jeu !"}
                  {subChapter.icon === '🎈' && "Enlève comme des ballons qui s'envolent !"}
                  {subChapter.icon === '🌟' && "Brille comme une étoile en résolvant les devinettes !"}
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{subChapter.title}</h3>
              </div>
              
              <div className="text-center mb-6">
                <p className="text-gray-600 text-xl mb-4">{subChapter.description}</p>
                <div className="flex justify-center items-center space-x-4 text-lg text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-5 h-5" />
                    <span>{subChapter.estimatedTime} minutes</span>
                  </div>
                </div>
              </div>
              
              <Link 
                href={subChapter.href}
                className="block w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-center py-4 px-6 rounded-lg font-bold text-xl hover:opacity-90 transition-opacity"
              >
                <div className="flex items-center justify-center">
                  <span className="mr-2">👉</span>
                  <span>Je commence !</span>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Message d'encouragement final */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
          <div className="text-4xl mb-3">🌟</div>
          <h3 className="text-xl font-bold text-yellow-800 mb-2">Super !</h3>
          <p className="text-yellow-700 text-lg">
            Tu vas devenir un champion des nombres !
          </p>
        </div>
      </div>
    </div>
  );
}
