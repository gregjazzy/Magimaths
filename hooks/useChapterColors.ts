import { useMemo } from 'react';

// 🔧 Fonction pour formater les nombres de manière consistante
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

// 🎨 Couleurs par classe
const classColors = {
  'CP': { 
    primary: 'blue', 
    secondary: 'purple', 
    accent: 'pink',
    gradient: 'from-blue-400 via-purple-500 to-pink-500',
    bgGradient: 'from-blue-50 via-purple-50 to-pink-50',
    characterBg: 'from-blue-100 to-purple-100'
  },
  'CE1': { 
    primary: 'green', 
    secondary: 'emerald', 
    accent: 'teal',
    gradient: 'from-green-400 via-emerald-500 to-teal-500',
    bgGradient: 'from-green-50 via-emerald-50 to-teal-50',
    characterBg: 'from-green-100 to-emerald-100'
  },
  'CE2': { 
    primary: 'orange', 
    secondary: 'amber', 
    accent: 'yellow',
    gradient: 'from-orange-400 via-amber-500 to-yellow-500',
    bgGradient: 'from-orange-50 via-amber-50 to-yellow-50',
    characterBg: 'from-orange-100 to-amber-100'
  },
  'CM1': { 
    primary: 'indigo', 
    secondary: 'blue', 
    accent: 'cyan',
    gradient: 'from-indigo-400 via-blue-500 to-cyan-500',
    bgGradient: 'from-indigo-50 via-blue-50 to-cyan-50',
    characterBg: 'from-indigo-100 to-blue-100'
  },
  'CM2': { 
    primary: 'purple', 
    secondary: 'violet', 
    accent: 'fuchsia',
    gradient: 'from-purple-400 via-violet-500 to-fuchsia-500',
    bgGradient: 'from-purple-50 via-violet-50 to-fuchsia-50',
    characterBg: 'from-purple-100 to-violet-100'
  },
  '6eme': { 
    primary: 'red', 
    secondary: 'rose', 
    accent: 'pink',
    gradient: 'from-red-400 via-rose-500 to-pink-500',
    bgGradient: 'from-red-50 via-rose-50 to-pink-50',
    characterBg: 'from-red-100 to-rose-100'
  },
  '5eme': { 
    primary: 'teal', 
    secondary: 'cyan', 
    accent: 'sky',
    gradient: 'from-teal-400 via-cyan-500 to-sky-500',
    bgGradient: 'from-teal-50 via-cyan-50 to-sky-50',
    characterBg: 'from-teal-100 to-cyan-100'
  },
  '4eme': { 
    primary: 'violet', 
    secondary: 'purple', 
    accent: 'indigo',
    gradient: 'from-violet-400 via-purple-500 to-indigo-500',
    bgGradient: 'from-violet-50 via-purple-50 to-indigo-50',
    characterBg: 'from-violet-100 to-purple-100'
  },
  '3eme': { 
    primary: 'slate', 
    secondary: 'gray', 
    accent: 'zinc',
    gradient: 'from-slate-400 via-gray-500 to-zinc-500',
    bgGradient: 'from-slate-50 via-gray-50 to-zinc-50',
    characterBg: 'from-slate-100 to-gray-100'
  },
  '2nde': { 
    primary: 'emerald', 
    secondary: 'green', 
    accent: 'lime',
    gradient: 'from-emerald-400 via-green-500 to-lime-500',
    bgGradient: 'from-emerald-50 via-green-50 to-lime-50',
    characterBg: 'from-emerald-100 to-green-100'
  },
  '1ere': { 
    primary: 'amber', 
    secondary: 'yellow', 
    accent: 'orange',
    gradient: 'from-amber-400 via-yellow-500 to-orange-500',
    bgGradient: 'from-amber-50 via-yellow-50 to-orange-50',
    characterBg: 'from-amber-100 to-yellow-100'
  },
  'terminale': { 
    primary: 'rose', 
    secondary: 'pink', 
    accent: 'red',
    gradient: 'from-rose-400 via-pink-500 to-red-500',
    bgGradient: 'from-rose-50 via-pink-50 to-red-50',
    characterBg: 'from-rose-100 to-pink-100'
  }
};

