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
    id: 'dizaines',
    title: 'Les dizaines',
    description: 'Comprendre les groupes de 10 : 10, 20, 30... Valeur positionnelle',
    icon: '📦',
    duration: '10 min',
    xp: 12,
    color: 'from-green-500 to-emerald-500',
    verified: true
  },
  {
    id: 'unites-dizaines',
    title: 'Unités et dizaines',
    description: 'Connaître la valeur des chiffres selon leur position',
    icon: '🔢',
    duration: '12 min',
    xp: 15,
    color: 'from-blue-500 to-cyan-500',
    verified: true
  },
  {
    id: 'lecture-ecriture',
    title: 'Lire et écrire jusqu\'à 100',
    description: 'Lire et écrire tous les nombres jusqu\'à 100',
    icon: '✏️',
    duration: '12 min',
    xp: 15,
    color: 'from-purple-500 to-violet-500',
    verified: true
  },
  {
    id: 'ordonner-comparer',
    title: 'Ordonner et comparer',
    description: 'Ranger dans l\'ordre et comparer avec < > =',
    icon: '📊',
    duration: '10 min',
    xp: 12,
    color: 'from-orange-500 to-red-500',
    verified: true
  },
  {
    id: 'doubles-moities',
    title: 'Doubles et moitiés',
    description: 'Connaître les doubles < 10 et moitiés des pairs < 20',
    icon: '🎯',
    duration: '8 min',
    xp: 10,
    color: 'from-pink-500 to-rose-500',
    verified: true
  }
]

