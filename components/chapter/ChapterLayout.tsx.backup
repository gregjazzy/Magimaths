'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Trophy } from 'lucide-react';
import Link from 'next/link';

interface ChapterLayoutProps {
  chapterId: string;
  title: string;
  overviewUrl: string;
  xpTotal: number;
  children: React.ReactNode;
  bgGradient?: string;
}

export default function ChapterLayout({
  chapterId,
  title,
  overviewUrl,
  xpTotal,
  children,
  bgGradient = "from-blue-50 via-purple-50 to-pink-50"
}: ChapterLayoutProps) {
  const [xpEarned, setXpEarned] = useState(0);
  const [completedSections, setCompletedSections] = useState<string[]>([]);

  // Logique commune sauvegardée dans localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem(`chapter_${chapterId}`);
    if (savedProgress) {
      const { xp, sections } = JSON.parse(savedProgress);
      setXpEarned(xp);
      setCompletedSections(sections);
    }
  }, [chapterId]);

  const handleSectionComplete = (sectionId: string, xp: number) => {
    if (!completedSections.includes(sectionId)) {
      const newSections = [...completedSections, sectionId];
      const newXp = xpEarned + xp;
      
      setCompletedSections(newSections);
      setXpEarned(newXp);
      
      // Sauvegarde automatique
      localStorage.setItem(`chapter_${chapterId}`, JSON.stringify({
        xp: newXp,
        sections: newSections
      }));
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgGradient}`}>
      {/* Header uniforme */}
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link 
            href={overviewUrl} 
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Retour</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-white rounded-full px-4 py-2 shadow-sm">
              <Trophy className="h-4 w-4 text-yellow-500" />
              <span className="font-bold text-gray-900">
                {xpEarned} / {xpTotal} XP
              </span>
            </div>
            
            <div className="text-sm text-gray-600">
              {completedSections.length} sections terminées
            </div>
          </div>
        </div>
      </div>

      {/* Contenu du chapitre */}
      <div className="max-w-6xl mx-auto p-6">
        {/* Passer les handlers via Context */}
        <ChapterContext.Provider value={{
          xpEarned,
          completedSections,
          handleSectionComplete
        }}>
          {children}
        </ChapterContext.Provider>
      </div>
    </div>
  );
}

// Context pour éviter le prop drilling
import { createContext, useContext } from 'react';

interface ChapterContextType {
  xpEarned: number;
  completedSections: string[];
  handleSectionComplete: (sectionId: string, xp: number) => void;
}

const ChapterContext = createContext<ChapterContextType | null>(null);

export const useChapterContext = () => {
  const context = useContext(ChapterContext);
  if (!context) {
    throw new Error('useChapterContext must be used within ChapterLayout');
  }
  return context;
}; 