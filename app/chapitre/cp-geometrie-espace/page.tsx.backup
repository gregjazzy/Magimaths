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
    id: 'reperage-espace',
    title: 'Se repérer dans l\'espace',
    description: 'Apprendre les mots : dessus, dessous, devant, derrière, à côté...',
    icon: '🧭',
    duration: '12 min',
    xp: 15,
    color: 'from-indigo-500 to-purple-500',
    verified: true
  },
  {
    id: 'formes-geometriques',
    title: 'Les formes géométriques',
    description: 'Reconnaître les carrés, cercles, triangles et rectangles',
    icon: '🔺',
    duration: '10 min',
    xp: 12,
    color: 'from-blue-500 to-cyan-500',
    verified: true
  },
  {
    id: 'lignes-traits',
    title: 'Lignes et traits',
    description: 'Tracer des lignes droites et courbes avec précision',
    icon: '📏',
    duration: '8 min',
    xp: 10,
    color: 'from-green-500 to-emerald-500',
    verified: true
  },
  {
    id: 'reproductions',
    title: 'Reproduire des figures',
    description: 'Copier des dessins simples et des motifs géométriques',
    icon: '🎨',
    duration: '12 min',
    xp: 15,
    color: 'from-purple-500 to-violet-500',
    verified: true
  },
  {
    id: 'quadrillages',
    title: 'Se repérer sur quadrillage',
    description: 'Utiliser un quadrillage pour dessiner et se repérer dans l\'espace',
    icon: '⬜',
    duration: '10 min',
    xp: 12,
    color: 'from-red-500 to-pink-500',
    verified: true
  }
]

export default function CPGeometrieEspacePage() {
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [xpEarned, setXpEarned] = useState(0);
  const [sectionsProgress, setSectionsProgress] = useState<SectionProgress[]>([]);

  // Charger les progrès au démarrage
  useEffect(() => {
    const savedProgress = localStorage.getItem('cp-geometrie-progress');
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
      const savedProgress = localStorage.getItem('cp-geometrie-progress');
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
    return `/chapitre/cp-geometrie-espace/${sectionId}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
        {/* Header simple */}
        <div className="mb-6 sm:mb-8">
          <Link href="/cp" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-3 sm:mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm sm:text-base">Retour au CP</span>
          </Link>
          
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-lg text-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              📐 Géométrie et espace
            </h1>
            <p className="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 px-2">
              Découvre les formes, apprends à te repérer dans l\'espace et trace tes premiers dessins !
            </p>
            <div className="text-lg sm:text-xl mb-4 sm:mb-6">
              <span className="bg-indigo-200 px-3 sm:px-4 py-2 rounded-full font-bold text-gray-800 text-sm sm:text-base">
                {xpEarned} XP gagné !
              </span>
            </div>
          </div>
        </div>

        {/* Introduction ludique */}
        <div className="bg-gradient-to-r from-indigo-400 to-blue-500 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 text-white">
          <div className="flex flex-col sm:flex-row items-center justify-center text-center sm:text-left space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="text-4xl sm:text-6xl">🎯</div>
            <div>
              <h2 className="text-lg sm:text-2xl font-bold mb-2">Programme français CP - Géométrie</h2>
              <p className="text-sm sm:text-lg">
                Se repérer dans l\'espace, reconnaître les formes, reproduire des figures !
              </p>
            </div>
          </div>
        </div>

        {/* Ce qu'il faut retenir selon le programme */}
        <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 shadow-lg mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center">
            <span className="text-2xl sm:text-3xl mr-0 sm:mr-3 mb-2 sm:mb-0">💡</span>
            <span className="text-center sm:text-left">Ce qu'il faut retenir (Programme officiel)</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="bg-indigo-50 p-4 sm:p-6 rounded-lg border border-indigo-200">
              <h3 className="font-bold text-indigo-800 mb-3 text-sm sm:text-base">🧭 Se repérer dans l\'espace</h3>
              <ul className="space-y-2 text-gray-700 text-sm sm:text-base">
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  Vocabulaire spatial (dessus, dessous, devant...)
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  Se déplacer sur un quadrillage
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  Décrire une position relative
                </li>
              </ul>
            </div>
            <div className="bg-blue-50 p-4 sm:p-6 rounded-lg border border-blue-200">
              <h3 className="font-bold text-blue-800 mb-3 text-sm sm:text-base">🔺 Formes et figures</h3>
              <ul className="space-y-2 text-gray-700 text-sm sm:text-base">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Reconnaître carré, rectangle, triangle, cercle
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Tracer à la règle et au compas
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Reproduire des figures simples
                </li>
              </ul>
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
                className="bg-gradient-to-r from-indigo-400 to-blue-500 h-3 rounded-full transition-all duration-500"
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
          <div className="bg-gradient-to-r from-indigo-400 to-blue-400 rounded-xl p-4 sm:p-6 text-white">
            <div className="text-3xl sm:text-4xl mb-3">🌟</div>
            <h3 className="text-lg sm:text-xl font-bold mb-2">Bravo petit architecte !</h3>
            <p className="text-sm sm:text-base lg:text-lg px-2">
              {completedSections.length === 0 && "Prêt à explorer les formes et l'espace ?"}
              {completedSections.length > 0 && completedSections.length < sections.length && "Continue, tu deviens un expert des formes !"}
              {completedSections.length === sections.length && "Félicitations ! Tu maîtrises la géométrie !"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 