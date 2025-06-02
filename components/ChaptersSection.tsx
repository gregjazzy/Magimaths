'use client';

import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Clock, Star, Trophy } from 'lucide-react';
import Link from 'next/link';
import { chaptersData } from '@/lib/chapters';
import { Chapter } from '@/types';

export default function ChaptersSection() {
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

  // Grouper les chapitres par catégorie
  const chaptersByCategory = chaptersData.reduce((acc: Record<string, Chapter[]>, chapter: Chapter) => {
    if (!acc[chapter.category]) {
      acc[chapter.category] = [];
    }
    acc[chapter.category].push(chapter);
    return acc;
  }, {});

  // Debug - ajouter un console.log
  console.log('Chapitres par catégorie:', chaptersByCategory);
  console.log('Chapitres algebra:', chaptersByCategory.algebra);

  const categoryInfo = {
    algebra: {
      title: 'Algèbre',
      description: 'Équations, inéquations et systèmes',
      color: 'from-purple-400 to-pink-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    analysis: {
      title: 'Analyse',
      description: 'Fonctions, dérivées et suites',
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    geometry: {
      title: 'Géométrie',
      description: 'Trigonométrie et produits scalaires',
      color: 'from-green-400 to-emerald-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    probability: {
      title: 'Statistiques & Probabilités',
      description: 'Probabilités et variables aléatoires',
      color: 'from-orange-400 to-yellow-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Débutant';
      case 'intermediate': return 'Intermédiaire';
      case 'advanced': return 'Avancé';
      default: return difficulty;
    }
  };

  return (
    <section id="chapitres" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Tous les Chapitres
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore tous les concepts essentiels de mathématiques première. 
            Chaque chapitre est conçu pour être interactif et amusant !
          </p>
        </motion.div>

        <div className="space-y-16">
          {Object.entries(chaptersByCategory).map(([category, categoryChapters]) => {
            const info = categoryInfo[category as keyof typeof categoryInfo];
            
            return (
              <motion.div
                key={category}
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div className={`${info.bgColor} ${info.borderColor} border-2 rounded-3xl p-6`}>
                  <div className="text-center mb-8">
                    <div className={`inline-flex items-center space-x-3 bg-gradient-to-r ${info.color} text-white px-6 py-3 rounded-2xl mb-4`}>
                      <BookOpen className="h-6 w-6" />
                      <h3 className="text-2xl font-bold">{info.title}</h3>
                    </div>
                    <p className="text-gray-600 text-lg">{info.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryChapters.map((chapter: Chapter, index: number) => {
                      // Créer le lien pour les chapitres disponibles
                      if (chapter.id === 'equations-second-degre' || chapter.id === 'exponentielle') {
                        return (
                          <Link 
                            key={chapter.id}
                            href={`/chapitre/${chapter.id}`}
                            className="block"
                          >
                            <motion.div
                              variants={cardVariants}
                              className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200 hover:shadow-xl transition-all duration-300 group cursor-pointer hover:scale-105"
                            >
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                  <div className={`p-3 bg-gradient-to-r ${info.color} rounded-xl text-white`}>
                                    <span className="text-2xl">{chapter.icon}</span>
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                                      {chapter.title}
                                    </h4>
                                    <div className="flex items-center space-x-2 mt-1">
                                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(chapter.difficulty)}`}>
                                        {getDifficultyLabel(chapter.difficulty)}
                                      </span>
                                      <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                        ✨ Disponible !
                                      </span>
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
                                    <span>{chapter.id === 'exponentielle' ? '150 XP' : '110 XP'}</span>
                                  </div>
                                </div>

                                <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-xl text-center">
                                  <div className="font-bold text-sm">🚀 Commencer maintenant !</div>
                                  <div className="text-xs opacity-90">
                                    {chapter.id === 'exponentielle' ? '6 sections progressives' : '4 sections interactives'}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          </Link>
                        );
                      }

                      // Pour les autres chapitres (non disponibles)
                      return (
                        <motion.div
                          key={chapter.id}
                          variants={cardVariants}
                          className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-200 hover:shadow-xl transition-all duration-300 group"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className={`p-3 bg-gradient-to-r ${info.color} rounded-xl text-white`}>
                                <span className="text-2xl">{chapter.icon}</span>
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
                                  {chapter.title}
                                </h4>
                                <div className="flex items-center space-x-2 mt-1">
                                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(chapter.difficulty)}`}>
                                    {getDifficultyLabel(chapter.difficulty)}
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
                                <span>110 XP</span>
                              </div>
                            </div>

                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`bg-gradient-to-r ${info.color} h-2 rounded-full`}
                                style={{ width: '0%' }}
                              />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex -space-x-2">
                                {[1, 2, 3].map((i) => (
                                  <div
                                    key={i}
                                    className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white flex items-center justify-center"
                                  >
                                    <span className="text-xs text-gray-600">👤</span>
                                  </div>
                                ))}
                              </div>
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                                Bientôt disponible
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Plus de chapitres arrivent !</h3>
            <p className="text-blue-100 mb-6">
              Nous ajoutons régulièrement de nouveaux chapitres interactifs. 
              Inscris-toi pour être notifié des nouveautés !
            </p>
            <button className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              Me tenir au courant
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 