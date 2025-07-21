'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Eye, Edit, Grid, Target, Trophy, Clock, Play, Calculator, Brain, Plus, Minus } from 'lucide-react';

export default function CE1CalculMentalPage() {
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [xpEarned, setXpEarned] = useState(0);

  const sections = [
    {
      id: 'tables-addition',
      title: 'Tables d\'addition',
      description: 'Mémoriser les faits numériques de l\'addition',
      icon: '➕',
      duration: '15 min',
      xp: 20,
      color: 'from-purple-500 to-violet-500'
    },
    {
      id: 'tables-multiplication',
      title: 'Tables de multiplication',
      description: 'Tables de 2, 3, 4 et 5 (mémorisation)',
      icon: '✖️',
      duration: '18 min',
      xp: 25,
      color: 'from-red-500 to-pink-500'
    },
    {
      id: 'complements-10',
      title: 'Compléments à 10',
      description: 'Compléments à 10 (automatismes)',
      icon: '🎯',
      duration: '10 min',
      xp: 15,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'complements-100',
      title: 'Compléments à 100',
      description: 'Compléments à 100 (calcul mental)',
      icon: '💯',
      duration: '12 min',
      xp: 18,
      color: 'from-teal-500 to-blue-500'
    },
    {
      id: 'doubles-moities',
      title: 'Doubles et moitiés',
      description: 'Nombres usuels jusqu\'à 70 (6, 8, 11, 13, 17...)',
      icon: '👥',
      duration: '12 min',
      xp: 15,
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 'multiplier-par-10',
      title: 'Multiplier par 10',
      description: 'Technique de multiplication par 10',
      icon: '🔟',
      duration: '10 min',
      xp: 15,
      color: 'from-indigo-500 to-purple-500'
    }
  ];

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
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/ce1" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour à CE1</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                <Calculator className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              🧠 Calcul mental CE1
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Mémorise les faits numériques et maîtrise le calcul mental selon les programmes officiels !
            </p>
            
            {/* Barre de progression */}
            <div className="bg-gray-200 rounded-full h-4 mb-4">
              <div 
                className="bg-gradient-to-r from-yellow-500 to-orange-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">
              {completedSections.length}/{sections.length} sections terminées • {xpEarned}/{totalXP} XP
            </p>
          </div>
        </div>

        {/* Introduction */}
        <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <Brain className="w-6 h-6 mr-2 text-yellow-500" />
            Pourquoi apprendre le calcul mental ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-bold text-yellow-800 mb-2">Plus rapide</h3>
              <p className="text-yellow-700 text-sm">Calcule sans compter sur tes doigts !</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-bold text-orange-800 mb-2">Plus précis</h3>
              <p className="text-orange-700 text-sm">Moins d'erreurs dans tes calculs !</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-3xl mb-2">🏆</div>
              <h3 className="font-bold text-red-800 mb-2">Plus confiant</h3>
              <p className="text-red-700 text-sm">Deviens un as des mathématiques !</p>
            </div>
          </div>
        </div>

        {/* Sections du chapitre */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((section, index) => {
            const isCompleted = completedSections.includes(section.id);
            
            return (
              <div key={section.id} className="relative group">
                <Link href={`/chapitre/ce1-calcul-mental/${section.id}`}>
                  <div className={`
                    bg-white rounded-xl p-6 shadow-lg transition-all duration-300 border-2
                    ${isCompleted ? 'border-green-400 bg-green-50' : 'border-transparent hover:shadow-xl hover:scale-105 hover:border-gray-200'}
                  `}>
                    {/* Badge de statut */}
                    <div className="flex justify-between items-start mb-4">
                      <div className={`
                        w-12 h-12 rounded-full flex items-center justify-center text-2xl
                        bg-gradient-to-br ${section.color}
                      `}>
                        <span className="text-white">{section.icon}</span>
                      </div>
                      
                      {isCompleted && (
                        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center">
                          <Trophy className="w-4 h-4 mr-1" />
                          Terminé
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {section.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm">
                      {section.description}
                    </p>
                    
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {section.duration}
                      </div>
                      <div className="flex items-center">
                        <Target className="w-4 h-4 mr-1" />
                        {section.xp} XP
                      </div>
                    </div>
                    
                    {/* Indicateur d'action */}
                    <div className="mt-4">
                        <div className={`
                          inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium
                          ${isCompleted 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gradient-to-r text-white ' + section.color
                          }
                        `}>
                          {isCompleted ? (
                            <>
                              <Eye className="w-4 h-4 mr-2" />
                              Revoir
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-2" />
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
        <div className="mt-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-6 text-white">
          <h3 className="text-xl font-bold mb-3 flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            💡 Conseils pour réussir
          </h3>
          <ul className="space-y-2 text-sm">
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