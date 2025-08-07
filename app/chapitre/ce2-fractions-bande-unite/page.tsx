'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Eye, Edit, Grid, Target, Trophy, Clock, Play } from 'lucide-react';

interface SectionProgress {
  sectionId: string;
  score: number;
  maxScore: number;
  attempts: number;
  completed: boolean;
  completionDate: string;
  xpEarned: number;
}

export default function CE2FractionsBandeUnite() {
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [xpEarned, setXpEarned] = useState(0);
  const [sectionsProgress, setSectionsProgress] = useState<SectionProgress[]>([]);

  const sections = [
    {
      id: 'vocabulaire',
      title: 'Vocabulaire des fractions',
      description: 'Moitié, tiers, quart avec bandes unité...',
      icon: '💬',
      duration: '8 min',
      xp: 10,
      color: 'from-blue-500 to-cyan-500',
      verified: true
    },
    {
      id: 'comparaison',
      title: 'Comparer les fractions',
      description: 'Quelle fraction est plus grande ?',
      icon: '⚖️',
      duration: '10 min',
      xp: 12,
      color: 'from-green-500 to-emerald-500',
      verified: true
    },
    {
      id: 'addition',
      title: 'Additionner des fractions',
      description: 'Premières additions avec bandes unité',
      icon: '➕',
      duration: '12 min',
      xp: 15,
      color: 'from-purple-500 to-pink-500',
      verified: true
    }
  ]

  // Charger les progrès au démarrage
  useEffect(() => {
    const savedProgress = localStorage.getItem('ce2-fractions-bande-unite-progress');
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setSectionsProgress(progress);
      
      // Calculer les sections complétées et XP
      const completed = progress.filter((p: SectionProgress) => p.completed).map((p: SectionProgress) => p.sectionId);
      setCompletedSections(completed);
      
      // Calculer les XP totaux
      const totalXP = progress.reduce((total: number, p: SectionProgress) => {
        return total + (p.xpEarned || 0);
      }, 0);
      setXpEarned(totalXP);
    }
  }, []);

  // Écouter les changements dans localStorage (quand on revient d'un exercice)
  useEffect(() => {
    const handleStorageChange = () => {
      const savedProgress = localStorage.getItem('ce2-fractions-bande-unite-progress');
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        setSectionsProgress(progress);
        
        const completed = progress.filter((p: SectionProgress) => p.completed).map((p: SectionProgress) => p.sectionId);
        setCompletedSections(completed);
        
        const totalXP = progress.reduce((total: number, p: SectionProgress) => {
          return total + (p.xpEarned || 0);
        }, 0);
        setXpEarned(totalXP);
      }
    };

    // Écouter les changements de localStorage
    window.addEventListener('storage', handleStorageChange);
    
    // Vérifier périodiquement les changements (pour les changements dans le même onglet)
    const interval = setInterval(handleStorageChange, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const getSectionPath = (sectionId: string) => {
    return `/chapitre/ce2-fractions-bande-unite/${sectionId}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header simple */}
        <div className="mb-8">
          <Link href="/ce2" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au CE2</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              📏 Fractions et bandes unité !
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Découvre les fractions avec les bandes unité : moitiés, tiers, quarts...
            </p>
            <div className="text-xl mb-6">
              <span className="bg-orange-200 px-4 py-2 rounded-full font-bold text-gray-800">
                {xpEarned} XP gagné !
              </span>
            </div>
          </div>
        </div>

        {/* Introduction ludique */}
        <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-xl p-6 mb-8 text-white">
          <div className="flex items-center justify-center space-x-4">
            <div className="text-6xl">🎯</div>
            <div>
              <h2 className="text-2xl font-bold mb-2">Objectif du chapitre</h2>
              <p className="text-lg">
                À la fin de ce chapitre, tu sauras utiliser les bandes unité pour comprendre et comparer les fractions !
              </p>
            </div>
          </div>
        </div>

        {/* Exercices - grille simple */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section) => (
            <div key={section.id} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 relative">
              {/* Badge de statut vérifié */}
              {section.verified && (
                <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                  ✓ Vérifié
                </div>
              )}
              
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
                  {section.verified && (
                    <div className="flex items-center space-x-1 text-green-600">
                      <span className="text-xs font-medium">Vérifié</span>
                    </div>
                  )}
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
              <div className="text-3xl font-bold text-green-600">{completedSections.length}</div>
              <div className="text-sm text-gray-600">Sections terminées</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{sections.length}</div>
              <div className="text-sm text-gray-600">Sections au total</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{xpEarned}</div>
              <div className="text-sm text-gray-600">Points d'expérience</div>
            </div>
          </div>
          
          {/* Barre de progression */}
          <div className="mt-4">
            <div className="bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-orange-400 to-red-500 h-3 rounded-full transition-all duration-500"
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
            <h3 className="text-xl font-bold mb-2">Bravo petit mathématicien !</h3>
            <p className="text-lg">
              {completedSections.length === 0 && "Commence ton aventure avec les fractions et les bandes unité !"}
              {completedSections.length > 0 && completedSections.length < sections.length && "Continue, tu fais du super travail !"}
              {completedSections.length === sections.length && "Félicitations ! Tu maîtrises les fractions avec les bandes unité !"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}