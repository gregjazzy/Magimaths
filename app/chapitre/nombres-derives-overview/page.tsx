'use client';

import { useState } from 'react';
import { ArrowLeft, BookOpen, Calculator, TrendingUp, Target, Zap, Trophy, Clock, Play } from 'lucide-react';
import Link from 'next/link';

export default function NombresDerivesOverviewPage() {
  const [xpEarned, setXpEarned] = useState(0);
  const [completedSections, setCompletedSections] = useState<string[]>([]);

  const chapters = [
    {
      id: 1,
      title: "Introduction aux Nombres Dérivés",
      href: "/chapitre/nombres-derives",
      description: "Découvrir le concept de dérivée à travers la vitesse et les variations",
      difficulty: "Débutant",
      duration: "45 min",
      xp: 150,
      gradient: "from-blue-500 to-blue-600",
      difficultyColor: "bg-green-100 text-green-800",
      available: true
    },
    {
      id: 2,
      title: "Définition Mathématique",
      href: "/chapitre/nombres-derives-definition",
      description: "Limite du taux d'accroissement et définition rigoureuse",
      difficulty: "Intermédiaire",
      duration: "60 min",
      xp: 200,
      gradient: "from-green-500 to-green-600",
      difficultyColor: "bg-yellow-100 text-yellow-800",
      available: true
    },
    {
      id: 3,
      title: "Taux d'Accroissement",
      href: "/chapitre/nombres-derives-taux-accroissement",
      description: "Comprendre le taux de variation moyen et instantané",
      difficulty: "Intermédiaire",
      duration: "50 min",
      xp: 175,
      gradient: "from-yellow-500 to-yellow-600",
      difficultyColor: "bg-yellow-100 text-yellow-800",
      available: true
    },
    {
      id: 4,
      title: "Méthodes de Calcul",
      href: "/chapitre/nombres-derives-calcul",
      description: "Techniques pratiques pour calculer des nombres dérivés",
      difficulty: "Intermédiaire",
      duration: "70 min",
      xp: 225,
      gradient: "from-purple-500 to-purple-600",
      difficultyColor: "bg-yellow-100 text-yellow-800",
      available: true
    },
    {
      id: 5,
      title: "Équation de la tangente",
      href: "/chapitre/nombres-derives-equation-tangente",
      description: "Détermination de l'équation de la tangente à une courbe en un point",
      difficulty: "Avancé",
      duration: "80 min",
      xp: 275,
      gradient: "from-red-500 to-red-600",
      difficultyColor: "bg-purple-100 text-purple-800",
      available: true
    }
  ];

  const totalXP = chapters.reduce((sum, chapter) => sum + chapter.xp, 0);
  const totalDuration = chapters.reduce((sum, chapter) => {
    return sum + parseInt(chapter.duration);
  }, 0);

    return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
                <ArrowLeft className="h-5 w-5" />
                <span>Retour aux classes</span>
              </Link>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Nombres Dérivés</h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Chapitres</p>
                <p className="text-2xl font-bold text-gray-900">{chapters.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Durée totale</p>
                <p className="text-2xl font-bold text-gray-900">{Math.floor(totalDuration / 60)}h {totalDuration % 60}min</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Trophy className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">XP Total</p>
                <p className="text-2xl font-bold text-gray-900">{totalXP}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chapters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chapters.map((chapter) => (
            <div key={chapter.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300">
              <div className={`h-2 bg-gradient-to-r ${chapter.gradient}`} />
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${chapter.gradient} flex items-center justify-center text-white font-bold text-sm`}>
                      {chapter.id}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                        {chapter.title}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${chapter.difficultyColor}`}>
                          {chapter.difficulty}
                        </span>
                      </div>
                    </div>
                  </div>
                  {chapter.available ? (
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-gray-500">Disponible</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span className="text-xs text-gray-400">Verrouillé</span>
                    </div>
                  )}
                </div>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {chapter.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{chapter.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Trophy className="w-4 h-4" />
                    <span>{chapter.xp} XP</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  {chapter.available ? (
                    <Link href={chapter.href}>
                      <button className={`w-full bg-gradient-to-r ${chapter.gradient} text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg transition-all flex items-center justify-center space-x-2 group`}>
                        <Play className="w-4 h-4" />
                        <span>Commencer</span>
                      </button>
                    </Link>
                  ) : (
                    <button disabled className="w-full bg-gray-100 text-gray-400 py-3 px-4 rounded-lg font-medium cursor-not-allowed flex items-center justify-center space-x-2">
                      <span>Verrouillé</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 