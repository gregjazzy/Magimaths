'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Square, Ruler, Clock, Trophy, Play } from 'lucide-react';

export default function AiresPerimetresPage() {
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [xpEarned, setXpEarned] = useState(0);

  const sections = [
    {
      id: 'perimetre',
      title: 'Périmètre',
      description: 'Mesurer et calculer le périmètre de figures géométriques',
      icon: '📏',
      duration: '30 min',
      xp: 60,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'aire',
      title: 'Aire',
      description: 'Comparer et mesurer les aires de figures simples',
      icon: '⬜',
      duration: '30 min',
      xp: 60,
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const allSections = ['cours', ...sections.map(s => s.id)];
  const progressPercentage = (completedSections.length / allSections.length) * 100;
  const totalXP = sections.reduce((sum, section) => sum + section.xp, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/cm1" className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors">
            <ArrowLeft size={20} />
            <span>Retour au CM1</span>
          </Link>
        </div>
        
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
              □
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Aires et périmètres</h1>
              <p className="text-gray-600 text-lg">
                Mesure et comparaison des aires et périmètres des figures géométriques
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
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{sections.length}</div>
              <div className="text-sm text-gray-600">Sections</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">{totalXP}</div>
              <div className="text-sm text-gray-600">XP Total</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">{sections.reduce((sum, s) => sum + parseInt(s.duration), 0)}</div>
              <div className="text-sm text-gray-600">Minutes</div>
            </div>
          </div>


        </div>

        {/* Sections */}
        <div className="grid gap-6 mt-8">
          {sections.map((section) => (
            <div key={section.id} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${section.color} rounded-2xl flex items-center justify-center text-white text-2xl font-bold`}>
                    {section.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{section.title}</h3>
                    <p className="text-gray-600 mt-1">{section.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock size={16} />
                        <span>{section.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Trophy size={16} />
                        <span>{section.xp} XP</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      completedSections.includes(section.id) 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {completedSections.includes(section.id) ? 'Terminé' : 'À faire'}
                    </span>
                  </div>
                  <Link
                    href={`/chapitre/cm1-aires-perimetres/${section.id}`}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                      completedSections.includes(section.id)
                        ? 'bg-green-500 text-white hover:bg-green-600'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    <Play size={16} />
                    <span>{completedSections.includes(section.id) ? 'Revoir' : 'Commencer'}</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 