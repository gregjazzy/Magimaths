'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Eye, Edit, Grid, Target, Trophy, Clock, Play } from 'lucide-react'

interface SectionProgress {
  sectionId: string;
  completed: boolean;
  score: number;
  maxScore: number;
  completedAt: string;
  attempts: number;
}

const sections = [
  {
    id: 'reconnaissance',
    title: 'Reconnaître les nombres',
    description: 'Identifier et nommer les nombres de 0 à 20',
    icon: '👁️',
    duration: '8 min',
    xp: 10,
    color: 'from-blue-500 to-cyan-500',
    verified: true
  },
  {
    id: 'comptage',
    title: 'Compter jusqu\'à 20',
    description: 'Dénombrer des collections et réciter la suite numérique',
    icon: '🔢',
    duration: '10 min',
    xp: 12,
    color: 'from-green-500 to-emerald-500',
    verified: true
  },
  {
    id: 'ecriture',
    title: 'Lire et écrire',
    description: 'Écrire les nombres en chiffres et en lettres',
    icon: '✏️',
    duration: '12 min',
    xp: 15,
    color: 'from-purple-500 to-violet-500',
    verified: true
  },
  {
    id: 'decompositions',
    title: 'Décompositions additives',
    description: 'Savoir que 5 = 2+3 = 1+4... Toutes les façons de faire un nombre',
    icon: '🧩',
    duration: '10 min',
    xp: 12,
    color: 'from-orange-500 to-red-500',
    verified: true
  },
  {
    id: 'complements-10',
    title: 'Compléments à 10',
    description: 'Connaître par cœur les compléments à 10 (7+3=10, 6+4=10...)',
    icon: '🎯',
    duration: '8 min',
    xp: 10,
    color: 'from-pink-500 to-rose-500',
    verified: true
  },
  {
    id: 'dizaines-unites',
    title: 'Dizaines et unités',
    description: 'Comprendre la différence entre unités et dizaines',
    icon: '🔢',
    duration: '10 min',
    xp: 12,
    color: 'from-blue-500 to-indigo-500',
    verified: true
  },
  {
    id: 'ordonner-comparer',
    title: 'Ordonner et comparer',
    description: 'Utiliser les signes <, > et = pour comparer les nombres',
    icon: '📊',
    duration: '12 min',
    xp: 15,
    color: 'from-green-500 to-teal-500',
    verified: true
  },
  {
    id: 'doubles-moities',
    title: 'Doubles et moitiés',
    description: 'Connaître les doubles < 10 et moitiés des pairs < 20',
    icon: '🎯',
    duration: '10 min',
    xp: 12,
    color: 'from-yellow-500 to-amber-500',
    verified: true
  }
]