// 🧮 Couleurs par matière/thème
const subjectColors = {
  // Mathématiques - Opérations
  'additions': { 
    color: 'blue', 
    gradient: 'from-blue-500 to-blue-600',
    icon: '➕',
    borderColor: 'border-blue-200 hover:border-blue-400'
  },
  'soustractions': { 
    color: 'red', 
    gradient: 'from-red-500 to-red-600',
    icon: '➖',
    borderColor: 'border-red-200 hover:border-red-400'
  },
  'multiplications': { 
    color: 'green', 
    gradient: 'from-green-500 to-green-600',
    icon: '✖️',
    borderColor: 'border-green-200 hover:border-green-400'
  },
  'divisions': { 
    color: 'purple', 
    gradient: 'from-purple-500 to-purple-600',
    icon: '➗',
    borderColor: 'border-purple-200 hover:border-purple-400'
  },
  
  // Mathématiques - Concepts
  'fractions': { 
    color: 'orange', 
    gradient: 'from-orange-500 to-orange-600',
    icon: '🍰',
    borderColor: 'border-orange-200 hover:border-orange-400'
  },
  'geometrie': { 
    color: 'yellow', 
    gradient: 'from-yellow-500 to-yellow-600',
    icon: '📐',
    borderColor: 'border-yellow-200 hover:border-yellow-400'
  },
  'mesures': { 
    color: 'cyan', 
    gradient: 'from-cyan-500 to-cyan-600',
    icon: '📏',
    borderColor: 'border-cyan-200 hover:border-cyan-400'
  },
  'calcul-mental': { 
    color: 'indigo', 
    gradient: 'from-indigo-500 to-indigo-600',
    icon: '🧠',
    borderColor: 'border-indigo-200 hover:border-indigo-400'
  },
  'nombres': { 
    color: 'teal', 
    gradient: 'from-teal-500 to-teal-600',
    icon: '🔢',
    borderColor: 'border-teal-200 hover:border-teal-400'
  },
  
  // Mathématiques avancées
  'equations': { 
    color: 'violet', 
    gradient: 'from-violet-500 to-violet-600',
    icon: '📊',
    borderColor: 'border-violet-200 hover:border-violet-400'
  },
  'fonctions': { 
    color: 'pink', 
    gradient: 'from-pink-500 to-pink-600',
    icon: '📈',
    borderColor: 'border-pink-200 hover:border-pink-400'
  },
  'pythagore': { 
    color: 'emerald', 
    gradient: 'from-emerald-500 to-emerald-600',
    icon: '📐',
    borderColor: 'border-emerald-200 hover:border-emerald-400'
  },
  'thales': { 
    color: 'lime', 
    gradient: 'from-lime-500 to-lime-600',
    icon: '📏',
    borderColor: 'border-lime-200 hover:border-lime-400'
  },
  'cosinus': { 
    color: 'sky', 
    gradient: 'from-sky-500 to-sky-600',
    icon: '📐',
    borderColor: 'border-sky-200 hover:border-sky-400'
  },
  'derives': { 
    color: 'rose', 
    gradient: 'from-rose-500 to-rose-600',
    icon: '📈',
    borderColor: 'border-rose-200 hover:border-rose-400'
  },
  
  // Autres matières
  'francais': { 
    color: 'rose', 
    gradient: 'from-rose-500 to-rose-600',
    icon: '📚',
    borderColor: 'border-rose-200 hover:border-rose-400'
  },
  'histoire': { 
    color: 'amber', 
    gradient: 'from-amber-500 to-amber-600',
    icon: '🏛️',
    borderColor: 'border-amber-200 hover:border-amber-400'
  },
  'geographie': { 
    color: 'teal', 
    gradient: 'from-teal-500 to-teal-600',
    icon: '🌍',
    borderColor: 'border-teal-200 hover:border-teal-400'
  },
  'sciences': { 
    color: 'lime', 
    gradient: 'from-lime-500 to-lime-600',
    icon: '🔬',
    borderColor: 'border-lime-200 hover:border-lime-400'
  }
};

// 🔍 Extraction du thème depuis l'ID du chapitre
const extractSubjectFromId = (chapterId: string): string | null => {
  const id = chapterId.toLowerCase();
  
  // Recherche par mots-clés dans l'ID
  for (const [subject, _] of Object.entries(subjectColors)) {
    if (id.includes(subject)) {
      return subject;
    }
  }
  
  // Recherche par patterns spécifiques
  if (id.includes('addition')) return 'additions';
  if (id.includes('soustraction')) return 'soustractions';
  if (id.includes('multiplication')) return 'multiplications';
  if (id.includes('division')) return 'divisions';
  if (id.includes('quatre-operations')) return 'calcul-mental';
  if (id.includes('grandeurs-mesures')) return 'mesures';
  
  return null;
};

// 🎨 Hook principal
export const useChapterColors = (
  level: string, 
  chapterId: string, 
  customColor?: string
) => {
  return useMemo(() => {
    const levelKey = level.toUpperCase() as keyof typeof classColors;
    const classColor = classColors[levelKey] || classColors['CP'];
    const subjectKey = extractSubjectFromId(chapterId);
    const subjectColor = subjectKey ? subjectColors[subjectKey as keyof typeof subjectColors] : null;
    
    // Si une couleur personnalisée est fournie
    if (customColor) {
      return {
        ...classColor,
        primary: customColor,
        gradient: `from-${customColor}-400 via-${customColor}-500 to-${customColor}-600`,
        progressColor: `from-${customColor}-500 to-${customColor}-600`,
        borderColor: `border-${customColor}-200 hover:border-${customColor}-400`,
        textColor: `text-${customColor}-700`,
        subject: subjectColor
      };
    }
    
    // Couleurs par défaut avec override du sujet si trouvé
    return {
      ...classColor,
      progressColor: subjectColor?.gradient || `from-${classColor.primary}-500 to-${classColor.secondary}-500`,
      borderColor: subjectColor?.borderColor || `border-${classColor.primary}-200 hover:border-${classColor.primary}-400`,
      textColor: `text-${classColor.primary}-700`,
      subject: subjectColor,
      // Gradient mixte classe + matière
      mixedGradient: subjectColor 
        ? `from-${classColor.primary}-400 via-${subjectColor.color}-500 to-${classColor.secondary}-500`
        : classColor.gradient
    };
  }, [level, chapterId, customColor]);
};

export default useChapterColors;