export default function CPNombresJusqu100Page() {
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [xpEarned, setXpEarned] = useState(0);
  const [sectionsProgress, setSectionsProgress] = useState<SectionProgress[]>([]);

  // Charger les progrès au démarrage
  useEffect(() => {
    const savedProgress = localStorage.getItem('cp-nombres-100-progress');
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
      const savedProgress = localStorage.getItem('cp-nombres-100-progress');
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
    return `/chapitre/cp-nombres-jusqu-100/${sectionId}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100">
      <div className="max-w-6xl mx-auto px-2 sm:px-3 lg:px-4 py-3 sm:py-4 lg:py-6">
        {/* Header simple - version mobile compacte */}
        <div className="mb-4 sm:mb-6">
          <Link href="/cp" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-2 sm:mb-3">
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm">Retour au CP</span>
          </Link>
          
          <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 shadow-lg text-center">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
              💯 Nombres jusqu'à 100
            </h1>
            <div className="text-xs text-gray-500 mb-1 sm:mb-2">
              2nde partie année
            </div>
            <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-3 sm:mb-4">
              Extension jusqu'à 100 ! Découvre les dizaines, unités et les doubles/moitiés.
            </p>
            <div className="text-sm sm:text-base mb-3 sm:mb-4">
              <span className="bg-green-200 px-2 sm:px-3 py-1 sm:py-2 rounded-full font-bold text-gray-800 text-xs sm:text-sm">
                {xpEarned} XP gagné !
              </span>
            </div>
          </div>
        </div>

        {/* Introduction ludique - version compacte */}
        <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 text-white">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3">
            <div className="text-2xl sm:text-3xl lg:text-4xl">🎯</div>
            <div className="text-center sm:text-left">
              <h2 className="text-sm sm:text-base lg:text-lg font-bold mb-1">Programme français CP - 2nde partie</h2>
              <p className="text-xs sm:text-sm">
                Extension vers 100 ! Unités/dizaines, comparer, ordonner. Doubles et moitiés.
              </p>
            </div>
          </div>
        </div>

        {/* Mini-game des dizaines - version compacte */}
        <div className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 shadow-lg mb-4 sm:mb-6">
          <h2 className="text-sm sm:text-base lg:text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center justify-center sm:justify-start">
            <span className="text-lg sm:text-xl mr-2">🎮</span>
            Mini-jeu : Les dizaines !
          </h2>
          <div className="bg-gradient-to-r from-green-100 to-blue-100 p-3 sm:p-4 rounded-lg text-center">
            <p className="text-sm sm:text-base font-medium text-gray-700 mb-3 sm:mb-4">
              Combien y a-t-il de dizaines dans <strong className="text-green-600">40</strong> ?
            </p>
            <div className="flex justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
              <button className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white rounded-lg shadow-md hover:bg-green-50 transition-colors font-bold text-sm sm:text-base lg:text-lg text-gray-800 hover:text-green-800">
                3
              </button>
              <button className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white rounded-lg shadow-md hover:bg-green-50 transition-colors font-bold text-sm sm:text-base lg:text-lg text-gray-800 hover:text-green-800">
                4
              </button>
              <button className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-white rounded-lg shadow-md hover:bg-green-50 transition-colors font-bold text-sm sm:text-base lg:text-lg text-gray-800 hover:text-green-800">
                40
              </button>
            </div>
            <p className="text-xs text-gray-600">40 = 4 dizaines + 0 unités</p>
          </div>
        </div>

        {/* Exercices - grille responsive compacte */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          {sections.map((section) => (
            <div key={section.id} className="bg-white rounded-xl p-3 sm:p-4 lg:p-5 shadow-lg hover:shadow-xl transition-all transform hover:scale-105 relative">
              {/* Badge de statut vérifié */}
              {section.verified && (
                <div className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-green-500 text-white px-1 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-bold flex items-center">
                  ✓ Vérifié
                </div>
              )}
              
              <div className="text-center mb-2 sm:mb-3">
                <div className="text-2xl sm:text-3xl lg:text-4xl mb-1 sm:mb-2">{section.icon}</div>
                <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 leading-tight">{section.title}</h3>
              </div>
              
              <div className="text-center mb-3 sm:mb-4">
                <p className="text-gray-600 text-xs sm:text-sm lg:text-base mb-2 leading-relaxed">{section.description}</p>
                <div className="flex flex-col sm:flex-row justify-center items-center space-y-1 sm:space-y-0 sm:space-x-2 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{section.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Trophy className="w-3 h-3" />
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
                className={`block w-full bg-gradient-to-r ${section.color} text-white text-center py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-bold text-sm sm:text-base hover:opacity-90 transition-opacity`}
              >
                <Play className="inline w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Commencer !
              </Link>
            </div>
          ))}
        </div>

        {/* Progression - version compacte */}
        <div className="mt-4 sm:mt-6 bg-white rounded-xl p-3 sm:p-4 lg:p-6 shadow-lg">
          <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 mb-2 sm:mb-3 text-center">
            📊 Ta progression
          </h3>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-6">
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-green-600">{completedSections.length}</div>
              <div className="text-xs text-gray-600">Sections terminées</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-blue-600">{sections.length}</div>
              <div className="text-xs text-gray-600">Sections au total</div>
            </div>
            <div className="text-center">
              <div className="text-xl sm:text-2xl font-bold text-yellow-600">{xpEarned}</div>
              <div className="text-xs text-gray-600">Points d'expérience</div>
            </div>
          </div>
          
          {/* Barre de progression */}
          <div className="mt-3 sm:mt-4">
            <div className="bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${(completedSections.length / sections.length) * 100}%` }}
              ></div>
            </div>
            <p className="text-center text-xs text-gray-600 mt-1 sm:mt-2">
              {Math.round((completedSections.length / sections.length) * 100)}% terminé
            </p>
          </div>
        </div>

        {/* Encouragements - version compacte */}
        <div className="mt-4 sm:mt-6 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-3 sm:p-4 lg:p-6 text-white">
            <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🌟</div>
            <h3 className="text-sm sm:text-base lg:text-lg font-bold mb-1">Super travail petit CP !</h3>
            <p className="text-xs sm:text-sm lg:text-base">
              {completedSections.length === 0 && "Prêt pour les grands nombres ?"}
              {completedSections.length > 0 && completedSections.length < sections.length && "Tu maîtrises de mieux en mieux !"}
              {completedSections.length === sections.length && "Bravo ! Tu connais tous les nombres jusqu'à 100 !"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 