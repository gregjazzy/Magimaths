'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, Trophy, Target } from 'lucide-react';

export default function OperationsDecimaux6emePage() {
  const config = { color: '#3b82f6', icon: '🔢', name: 'Opérations sur les nombres décimaux' };

  const subChapters = [
    {
      id: 'comprendre-decimaux',
      title: 'Comprendre les nombres décimaux',
      description: 'Découvre ce que sont les nombres décimaux et leur importance dans la vie quotidienne. Nous verrons leur structure et leur représentation sur une droite graduée.',
      icon: '📐',
      estimatedTime: 30,
      difficulty: 'Fondamental',
      href: '/chapitre/6eme-operations-decimaux/comprendre-decimaux'
    },
    {
      id: 'addition-soustraction-decimaux',
      title: 'Addition et soustraction',
      description: 'Apprends à additionner et soustraire des nombres décimaux en comprenant le rôle de la virgule et l\'alignement des chiffres.',
      icon: '➕',
      estimatedTime: 35,
      difficulty: 'Intermédiaire',
      href: '/chapitre/6eme-operations-decimaux/addition-soustraction-decimaux'
    },
    {
      id: 'multiplication-decimaux',
      title: 'Multiplication des décimaux',
      description: 'Maîtrise la multiplication des nombres décimaux en comprenant le placement de la virgule et les techniques de calcul.',
      icon: '✖️',
      estimatedTime: 40,
      difficulty: 'Avancé',
      href: '/chapitre/6eme-operations-decimaux/multiplication-decimaux'
    },
    {
      id: 'problemes-concrets',
      title: 'Applications concrètes',
      description: 'Résous des problèmes de la vie quotidienne impliquant des nombres décimaux (prix, mesures, échelles...).',
      icon: '🛒',
      estimatedTime: 45,
      difficulty: 'Pratique',
      href: '/chapitre/6eme-operations-decimaux/problemes-concrets'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/6eme" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au programme de 6ème</span>
          </Link>

          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🔢 Les nombres décimaux - 6ème
            </h1>
            <p className="text-lg text-gray-600">
              Découvre et maîtrise les opérations avec les nombres décimaux, essentielles pour comprendre les mathématiques au collège !
            </p>
          </div>
        </div>

        {/* Introduction pédagogique */}
        <div className="bg-gradient-to-r from-blue-400 to-cyan-500 rounded-xl p-6 mb-8 text-white">
          <div className="flex items-center justify-center space-x-4">
            <div className="text-6xl">📚</div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Pourquoi étudier les nombres décimaux ?</h2>
              <p className="text-lg">
                Les nombres décimaux sont partout dans notre vie quotidienne : prix, mesures, calculs... 
                Ce chapitre te permettra de les comprendre en profondeur et de les utiliser avec confiance !
              </p>
            </div>
          </div>
        </div>

        {/* Prérequis et conseils */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">🎯 Pour bien réussir ce chapitre</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Assure-toi de bien maîtriser les nombres entiers et leur ordre</li>
            <li>Révise les techniques de calcul mental avec les nombres entiers</li>
            <li>Prends ton temps pour comprendre chaque nouvelle notion</li>
            <li>N\'hésite pas à refaire les exercices jusqu\'à te sentir à l\'aise</li>
          </ul>
        </div>

        {/* Sub-chapters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subChapters.map((subChapter) => (
            <div key={subChapter.id} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              <div className="text-center mb-4">
                <div className="text-5xl mb-3">{subChapter.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900">{subChapter.title}</h3>
              </div>
              
              <div className="text-center mb-6">
                <p className="text-gray-600 text-lg mb-4">{subChapter.description}</p>
                <div className="flex justify-center items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{subChapter.estimatedTime} min</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Target className="w-4 h-4" />
                    <span>{subChapter.difficulty}</span>
                  </div>
                </div>
              </div>
              
              <Link 
                href={subChapter.href}
                className="block w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-center py-3 px-6 rounded-lg font-bold text-lg hover:opacity-90 transition-opacity"
              >
                <BookOpen className="inline w-5 h-5 mr-2" />
                Commencer
              </Link>
            </div>
          ))}
        </div>

        {/* Progression et objectifs */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-xl p-6 text-center">
          <div className="text-4xl mb-3">🎯</div>
          <h3 className="text-xl font-bold text-green-800 mb-2">Objectifs d\'apprentissage</h3>
          <p className="text-green-700">
            À la fin de ce chapitre, tu sauras manipuler les nombres décimaux avec confiance et 
            résoudre des problèmes concrets de la vie quotidienne !
          </p>
        </div>
      </div>
    </div>
  );
}
