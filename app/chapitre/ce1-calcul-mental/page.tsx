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

export default function CE1CalculMentalPage() {
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [xpEarned, setXpEarned] = useState(0);
  const [sectionsProgress, setSectionsProgress] = useState<SectionProgress[]>([]);

  const sections = [
    {
      id: 'tables-addition',
      title: 'Tables d\'addition',
      description: 'Mémoriser les faits numériques de l\'addition',
      icon: '➕',
      duration: '10 min',
      xp: 15,
      color: 'from-purple-500 to-violet-500'
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
      id: 'complements-10',
      title: 'Compléments à 10',
      description: 'Compléments à 10 (automatismes)',
      icon: '🎯',
      duration: '8 min',
      xp: 10,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'complements-100',
      title: 'Compléments à 100',
      description: 'Compléments à 100 (calcul mental)',
      icon: '💯',
      duration: '10 min',
      xp: 15,
      color: 'from-teal-500 to-blue-500'
    },
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
      id: 'doubles-moities',
      title: 'Doubles et moitiés',
      description: 'Nombres usuels jusqu\'à 70 (6, 8, 11, 13, 17...)',
      icon: '👥',
      duration: '10 min',
      xp: 12,
      color: 'from-green-500 to-emerald-500'
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
      id: 'strategies-calcul',
      title: 'Stratégies de calcul',
      description: 'Méthodes et astuces de calcul mental',
      icon: '🧠',
      duration: '8 min',
      xp: 12,
      color: 'from-yellow-500 to-orange-500'
    },
    {
      id: 'additions-simples',
      title: 'Additions simples',
      description: 'Additions rapides avec chronomètre',
      icon: '⏱️',
      duration: '8 min',
      xp: 12,
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'soustractions-simples',
      title: 'Soustractions simples',
      description: 'Soustractions jusqu\'à 20 avec animations',
      icon: '➖',
      duration: '8 min',
      xp: 12,
      color: 'from-pink-500 to-purple-500'
    }
  ];

  // Charger les progrès depuis localStorage au démarrage
  useEffect(() => {
    const savedProgress = localStorage.getItem('ce1-calcul-mental-progress');
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
      const savedProgress = localStorage.getItem('ce1-calcul-mental-progress');
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

  const markSectionComplete = (sectionId: string, xp: number) => {
    if (!completedSections.includes(sectionId)) {
      setCompletedSections([...completedSections, sectionId]);
      setXpEarned(xpEarned + xp);
    }
  };

  const totalXP = sections.reduce((sum, section) => sum + section.xp, 0);
  const progressPercentage = (xpEarned / totalXP) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link href="/ce1" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4 touch-manipulation">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Retour à CE1</span>
          </Link>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                <Calculator className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              🧠 Calcul mental CE1
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6">
              Mémorise les faits numériques et maîtrise le calcul mental selon les programmes officiels !
            </p>
            
            {/* Barre de progression */}
            <div className="bg-gray-200 rounded-full h-4 mb-6">
              <div 
                className="bg-gradient-to-r from-yellow-500 to-orange-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            
            {/* Affichage XP mis en avant */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mb-4">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 w-full sm:w-auto">
                <div className="flex items-center justify-center space-x-2">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-lg sm:text-xl font-bold">{xpEarned}/{totalXP} XP</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300 w-full sm:w-auto">
                <div className="flex items-center justify-center space-x-2">
                  <Trophy className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-lg sm:text-xl font-bold">{completedSections.length}/{sections.length} sections</span>
                </div>
              </div>
            </div>
            
            {/* Niveau et pourcentage */}
            {xpEarned > 0 && (
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-3 sm:p-4 mb-3 sm:mb-4">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-purple-600 mb-1">
                    🌟 Niveau {Math.floor(xpEarned / 20) + 1}
                  </div>
                  <div className="text-xs sm:text-sm text-purple-500 font-semibold">
                    {Math.round(progressPercentage)}% complété
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 flex items-center justify-center sm:justify-start">
            <Brain className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-yellow-500" />
            <span className="text-center sm:text-left">Pourquoi apprendre le calcul mental ?</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center p-3 sm:p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl sm:text-3xl mb-2">⚡</div>
              <h3 className="font-bold text-yellow-800 mb-2 text-sm sm:text-base">Plus rapide</h3>
              <p className="text-yellow-700 text-xs sm:text-sm">Calcule sans compter sur tes doigts !</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl sm:text-3xl mb-2">🎯</div>
              <h3 className="font-bold text-orange-800 mb-2 text-sm sm:text-base">Plus précis</h3>
              <p className="text-orange-700 text-xs sm:text-sm">Moins d'erreurs dans tes calculs !</p>
            </div>
            <div className="text-center p-3 sm:p-4 bg-red-50 rounded-lg">
              <div className="text-2xl sm:text-3xl mb-2">🏆</div>
              <h3 className="font-bold text-red-800 mb-2 text-sm sm:text-base">Plus confiant</h3>
              <p className="text-red-700 text-xs sm:text-sm">Deviens un as des mathématiques !</p>
            </div>
          </div>
        </div>

        {/* Sections du chapitre */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {sections.map((section, index) => {
            const isCompleted = completedSections.includes(section.id);
            
            return (
              <div key={section.id} className="relative group">
                <Link href={`/chapitre/ce1-calcul-mental/${section.id}`}>
                  <div className={`
                    bg-white rounded-xl p-4 sm:p-6 shadow-lg transition-all duration-300 border-2 touch-manipulation
                    ${isCompleted ? 'border-green-400 bg-green-50' : 'border-transparent hover:shadow-xl hover:scale-105 hover:border-gray-200 active:scale-95'}
                  `}>
                    {/* Badge de statut */}
                    <div className="flex justify-between items-start mb-3 sm:mb-4">
                      <div className={`
                        w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xl sm:text-2xl
                        bg-gradient-to-br ${section.color}
                      `}>
                        <span className="text-white">{section.icon}</span>
                      </div>
                      
                      {isCompleted && (
                        <div className="bg-green-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold flex items-center">
                          <Trophy className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          <span className="hidden sm:inline">Terminé</span>
                          <span className="sm:hidden">✓</span>
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                      {section.title}
                    </h3>
                    <p className="text-gray-600 mb-3 sm:mb-4 text-xs sm:text-sm leading-relaxed">
                      {section.description}
                    </p>
                    
                    <div className="flex justify-between items-center text-xs sm:text-sm text-gray-500 mb-3 sm:mb-0">
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span>{section.duration}</span>
                      </div>
                      <div className="flex items-center">
                        <Target className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                        <span>{section.xp} XP</span>
                      </div>
                    </div>
                    
                    {/* Indicateur d'action */}
                    <div className="mt-3 sm:mt-4">
                        <div className={`
                          inline-flex items-center justify-center w-full sm:w-auto px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium
                          ${isCompleted 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gradient-to-r text-white ' + section.color
                          }
                        `}>
                          {isCompleted ? (
                            <>
                              <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                              Revoir
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                              Commencer
                            </>
                          )}
                        </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* Conseils généraux */}
        <div className="mt-6 sm:mt-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-4 sm:p-6 text-white">
          <h3 className="text-lg sm:text-xl font-bold mb-3 flex items-center justify-center sm:justify-start">
            <Brain className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            💡 Conseils pour réussir
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm">
            <li>• 🎯 Entraîne-toi un peu chaque jour</li>
            <li>• 🧠 Visualise les nombres dans ta tête</li>
            <li>• ⚡ Commence doucement, puis accélère</li>
            <li>• 🏆 Célèbre tes progrès !</li>
            <li>• 🤝 Demande de l'aide si tu en as besoin</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 