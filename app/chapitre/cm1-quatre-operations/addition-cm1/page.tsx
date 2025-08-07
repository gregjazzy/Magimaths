'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, Clock, Star } from 'lucide-react';

interface SectionProgress {
  sectionId: string;
  completed: boolean;
  completionDate: string;
  xpEarned: number;
}

export default function AdditionCM1() {
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [xpEarned, setXpEarned] = useState(0);
  const [sectionsProgress, setSectionsProgress] = useState<SectionProgress[]>([]);

  const sections = [
    {
      id: 'complements-10-20-100',
      title: 'Compléments à 10, 20, 100',
      description: 'Calcul mental rapide des compléments',
      icon: '🎯',
      duration: '15 min',
      xp: 20,
      color: 'from-green-400 to-emerald-500',
      verified: true
    },
    {
      id: 'additions-posees',
      title: 'Additions posées',
      description: 'Technique opératoire de l\'addition',
      icon: '📝',
      duration: '20 min',
      xp: 25,
      color: 'from-blue-400 to-cyan-500',
      verified: true
    },
    {
      id: 'additions-retenues',
      title: 'Additions avec retenues',
      description: 'Maîtriser les retenues dans l\'addition',
      icon: '🔄',
      duration: '25 min',
      xp: 30,
      color: 'from-purple-400 to-violet-500',
      verified: true
    },
    {
      id: 'problemes-addition',
      title: 'Résolution de problèmes',
      description: 'Problèmes d\'addition à étapes multiples',
      icon: '🧩',
      duration: '20 min',
      xp: 25,
      color: 'from-orange-400 to-red-500',
      verified: true
    }
  ];

  // Charger les progrès au démarrage
  useEffect(() => {
    const savedProgress = localStorage.getItem('cm1-addition-progress');
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
      const savedProgress = localStorage.getItem('cm1-addition-progress');
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

    window.addEventListener('storage', handleStorageChange);
    
    // Polling pour détecter les changements même dans le même onglet
    const interval = setInterval(() => {
      handleStorageChange();
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const getSectionPath = (sectionId: string) => {
    return `/chapitre/cm1-quatre-operations/addition-cm1/${sectionId}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header simple */}
        <div className="mb-8">
          <Link href="/chapitre/cm1-quatre-operations" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            <span>Retour aux Quatre Opérations</span>
          </Link>
          
          <div className="bg-white rounded-xl p-6 shadow-lg text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              ➕ Addition - CM1
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Des compléments aux additions complexes avec retenues !
            </p>
            <div className="text-xl mb-6">
              <span className="bg-green-200 px-4 py-2 rounded-full font-bold text-gray-800">
                {xpEarned} XP gagné !
              </span>
            </div>
            
            {/* Barre de progression */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
              <div 
                className="bg-gradient-to-r from-green-400 to-emerald-500 h-3 rounded-full transition-all duration-500 ease-out"
                style={{width: `${(completedSections.length / sections.length) * 100}%`}}
              ></div>
            </div>
            <p className="text-sm text-gray-500">
              {completedSections.length} / {sections.length} sections terminées
            </p>
          </div>
        </div>

        {/* Objectif pédagogique */}
        <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl p-6 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-3">🎯 Objectif de ce chapitre</h2>
          <p className="text-lg leading-relaxed">
            Maîtriser parfaitement l'addition : du calcul mental des compléments jusqu'aux additions posées 
            complexes avec retenues, en passant par la résolution de problèmes concrets !
          </p>
        </div>

        {/* Grille des sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {sections.map((section, index) => {
            const isCompleted = completedSections.includes(section.id);
            const sectionProgress = sectionsProgress.find(p => p.sectionId === section.id);
            
            return (
              <Link 
                key={section.id} 
                href={getSectionPath(section.id)}
                className="group"
              >
                <div className={`relative bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${
                  isCompleted ? 'border-green-300 bg-green-50' : 'border-gray-200 hover:border-gray-300'
                } transform hover:scale-105`}>
                  
                  {/* Badge de statut */}
                  {isCompleted && (
                    <div className="absolute -top-2 -right-2">
                      <div className="bg-green-500 text-white rounded-full p-2 shadow-lg">
                        <CheckCircle className="w-6 h-6" />
                      </div>
                    </div>
                  )}
                  
                  {/* Numéro de section */}
                  <div className="absolute -top-3 -left-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg bg-gradient-to-r ${section.color}`}>
                      {index + 1}
                    </div>
                  </div>
                  
                  {/* Contenu */}
                  <div className="pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`text-4xl p-3 rounded-lg bg-gradient-to-r ${section.color} text-white shadow-md`}>
                        {section.icon}
                      </div>
                      {section.verified && (
                        <div className="flex items-center space-x-1 text-blue-600 bg-blue-100 px-2 py-1 rounded-full text-xs font-medium">
                          <CheckCircle className="w-3 h-3" />
                          <span>Vérifié</span>
                        </div>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                      {section.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {section.description}
                    </p>
                    
                    {/* Métadonnées */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1 text-gray-500">
                          <Clock className="w-4 h-4" />
                          <span>{section.duration}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-yellow-600">
                          <Star className="w-4 h-4 fill-current" />
                          <span>{section.xp} XP</span>
                        </div>
                      </div>
                      
                      {isCompleted && sectionProgress && (
                        <div className="text-xs text-green-600 font-medium">
                          Terminé le {new Date(sectionProgress.completionDate).toLocaleDateString('fr-FR')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Résumé des progrès */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📊 Résumé de tes progrès</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-100 rounded-lg">
              <div className="text-3xl font-bold text-green-600">{completedSections.length}</div>
              <div className="text-sm text-gray-600">Sections terminées</div>
            </div>
            <div className="text-center p-4 bg-yellow-100 rounded-lg">
              <div className="text-3xl font-bold text-yellow-600">{xpEarned}</div>
              <div className="text-sm text-gray-600">Points d'expérience</div>
            </div>
            <div className="text-center p-4 bg-blue-100 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{Math.round((completedSections.length / sections.length) * 100)}%</div>
              <div className="text-sm text-gray-600">Progression totale</div>
            </div>
          </div>
        </div>

        {/* Message d'encouragement */}
        {completedSections.length === sections.length ? (
          <div className="mt-8 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-xl p-6 shadow-lg">
            <h3 className="text-2xl font-bold mb-2">🎉 Félicitations !</h3>
            <p className="text-lg">
              Tu as terminé toutes les sections sur l'addition ! Tu maîtrises maintenant parfaitement cette opération !
            </p>
          </div>
        ) : (
          <div className="mt-8 text-center bg-gradient-to-r from-blue-400 to-cyan-500 text-white rounded-xl p-6 shadow-lg">
            <h3 className="text-2xl font-bold mb-2">💪 Continue comme ça !</h3>
            <p className="text-lg">
              Tu progresses bien ! Encore {sections.length - completedSections.length} section{sections.length - completedSections.length > 1 ? 's' : ''} à découvrir.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}