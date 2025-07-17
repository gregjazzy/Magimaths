'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface SecondDegreeNavProps {
  currentChapter: string;
  xpEarned: number;
  completedSections: number;
  totalSections: number;
}

export default function SecondDegreeNav({ 
  currentChapter, 
  xpEarned, 
  completedSections, 
  totalSections 
}: SecondDegreeNavProps) {
  const chapters = [
    { id: 'introduction', title: 'Introduction', href: '/chapitre/equations-second-degre' },
    { id: 'forme-canonique', title: 'Forme canonique', href: '/chapitre/equations-second-degre-forme-canonique' },
    { id: 'variations', title: 'Variations', href: '/chapitre/equations-second-degre-variations' },
    { id: 'resolution', title: 'Résolution', href: '/chapitre/equations-second-degre-resolution' },
    { id: 'tableaux-signes', title: 'Tableaux signes', href: '/chapitre/equations-second-degre-tableaux-signes' },
    { id: 'parametres', title: 'Paramètres', href: '/chapitre/equations-second-degre-parametres' },
    { id: 'techniques-avancees', title: 'Techniques avancées', href: '/chapitre/equations-second-degre-techniques-avancees' },
    { id: 'equations-cube', title: 'Équations cube', href: '/chapitre/equations-second-degre-equations-cube' }
  ];

  const getChapterTitle = (chapterId: string) => {
    switch (chapterId) {
      case 'introduction': return 'Introduction aux équations du second degré';
      case 'forme-canonique': return 'Forme canonique';
      case 'variations': return 'Étude des variations';
      case 'resolution': return 'Résolution d\'équations';
      case 'tableaux-signes': return 'Tableaux de signes';
      case 'parametres': return 'Équations avec paramètres';
      case 'techniques-avancees': return 'Techniques avancées';
      case 'equations-cube': return 'Équations du cube';
      default: return 'Équations du Second Degré';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 py-2">
        {/* Titre et infos sur une ligne compacte */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Retour</span>
            </Link>
            <div className="h-4 w-px bg-gray-300" />
            <h1 className="text-base font-bold text-gray-900">{getChapterTitle(currentChapter)}</h1>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <span className="bg-green-100 px-2 py-1 rounded text-green-700">{xpEarned} XP</span>
              <span className="bg-blue-100 px-2 py-1 rounded text-blue-700">{completedSections}/{totalSections}</span>
            </div>
          </div>
        </div>
        
        {/* Navigation compacte */}
        <div className="grid grid-cols-4 gap-1">
          {chapters.slice(0, 4).map((chapter) => (
            <Link
              key={chapter.id}
              href={chapter.href}
              className={`flex items-center justify-center px-2 py-1.5 rounded text-xs font-medium transition-colors text-center ${
                currentChapter === chapter.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {chapter.title}
            </Link>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-1 mt-1">
          {chapters.slice(4).map((chapter) => (
            <Link
              key={chapter.id}
              href={chapter.href}
              className={`flex items-center justify-center px-2 py-1.5 rounded text-xs font-medium transition-colors text-center ${
                currentChapter === chapter.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {chapter.title}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
} 