'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Eye, Edit, Grid, Target, Trophy, Clock, Play, Ruler, Scale, Droplets, Timer, Euro } from 'lucide-react';

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

export default function CE1GrandeursMesuresPage() {
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [xpEarned, setXpEarned] = useState(0);
  const [sectionsProgress, setSectionsProgress] = useState<SectionProgress[]>([]);

  const sections = [
    {
      id: 'longueurs',
      title: 'Longueurs',
      description: 'Estimer, comparer et mesurer des longueurs (cm, dm, m)',
      icon: '📏',
      duration: '15 min',
      xp: 18,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'masses',
      title: 'Masses',
      description: 'Estimer, comparer et peser des masses (g, kg)',
      icon: '⚖️',
      duration: '12 min',
      xp: 15,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'contenances',
      title: 'Contenances',
      description: 'Estimer et comparer des volumes (L)',
      icon: '🥤',
      duration: '10 min',
      xp: 12,
      color: 'from-purple-500 to-violet-500'
    },
    {
      id: 'durees',
      title: 'Durées',
      description: 'Lire l\'heure, calculer des durées, utiliser le calendrier',
      icon: '🕐',
      duration: '18 min',
      xp: 20,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'monnaie',
      title: 'Monnaie',
      description: 'Connaître l\'euro, calculer des prix et rendre la monnaie',
      icon: '💰',
      duration: '15 min',
      xp: 16,
      color: 'from-yellow-500 to-orange-500'
    }
  ];

  // Charger les progrès depuis localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('ce1-grandeurs-mesures-progress');
    if (savedProgress) {
      try {
        const progress: SectionProgress[] = JSON.parse(savedProgress);
        setSectionsProgress(progress);
        
        const completed = progress
          .filter(p => p.completed)
          .map(p => p.sectionId);
        setCompletedSections(completed);
        
        const totalXP = progress.reduce((sum, p) => sum + (p.xpEarned || 0), 0);
        setXpEarned(totalXP);
      } catch (error) {
        console.error('Erreur lors du chargement des progrès:', error);
      }
    }
    
    // Écouter les changements de localStorage
    const handleStorageChange = () => {
      const savedProgress = localStorage.getItem('ce1-grandeurs-mesures-progress');
      if (savedProgress) {
        try {
          const progress: SectionProgress[] = JSON.parse(savedProgress);
          setSectionsProgress(progress);
          
          const completed = progress
            .filter(p => p.completed)
            .map(p => p.sectionId);
          setCompletedSections(completed);
          
          const totalXP = progress.reduce((sum, p) => sum + (p.xpEarned || 0), 0);
          setXpEarned(totalXP);
        } catch (error) {
          console.error('Erreur lors du chargement des progrès:', error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const getSectionProgress = (sectionId: string) => {
    return sectionsProgress.find(p => p.sectionId === sectionId);
  };

  const totalPossibleXP = sections.reduce((sum, section) => sum + section.xp, 0);
  const progressPercentage = totalPossibleXP > 0 ? (xpEarned / totalPossibleXP) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* En-tête */}
      <div className="bg-white shadow-md border-b-4 border-blue-400">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/ce1" 
                className="inline-flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Retour CE1
              </Link>
              <div className="hidden sm:block w-px h-8 bg-gray-300"></div>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  📏
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Grandeurs et Mesures</h1>
                  <p className="text-sm sm:text-base text-gray-600">Apprendre à mesurer le monde qui nous entoure</p>
                </div>
              </div>
            </div>
            
            {/* Indicateur de progression */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-600">Progression</div>
                <div className="font-bold text-blue-600">{Math.round(progressPercentage)}%</div>
              </div>
              <div className="w-32 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              <div className="flex items-center space-x-2 bg-yellow-100 px-3 py-2 rounded-lg">
                <Trophy className="w-4 h-4 text-yellow-600" />
                <span className="font-bold text-yellow-800">{xpEarned} XP</span>
              </div>
            </div>
          </div>
          
          {/* Progression mobile */}
          <div className="md:hidden mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progression: {Math.round(progressPercentage)}%</span>
              <span className="font-bold text-yellow-600">{xpEarned} XP</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8 border-l-4 border-blue-500">
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">
                🌟 Programme de CE1 - Grandeurs et Mesures
              </h2>
              <p className="text-gray-700 mb-4 text-sm sm:text-base">
                Ce chapitre développe ta capacité à <strong>mesurer et comparer</strong> différentes grandeurs du quotidien.
                Tu vas apprendre à utiliser les bons outils et les bonnes unités !
              </p>
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-bold text-blue-800 mb-2">🎯 Objectifs d'apprentissage :</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Mesurer des longueurs avec une règle</li>
                  <li>• Comparer des masses avec une balance</li>
                  <li>• Estimer des contenances en litres</li>
                  <li>• Lire l'heure et calculer des durées</li>
                  <li>• Utiliser l'euro dans des situations simples</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Grille des sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section, index) => {
            const isCompleted = completedSections.includes(section.id);
            const progress = getSectionProgress(section.id);
            const sectionPercentage = progress ? (progress.score / progress.maxScore) * 100 : 0;

            return (
              <Link
                key={section.id}
                href={`/chapitre/ce1-grandeurs-mesures/${section.id}`}
                className="group block"
              >
                <div className={`
                  relative bg-white rounded-2xl shadow-lg p-6 border-2 transition-all duration-300
                  ${isCompleted 
                    ? 'border-green-400 shadow-green-100' 
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-blue-100'
                  }
                  hover:shadow-xl hover:-translate-y-1 transform
                `}>
                  {/* Badge de completion */}
                  {isCompleted && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                      <Trophy className="w-4 h-4 text-white" />
                    </div>
                  )}

                  {/* Gradient de fond */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${section.color} opacity-5 group-hover:opacity-10 transition-opacity`}></div>
                  
                  {/* Contenu */}
                  <div className="relative">
                    {/* En-tête */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center text-2xl shadow-lg`}>
                        {section.icon}
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500 mb-1">XP</div>
                        <div className="font-bold text-yellow-600">+{section.xp}</div>
                      </div>
                    </div>

                    {/* Titre et description */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {section.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {section.description}
                    </p>

                    {/* Métadonnées */}
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{section.duration}</span>
                      </div>
                      {progress && (
                        <div className="flex items-center space-x-1">
                          <Target className="w-3 h-3" />
                          <span>{progress.score}/{progress.maxScore}</span>
                        </div>
                      )}
                    </div>

                    {/* Barre de progression */}
                    {progress && (
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
                        <div 
                          className={`h-full bg-gradient-to-r ${section.color} transition-all duration-500`}
                          style={{ width: `${sectionPercentage}%` }}
                        ></div>
                      </div>
                    )}

                    {/* Bouton d'action */}
                    <div className={`
                      w-full py-3 px-4 rounded-xl font-bold text-center transition-all
                      ${isCompleted
                        ? 'bg-green-100 text-green-700 border border-green-300'
                        : `bg-gradient-to-r ${section.color} text-white hover:shadow-lg`
                      }
                    `}>
                      <div className="flex items-center justify-center space-x-2">
                        {isCompleted ? (
                          <>
                            <Trophy className="w-4 h-4" />
                            <span>Revoir</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4" />
                            <span>Commencer</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Récapitulatif des compétences */}
        <div className="mt-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-2xl shadow-xl p-8 text-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">🏆 Objectif: Maîtriser les grandeurs et mesures</h2>
            <p className="text-blue-100 mb-6 max-w-3xl mx-auto">
              Complète toutes les sections pour devenir un expert en mesures ! 
              Tu sauras mesurer des longueurs, peser des objets, évaluer des volumes, lire l'heure et utiliser l'argent.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto">
              {sections.map((section) => {
                const isCompleted = completedSections.includes(section.id);
                return (
                  <div key={section.id} className="text-center">
                    <div className={`
                      w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl mb-2 transition-all
                      ${isCompleted ? 'bg-white bg-opacity-20 scale-110' : 'bg-white bg-opacity-10'}
                    `}>
                      {section.icon}
                    </div>
                    <div className={`text-sm font-medium ${isCompleted ? 'text-yellow-200' : 'text-blue-200'}`}>
                      {section.title}
                    </div>
                    {isCompleted && (
                      <div className="text-xs text-green-200 mt-1">✓ Terminé</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 