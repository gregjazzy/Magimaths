'use client';

import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Clock, Star, Trophy } from 'lucide-react';
import Link from 'next/link';
import { getChaptersGroupedByClass, getAvailableClassLevels } from '@/lib/chapters';
import { Chapter, ClassLevel } from '@/types';
import { useState } from 'react';

export default function ChaptersSection() {
  const [selectedClass, setSelectedClass] = useState<ClassLevel>('1ere');
  const chaptersGroupedByClass = getChaptersGroupedByClass();
  const availableClassLevels = getAvailableClassLevels();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const getClassInfo = (classLevel: ClassLevel) => {
    const classInfo = {
      CE1: {
        title: 'CE1 - Cours Élémentaire 1ère année',
        description: 'Premiers apprentissages en mathématiques',
        color: 'from-red-400 to-pink-500',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      },
      CE2: {
        title: 'CE2 - Cours Élémentaire 2ème année',
        description: 'Consolidation des bases',
        color: 'from-orange-400 to-red-500',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200'
      },
      CM1: {
        title: 'CM1 - Cours Moyen 1ère année',
        description: 'Développement des compétences',
        color: 'from-yellow-400 to-orange-500',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200'
      },
      CM2: {
        title: 'CM2 - Cours Moyen 2ème année',
        description: 'Préparation au collège',
        color: 'from-green-400 to-yellow-500',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      },
      '6eme': {
        title: '6ème - Cycle 3',
        description: 'Entrée au collège',
        color: 'from-blue-400 to-green-500',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      },
      '5eme': {
        title: '5ème - Cycle 4',
        description: 'Développement au collège',
        color: 'from-indigo-400 to-blue-500',
        bgColor: 'bg-indigo-50',
        borderColor: 'border-indigo-200'
      },
      '4eme': {
        title: '4ème - Cycle 4',
        description: 'Approfondissement',
        color: 'from-purple-400 to-indigo-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
      '3eme': {
        title: '3ème - Cycle 4',
        description: 'Préparation au lycée',
        color: 'from-pink-400 to-purple-500',
        bgColor: 'bg-pink-50',
        borderColor: 'border-pink-200'
      },
      '2nde': {
        title: '2nde - Seconde',
        description: 'Entrée au lycée',
        color: 'from-emerald-400 to-cyan-500',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200'
    },
      '1ere': {
        title: '1ère - Première',
        description: 'Spécialisation mathématiques',
        color: 'from-cyan-400 to-blue-500',
        bgColor: 'bg-cyan-50',
        borderColor: 'border-cyan-200'
    },
      terminale: {
        title: 'Terminale',
        description: 'Préparation au supérieur',
        color: 'from-slate-400 to-gray-600',
        bgColor: 'bg-slate-50',
        borderColor: 'border-slate-200'
    }
    };
    
    return classInfo[classLevel];
  };



  const isChapterAvailable = (chapterId: string) => {
    const availableChapters = ['equations-second-degre', 'exponentielle', 'nombres-derives', 'fonctions-references-derivees'];
    return availableChapters.includes(chapterId);
  };

  const getChapterXP = (chapterId: string) => {
    const xpMap: { [key: string]: string } = {
      'exponentielle': '150 XP',
      'nombres-derives': '220 XP',
      'fonctions-references-derivees': '200 XP'
    };
    return xpMap[chapterId] || '110 XP';
  };

  const getChapterSections = (chapterId: string) => {
    const sectionsMap: { [key: string]: string } = {
      'exponentielle': '6 sections progressives',
      'nombres-derives': '4 sections + techniques avancées',
      'fonctions-references-derivees': '3 sections + mémo'
    };
    return sectionsMap[chapterId] || '4 sections interactives';
  };

  const selectedClassInfo = getClassInfo(selectedClass);
  const selectedChapters = chaptersGroupedByClass[selectedClass] || [];

  return (
    <section id="chapitres" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16 px-4"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Tous les Chapitres
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
            Explore tous les concepts essentiels de mathématiques du CE1 à la terminale. 
            Chaque chapitre est conçu pour être interactif et amusant !
          </p>
        </motion.div>

        {/* Sélecteur de classe */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 px-4">
            {availableClassLevels.map((classLevel) => (
              <button
                key={classLevel}
                onClick={() => setSelectedClass(classLevel)}
                className={`px-4 py-3 sm:px-6 sm:py-3 rounded-full text-sm font-semibold transition-all duration-300 touch-manipulation min-h-[44px] flex items-center justify-center min-w-[60px] ${
                  selectedClass === classLevel
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-blue-300 hover:shadow-md active:bg-gray-50'
                }`}
              >
                {classLevel}
              </button>
            ))}
          </div>
        </div>

        {/* Affichage des chapitres de la classe sélectionnée */}
              <motion.div
          key={selectedClass}
                variants={containerVariants}
                initial="hidden"
          animate="visible"
                className="space-y-8"
              >
          <div className={`${selectedClassInfo.bgColor} ${selectedClassInfo.borderColor} border-2 rounded-3xl p-6`}>
                  <div className="text-center mb-8">
              <div className={`inline-flex items-center space-x-3 bg-gradient-to-r ${selectedClassInfo.color} text-white px-6 py-3 rounded-2xl mb-4`}>
                      <BookOpen className="h-6 w-6" />
                <h3 className="text-2xl font-bold">{selectedClassInfo.title}</h3>
              </div>
              <p className="text-gray-600 text-lg">{selectedClassInfo.description}</p>
              <div className="mt-4 text-sm text-gray-500">
                {selectedChapters.length} chapitre{selectedChapters.length > 1 ? 's' : ''} disponible{selectedChapters.length > 1 ? 's' : ''}
                    </div>
                  </div>

            {selectedChapters.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedChapters.map((chapter: Chapter) => {
                  const isAvailable = isChapterAvailable(chapter.id);
                  
                  if (isAvailable) {
                        return (
                                      <Link
              key={chapter.id}
              href={chapter.id === 'equations-second-degre' ? '/chapitre/equations-second-degre-overview' : `/chapitre/${chapter.id}`}
              className="block"
            >
                            <motion.div
                              variants={cardVariants}
                              className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 hover:border-gray-200 hover:shadow-2xl transition-all duration-500 group cursor-pointer hover:scale-110 hover:-translate-y-3 relative overflow-hidden"
                            >
                              {/* Badge vérifié */}
                              {chapter.verified && (
                                <div className="absolute top-2 right-2 z-20">
                                  <div className="flex items-center gap-1 px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
                                    <span>✓</span>
                                    <span>VÉRIFIÉ</span>
                                  </div>
                                </div>
                              )}
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                              <div className={`p-3 bg-gradient-to-r ${selectedClassInfo.color} rounded-xl text-white`}>
                                    <span className="text-2xl">{chapter.icon}</span>
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                                      {chapter.title}
                                    </h4>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                        {chapter.difficulty}
                                      </span>
                                      <div className="flex items-center text-green-600">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                                        <span className="text-xs font-medium">Disponible</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                <ArrowRight className="h-5 w-5 text-blue-500 group-hover:translate-x-1 transition-transform" />
                              </div>

                              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                {chapter.description}
                              </p>

                              <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                  <div className="flex items-center space-x-1 text-gray-500">
                                    <Clock className="h-4 w-4" />
                                    <span>{chapter.estimatedTime} min</span>
                                  </div>
                                  <div className="flex items-center space-x-1 text-gray-500">
                                    <Trophy className="h-4 w-4" />
                                <span>{getChapterXP(chapter.id)}</span>
                                  </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                  <div className="flex items-center space-x-3 text-sm text-gray-500">
                                    <div className="flex items-center gap-1">
                                      <Clock className="w-4 h-4" />
                                      <span className="font-medium">{chapter.estimatedTime}min</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <div className="w-4 h-4 text-yellow-500 animate-pulse">⭐</div>
                                      <span className="font-bold text-yellow-600">{getChapterXP(chapter.id)}</span>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-1 text-blue-600 group-hover:text-blue-700 transform group-hover:translate-x-1 transition-all duration-300">
                                    <div className="w-4 h-4">▶️</div>
                                    <span className="text-sm font-bold">Démarrer</span>
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </Link>
                        );
                      }

                  // Pour les chapitres non disponibles
                      return (
                        <motion.div
                          key={chapter.id}
                          variants={cardVariants}
                      className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200 opacity-75 cursor-not-allowed"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                          <div className={`p-3 bg-gradient-to-r from-gray-400 to-gray-500 rounded-xl text-white`}>
                                <span className="text-2xl">{chapter.icon}</span>
                              </div>
                              <div>
                            <h4 className="font-bold text-gray-900 text-lg">
                                  {chapter.title}
                                </h4>
                                <div className="flex items-center space-x-2 mt-1">
                              <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                                🔒 Bientôt disponible
                              </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {chapter.description}
                          </p>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center space-x-1 text-gray-500">
                                <Clock className="h-4 w-4" />
                                <span>{chapter.estimatedTime} min</span>
                              </div>
                              <div className="flex items-center space-x-1 text-gray-500">
                                <Trophy className="h-4 w-4" />
                            <span>100 XP</span>
                              </div>
                            </div>

                        <div className="bg-gradient-to-r from-gray-400 to-gray-500 text-white p-3 rounded-xl text-center">
                          <div className="font-bold text-sm">🔒 Bientôt disponible</div>
                          <div className="text-xs opacity-90">
                            En cours de développement...
                          </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-gray-400 text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Aucun chapitre pour cette classe
                </h3>
                <p className="text-gray-500">
                  Les chapitres pour cette classe sont en cours de développement.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
} 