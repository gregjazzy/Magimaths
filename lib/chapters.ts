import { Chapter } from '@/types';

export const chaptersData: Chapter[] = [
  // Algèbre (premier chapitre demandé)
  {
    id: 'equations-second-degre',
    title: 'Équations du second degré',
    description: 'Résolution d\'équations du second degré, discriminant, formes canonique et factorisée',
    category: 'algebra',
    difficulty: 'intermediate',
    estimatedTime: 120,
    prerequisites: [],
    color: '#8b5cf6',
    icon: '𝑥²',
    lessons: [],
    exercises: [],
    isLocked: false,
    order: 1
  },

  // Analyse
  {
    id: 'nombres-derives',
    title: 'Nombres dérivés',
    description: 'Introduction au concept de dérivée, calcul du nombre dérivé en un point',
    category: 'analysis',
    difficulty: 'intermediate',
    estimatedTime: 90,
    prerequisites: ['equations-second-degre'],
    color: '#06b6d4',
    icon: 'f\'',
    lessons: [],
    exercises: [],
    isLocked: false,
    order: 2
  },
  {
    id: 'fonctions-references-derivees',
    title: 'Fonctions de références et dérivées',
    description: 'Étude des fonctions de référence et calcul de leurs dérivées',
    category: 'analysis',
    difficulty: 'intermediate',
    estimatedTime: 100,
    prerequisites: ['nombres-derives'],
    color: '#06b6d4',
    icon: '∫',
    lessons: [],
    exercises: [],
    isLocked: false,
    order: 3
  },
  {
    id: 'fonctions-derivees',
    title: 'Fonctions dérivées',
    description: 'Calcul de dérivées, règles de dérivation, applications',
    category: 'analysis',
    difficulty: 'intermediate',
    estimatedTime: 110,
    prerequisites: ['fonctions-references-derivees'],
    color: '#06b6d4',
    icon: 'dy/dx',
    lessons: [],
    exercises: [],
    isLocked: false,
    order: 4
  },
  {
    id: 'exponentielle',
    title: 'Exponentielle',
    description: 'La fonction exponentielle, ses propriétés et applications',
    category: 'analysis',
    difficulty: 'advanced',
    estimatedTime: 95,
    prerequisites: ['fonctions-derivees'],
    color: '#06b6d4',
    icon: 'eˣ',
    lessons: [],
    exercises: [],
    isLocked: false,
    order: 5
  },
  {
    id: 'suites-arithmetiques-geometriques',
    title: 'Suites arithmétiques et géométriques et autres suites',
    description: 'Étude des suites arithmétiques, géométriques et autres types de suites',
    category: 'analysis',
    difficulty: 'intermediate',
    estimatedTime: 130,
    prerequisites: ['exponentielle'],
    color: '#06b6d4',
    icon: 'uₙ',
    lessons: [],
    exercises: [],
    isLocked: false,
    order: 6
  },
  {
    id: 'generation-suite',
    title: 'Génération d\'une suite',
    description: 'Modes de génération des suites, formules de récurrence',
    category: 'analysis',
    difficulty: 'intermediate',
    estimatedTime: 85,
    prerequisites: ['suites-arithmetiques-geometriques'],
    color: '#06b6d4',
    icon: 'uₙ₊₁',
    lessons: [],
    exercises: [],
    isLocked: false,
    order: 7
  },
  {
    id: 'somme-termes-suite',
    title: 'Somme des termes d\'une suite',
    description: 'Calcul de sommes de termes de suites arithmétiques et géométriques',
    category: 'analysis',
    difficulty: 'intermediate',
    estimatedTime: 75,
    prerequisites: ['generation-suite'],
    color: '#06b6d4',
    icon: 'Σ',
    lessons: [],
    exercises: [],
    isLocked: false,
    order: 8
  },
  {
    id: 'etude-suites',
    title: 'Étude de suites',
    description: 'Monotonie, convergence et limites de suites',
    category: 'analysis',
    difficulty: 'advanced',
    estimatedTime: 105,
    prerequisites: ['somme-termes-suite'],
    color: '#06b6d4',
    icon: 'lim',
    lessons: [],
    exercises: [],
    isLocked: false,
    order: 9
  },

  // Géométrie
  {
    id: 'trigonometrie',
    title: 'Trigonométrie',
    description: 'Cercle trigonométrique, fonctions sinus et cosinus, résolution d\'équations',
    category: 'geometry',
    difficulty: 'intermediate',
    estimatedTime: 115,
    prerequisites: ['equations-second-degre'],
    color: '#10b981',
    icon: 'sin θ',
    lessons: [],
    exercises: [],
    isLocked: false,
    order: 10
  },
  {
    id: 'produit-scalaire',
    title: 'Produit scalaire',
    description: 'Définition et propriétés du produit scalaire, applications géométriques',
    category: 'geometry',
    difficulty: 'intermediate',
    estimatedTime: 120,
    prerequisites: ['trigonometrie'],
    color: '#10b981',
    icon: 'u⃗·v⃗',
    lessons: [],
    exercises: [],
    isLocked: false,
    order: 11
  },
  {
    id: 'equation-cartesienne',
    title: 'Équation cartésienne',
    description: 'Équations de droites et cercles dans le plan cartésien',
    category: 'geometry',
    difficulty: 'intermediate',
    estimatedTime: 90,
    prerequisites: ['produit-scalaire'],
    color: '#10b981',
    icon: 'ax+by=c',
    lessons: [],
    exercises: [],
    isLocked: false,
    order: 12
  },

  // Statistiques et probabilités
  {
    id: 'probabilites-conditionnelles',
    title: 'Probabilités conditionnelles',
    description: 'Probabilités conditionnelles, formule de Bayes, arbres de probabilité',
    category: 'probability',
    difficulty: 'intermediate',
    estimatedTime: 100,
    prerequisites: ['equations-second-degre'],
    color: '#f59e0b',
    icon: 'P(A|B)',
    lessons: [],
    exercises: [],
    isLocked: false,
    order: 13
  },
  {
    id: 'probabilite-evenements-independants',
    title: 'Probabilité et événements indépendants',
    description: 'Événements indépendants, probabilités composées',
    category: 'probability',
    difficulty: 'intermediate',
    estimatedTime: 85,
    prerequisites: ['probabilites-conditionnelles'],
    color: '#f59e0b',
    icon: 'P(A∩B)',
    lessons: [],
    exercises: [],
    isLocked: false,
    order: 14
  },
  {
    id: 'probabilite-variables-aleatoires',
    title: 'Probabilité et variables aléatoires',
    description: 'Variables aléatoires discrètes, espérance, variance',
    category: 'probability',
    difficulty: 'advanced',
    estimatedTime: 110,
    prerequisites: ['probabilite-evenements-independants'],
    color: '#f59e0b',
    icon: 'E(X)',
    lessons: [],
    exercises: [],
    isLocked: false,
    order: 15
  }
];

// Helper pour obtenir les chapitres par catégorie
export const getChaptersByCategory = (category: string) => {
  return chaptersData.filter(chapter => chapter.category === category);
};

// Helper pour obtenir un chapitre par ID
export const getChapterById = (id: string) => {
  return chaptersData.find(chapter => chapter.id === id);
};

// Statistiques des chapitres par catégorie
export const chapterStats = {
  algebra: chaptersData.filter(c => c.category === 'algebra').length,
  analysis: chaptersData.filter(c => c.category === 'analysis').length,
  geometry: chaptersData.filter(c => c.category === 'geometry').length,
  probability: chaptersData.filter(c => c.category === 'probability').length,
  total: chaptersData.length
}; 