'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Ruler, Scale, Beaker, Clock, Target, Calculator, Eye, Edit } from 'lucide-react';

export default function GrandeursMesuresPage() {
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [xpEarned, setXpEarned] = useState(0);

  const sections = [
    {
      id: 'longueurs',
      title: 'Longueurs',
      description: 'Mesurer, comparer et convertir les longueurs (mm, cm, m, km)',
      icon: '📏',
      duration: '25 min',
      xp: 50,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'masses',
      title: 'Masses',
      description: 'Peser, estimer et convertir les masses (g, kg, t)',
      icon: '⚖️',
      duration: '20 min',
      xp: 40,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'contenances',
      title: 'Contenances',
      description: 'Mesurer et convertir les contenances (mL, L, hL)',
      icon: '🥛',
      duration: '20 min',
      xp: 40,
      color: 'from-purple-500 to-violet-500'
    },
    {
      id: 'temps',
      title: 'Temps et durées',
      description: 'Lire l\'heure, calculer des durées (h, min, s)',
      icon: '⏰',
      duration: '25 min',
      xp: 50,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'estimations',
      title: 'Estimations',
      description: 'Estimer des grandeurs et vérifier la cohérence',
      icon: '🎯',
      duration: '15 min',
      xp: 30,
      color: 'from-pink-500 to-rose-500'
    }
  ];

  const allSections = ['cours', ...sections.map(s => s.id)];
  const progressPercentage = (completedSections.length / allSections.length) * 100;
  const totalXP = sections.reduce((sum, section) => sum + section.xp, 0);

  const handleSectionComplete = (sectionId: string, earnedXP: number) => {
    if (!completedSections.includes(sectionId)) {
      setCompletedSections([...completedSections, sectionId]);
      setXpEarned(xpEarned + earnedXP);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/cm1" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
              <ArrowLeft size={20} />
              <span>Retour au CM1</span>
            </Link>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                📏
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Grandeurs et mesures</h1>
                <p className="text-gray-600 text-lg">
                  Longueurs, masses, contenances, temps et durées - Estimations
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Progression</span>
                <span className="text-sm font-medium text-gray-700">{Math.round(progressPercentage)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{completedSections.length}</div>
                <div className="text-sm text-gray-500">Sections complètes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{xpEarned} XP</div>
                <div className="text-sm text-gray-500">Points gagnés</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{totalXP}</div>
                <div className="text-sm text-gray-500">Total XP</div>
              </div>
            </div>


          </div>
        </div>

        {/* Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <Link
              key={section.id}
              href={`/chapitre/cm1-grandeurs-mesures/${section.id}`}
              className="group block transform transition-all duration-300 hover:scale-105"
            >
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
                <div className={`h-2 bg-gradient-to-r ${section.color}`}></div>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${section.color} rounded-xl flex items-center justify-center text-white text-xl font-bold`}>
                      {section.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                        {section.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1">{section.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock size={16} />
                      {section.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Target size={16} />
                      {section.xp} XP
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${
                        completedSections.includes(section.id) ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                      <span className="text-sm text-gray-600">
                        {completedSections.includes(section.id) ? 'Terminé' : 'À faire'}
                      </span>
                    </div>
                    <div className="text-blue-600 group-hover:text-blue-700 transition-colors">
                      <BookOpen size={20} />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 