export default function CPNombresJusqu20Page() {
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [xpEarned, setXpEarned] = useState(0);
  const [sectionsProgress, setSectionsProgress] = useState<SectionProgress[]>([]);

  // Charger les progrès au démarrage
  useEffect(() => {
    const savedProgress = localStorage.getItem('cp-nombres-20-progress');
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      setSectionsProgress(progress);
      
      // Calculer les sections complétées et XP
      const completed = progress.filter((p: SectionProgress) => p.completed).map((p: SectionProgress) => p.sectionId);
      setCompletedSections(completed);
      
      // Calculer les XP basés sur les scores
      const totalXP = progress.reduce((total: number, p: SectionProgress) => {
        if (p.completed && p.maxScore > 0) {
          const section = sections.find(s => s.id === p.sectionId);
          if (section) {
            // XP = XP de base * pourcentage de réussite
            const percentage = p.score / p.maxScore;
            return total + Math.round(section.xp * percentage);
          }
        }
        return total;
      }, 0);
      setXpEarned(totalXP);
    }
  }, []);

  // Écouter les changements dans localStorage (quand on revient d'un exercice)
  useEffect(() => {
    const handleStorageChange = () => {
      const savedProgress = localStorage.getItem('cp-nombres-20-progress');
      if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        setSectionsProgress(progress);
        
        const completed = progress.filter((p: SectionProgress) => p.completed).map((p: SectionProgress) => p.sectionId);
        setCompletedSections(completed);
        
        const totalXP = progress.reduce((total: number, p: SectionProgress) => {
          if (p.completed && p.maxScore > 0) {
            const section = sections.find(s => s.id === p.sectionId);
            if (section) {
              const percentage = p.score / p.maxScore;
              return total + Math.round(section.xp * percentage);
            }
          }
          return total;
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
    return `/chapitre/cp-nombres-jusqu-20/${sectionId}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Header simple */}
        <div className="mb-6 sm:mb-8">
          <Link href="/cp" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-3 sm:mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm sm:text-base">Retour au CP</span>
          </Link>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              🔢 Nombres jusqu'à 20 (1ère partie année)
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 px-2">
              Découvre tes premiers nombres de 0 à 20 et apprends les compléments à 10 !
            </p>
            <div className="text-lg sm:text-xl mb-4 sm:mb-6">
              <span className="bg-orange-200 px-3 sm:px-4 py-2 rounded-full font-bold text-gray-800 text-sm sm:text-base">
                {xpEarned} XP gagné !
              </span>
            </div>
          </div>
        </div>

        {/* Introduction ludique */}
        <div className="bg-gradient-to-r from-orange-400 to-red-500 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 text-white">
          <div className="flex flex-col sm:flex-row items-center justify-center text-center sm:text-left space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="text-4xl sm:text-6xl">🎯</div>
            <div>
              <h2 className="text-lg sm:text-2xl font-bold mb-2">Programme français CP - 1ère partie</h2>
              <p className="text-sm sm:text-lg">
                Dénombrer, lire, écrire les premiers nombres. Connaître les décompositions et compléments à 10 !
              </p>
            </div>
          </div>
        </div>

        {/* Exercices - grille simple style CE1 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {sections.map((section) => (
            <div key={section.id} className="bg-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 relative">
              {/* Badge de statut vérifié */}
              {section.verified && (
                <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                  ✓ Vérifié
                </div>
              )}
              
              <div className="text-center mb-3 sm:mb-4">
                <div className="text-4xl sm:text-5xl mb-2 sm:mb-3">{section.icon}</div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 px-2">{section.title}</h3>
              </div>
              
              <div className="text-center mb-4 sm:mb-6">
                <p className="text-gray-600 text-sm sm:text-base lg:text-lg px-2">{section.description}</p>
                <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4 mt-3 text-xs sm:text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{section.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Trophy className="w-3 h-3 sm:w-4 sm:h-4" />
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
                className={`block w-full bg-gradient-to-r ${section.color} text-white text-center py-3 px-4 sm:px-6 rounded-lg font-bold text-base sm:text-lg hover:opacity-90 transition-opacity`}
              >
                <Play className="inline w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Commencer !
              </Link>
            </div>
          ))}
        </div>

        {/* Progression */}
        <div className="mt-6 sm:mt-8 bg-white rounded-xl p-4 sm:p-6 shadow-lg">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 text-center">
            📊 Ta progression
          </h3>
          <div className="flex justify-center gap-4 sm:gap-8">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-green-600">{completedSections.length}</div>
              <div className="text-xs sm:text-sm text-gray-600">Sections<br className="sm:hidden" /> terminées</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-blue-600">{sections.length}</div>
              <div className="text-xs sm:text-sm text-gray-600">Sections<br className="sm:hidden" /> au total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-yellow-600">{xpEarned}</div>
              <div className="text-xs sm:text-sm text-gray-600">Points<br className="sm:hidden" /> d'expérience</div>
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
        <div className="mt-6 sm:mt-8 text-center">
          <div className="bg-gradient-to-r from-pink-400 to-orange-400 rounded-xl p-4 sm:p-6 text-white">
            <div className="text-3xl sm:text-4xl mb-3">🌟</div>
            <h3 className="text-lg sm:text-xl font-bold mb-2">Bravo petit CP !</h3>
            <p className="text-sm sm:text-base lg:text-lg px-2">
              {completedSections.length === 0 && "Découvre tes premiers nombres !"}
              {completedSections.length > 0 && completedSections.length < sections.length && "Continue, tu apprends super bien !"}
              {completedSections.length === sections.length && "Félicitations ! Tu maîtrises les nombres jusqu'à 20 !"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 