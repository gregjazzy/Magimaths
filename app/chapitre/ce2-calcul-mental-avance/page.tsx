'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Eye, Edit, Grid, Target, Trophy, Clock, Play, Calculator, Brain, Plus, Minus } from 'lucide-react';

// Interface pour les progrès d'une section
interface SectionProgress {
  sectionId: string;
  completed: boolean;
  score: number;
  maxScore: number;
  completedAt: string;
  attempts: number;
  xpEarned: number;
}

export default function CE2CalculMentalAvancePage() {
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [xpEarned, setXpEarned] = useState(0);
  const [sectionsProgress, setSectionsProgress] = useState<SectionProgress[]>([]);

  const sections = [
    {
      id: 'complements-1000',
      title: 'Compléments à 1000',
      description: 'Compléments à 1000 (stratégies avancées)',
      icon: '🎯',
      duration: '12 min',
      xp: 18,
      color: 'from-purple-500 to-indigo-500'
    },
    {
      id: 'tables-multiplication',
      title: 'Tables de multiplication',
      description: 'Tables de 2, 3, 4 et 5 (mémorisation)',
      icon: '✖️',
      duration: '12 min',
      xp: 20,
      color: 'from-red-500 to-pink-500'
    },
    {
      id: 'multiplier-par-10',
      title: 'Multiplier par 10',
      description: 'Technique de multiplication par 10',
      icon: '🔟',
      duration: '8 min',
      xp: 12,
      color: 'from-indigo-500 to-purple-500'
    },
    {
      id: 'calculs-approches',
      title: 'Calculs approchés',
      description: 'Estimation et ordres de grandeur',
      icon: '📊',
      duration: '10 min',
      xp: 15,
      color: 'from-amber-500 to-orange-500'
    }
  ];

  // Charger les progrès depuis localStorage au démarrage
  useEffect(() => {
    const savedProgress = localStorage.getItem('ce2-calcul-mental-avance-progress');
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setSectionsProgress(progress);
      const completed = progress.filter((p: SectionProgress) => p.completed).map((p: SectionProgress) => p.sectionId);
      setCompletedSections(completed);
      const totalXP = progress.reduce((total: number, p: SectionProgress) => total + p.xpEarned, 0);
      setXpEarned(totalXP);
    }
  }, []);

  // Écouter les changements dans localStorage (quand on revient d'un exercice)
  useEffect(() => {
    const handleStorageChange = () => {
      const savedProgress = localStorage.getItem('ce2-calcul-mental-avance-progress');
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        setSectionsProgress(progress);
        const completed = progress.filter((p: SectionProgress) => p.completed).map((p: SectionProgress) => p.sectionId);
        setCompletedSections(completed);
        const totalXP = progress.reduce((total: number, p: SectionProgress) => total + p.xpEarned, 0);
        setXpEarned(totalXP);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Vérifier les changements toutes les secondes (pour les changements dans le même onglet)
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const getSectionProgress = (sectionId: string) => {
    return sectionsProgress.find(p => p.sectionId === sectionId);
  };

  const getProgressPercentage = () => {
    if (sections.length === 0) return 0;
    return Math.round((completedSections.length / sections.length) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-2 sm:p-4">
      <div className="max-w-6xl mx-auto">
        {/* En-tête avec navigation */}
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-6 mb-4 sm:mb-8 border-2 border-purple-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <Link 
                href="/ce2" 
                className="bg-purple-100 hover:bg-purple-200 p-2 sm:p-3 rounded-lg transition-colors flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600" />
              </Link>
              <div>
                <h1 className="text-lg sm:text-3xl font-bold text-gray-900">
                  🧮 Calcul Mental Avancé CE2
                </h1>
                <p className="text-xs sm:text-lg text-gray-600 mt-1">
                  Techniques avancées et stratégies de calcul
                </p>
              </div>
            </div>

            {/* Stats de progression */}
            <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
              <div className="bg-purple-100 px-2 sm:px-4 py-1 sm:py-2 rounded-lg">
                <span className="font-bold text-purple-700">
                  {completedSections.length}/{sections.length} ✅
                </span>
              </div>
              <div className="bg-yellow-100 px-2 sm:px-4 py-1 sm:py-2 rounded-lg">
                <span className="font-bold text-yellow-700">
                  {xpEarned} XP 🌟
                </span>
              </div>
            </div>
          </div>

          {/* Barre de progression */}
          <div className="mt-3 sm:mt-4">
            <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">
              <span>Progression du chapitre</span>
              <span>{getProgressPercentage()}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 sm:h-3 rounded-full transition-all duration-500"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Grille des sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-6">
          {sections.map((section) => {
            const isCompleted = completedSections.includes(section.id);
            const progress = getSectionProgress(section.id);
            
            return (
              <div key={section.id} className="group">
                <Link href={`/chapitre/ce2-calcul-mental-avance/${section.id}`}>
                  <div className={`
                    bg-white rounded-xl shadow-lg border-2 p-4 sm:p-6 
                    transition-all duration-300 cursor-pointer
                    hover:scale-105 hover:shadow-xl
                    ${isCompleted 
                      ? 'border-green-400 bg-green-50' 
                      : 'border-gray-200 hover:border-purple-300'
                    }
                  `}>
                    {/* Badge de réussite */}
                    {isCompleted && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                        <Trophy className="w-3 h-3" />
                        Terminé
                      </div>
                    )}

                    {/* Icône et titre */}
                    <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div className={`
                        w-12 h-12 sm:w-16 sm:h-16 rounded-full 
                        bg-gradient-to-r ${section.color}
                        text-white flex items-center justify-center 
                        text-lg sm:text-2xl font-bold shadow-lg
                        group-hover:scale-110 transition-transform duration-300
                      `}>
                        {section.icon}
                      </div>
                      <div className="flex-1">
                        <h2 className="text-sm sm:text-xl font-bold text-gray-900 mb-1">
                          {section.title}
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {section.description}
                        </p>
                      </div>
                    </div>

                    {/* Métriques */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{section.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Target className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{section.xp} XP</span>
                      </div>
                      {progress && (
                        <div className="flex items-center gap-1">
                          <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>{progress.score}/{progress.maxScore}</span>
                        </div>
                      )}
                    </div>

                    {/* Barre de progression individuelle */}
                    {progress && progress.maxScore > 0 && (
                      <div className="mb-3 sm:mb-4">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>Score</span>
                          <span>{Math.round((progress.score / progress.maxScore) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2">
                          <div 
                            className={`bg-gradient-to-r ${section.color} h-1.5 sm:h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${Math.min((progress.score / progress.maxScore) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Bouton d'action */}
                    <div className="flex items-center justify-between">
                      <div className={`
                        inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 
                        rounded-lg font-medium text-xs sm:text-sm transition-colors
                        ${isCompleted 
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                        }
                      `}>
                        {isCompleted ? (
                          <>
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                            Réviser
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                            Commencer
                          </>
                        )}
                      </div>

                      {progress && progress.attempts > 0 && (
                        <div className="text-xs text-gray-500">
                          {progress.attempts} tentative{progress.attempts > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Message d'encouragement */}
        <div className="mt-6 sm:mt-8 text-center">
          <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border-2 border-purple-200">
            <h3 className="text-sm sm:text-lg font-bold text-gray-900 mb-2">
              🎯 Calcul Mental Avancé
            </h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Maîtrise les techniques avancées de calcul mental pour devenir un expert !
              Chaque section te donne des points d'expérience (XP) pour progresser.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}