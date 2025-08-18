'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatNumber } from '../../hooks/useChapterColors';

interface ChapterCardBackupWithSamProps {
  chapter: {
    id: string;
    title: string;
    description: string;
    sections: Array<{ id: string; title: string; completed: boolean }>;
    color: string;
  };
}

export default function ChapterCardBackupWithSam({ chapter }: ChapterCardBackupWithSamProps) {
  const [xpData, setXpData] = useState({ xp: 0, maxXp: 1000 });

  useEffect(() => {
    // Charger les XP depuis localStorage (version simplifiée)
    try {
      const hierarchyData = JSON.parse(localStorage.getItem('xp-hierarchy') || '{}');
      const cpData = hierarchyData['cp'];
      
      if (cpData && cpData[chapter.id]) {
        const chapterData = cpData[chapter.id];
        
        if (typeof chapterData === 'object' && !chapterData.xp) {
          // Agrégation des sous-chapitres
          let totalXp = 0;
          Object.values(chapterData).forEach((subChapter: any) => {
            if (typeof subChapter === 'object' && subChapter.xp !== undefined) {
              totalXp += subChapter.xp || 0;
            }
          });
          setXpData({ xp: totalXp, maxXp: chapter.sections.length * 1000 });
        } else if (chapterData.xp !== undefined) {
          setXpData({ xp: chapterData.xp || 0, maxXp: chapterData.maxXp || 1000 });
        }
      }
    } catch (error) {
      // Garder les valeurs par défaut
    }
  }, [chapter.id, chapter.sections.length]);

  return (
    <Link 
      href={`/chapitre/${chapter.id}`}
      className="block group touch-manipulation"
    >
      <div className={`
        relative overflow-hidden bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-4 sm:p-5
        transition-all duration-500 hover:shadow-2xl transform hover:scale-105 hover:-translate-y-2
        hover:border-white/40 h-[280px] flex flex-col
        ${chapter.color === 'blue' ? 'hover:border-blue-300' : ''}
        ${chapter.color === 'green' ? 'hover:border-green-300' : ''}
        ${chapter.color === 'purple' ? 'hover:border-purple-300' : ''}
        ${chapter.color === 'red' ? 'hover:border-red-300' : ''}
        ${chapter.color === 'emerald' ? 'hover:border-emerald-300' : ''}
        ${chapter.color === 'cyan' ? 'hover:border-cyan-300' : ''}
        ${chapter.color === 'indigo' ? 'hover:border-indigo-300' : ''}
        ${chapter.color === 'yellow' ? 'hover:border-yellow-300' : ''}
      `}>
        
        {/* Bande colorée subtile en haut (comme l'original) */}
        <div className={`
          absolute top-0 left-0 right-0 h-1 rounded-t-2xl
          ${chapter.color === 'blue' ? 'bg-gradient-to-r from-blue-300 to-blue-400' : ''}
          ${chapter.color === 'green' ? 'bg-gradient-to-r from-green-300 to-green-400' : ''}
          ${chapter.color === 'purple' ? 'bg-gradient-to-r from-purple-300 to-purple-400' : ''}
          ${chapter.color === 'red' ? 'bg-gradient-to-r from-red-300 to-red-400' : ''}
          ${chapter.color === 'emerald' ? 'bg-gradient-to-r from-emerald-300 to-emerald-400' : ''}
          ${chapter.color === 'cyan' ? 'bg-gradient-to-r from-cyan-300 to-cyan-400' : ''}
          ${chapter.color === 'indigo' ? 'bg-gradient-to-r from-indigo-300 to-indigo-400' : ''}
          ${chapter.color === 'yellow' ? 'bg-gradient-to-r from-yellow-300 to-yellow-400' : ''}
        `} />
        
        {/* Effet de fond magique (comme l'original) */}
        <div className={`
          absolute inset-0 opacity-0 group-hover:opacity-15 transition-opacity duration-500
          ${chapter.color === 'blue' ? 'bg-gradient-to-br from-blue-100 to-blue-200' : ''}
          ${chapter.color === 'green' ? 'bg-gradient-to-br from-green-100 to-green-200' : ''}
          ${chapter.color === 'purple' ? 'bg-gradient-to-br from-purple-100 to-purple-200' : ''}
          ${chapter.color === 'red' ? 'bg-gradient-to-br from-red-100 to-red-200' : ''}
          ${chapter.color === 'emerald' ? 'bg-gradient-to-br from-emerald-100 to-emerald-200' : ''}
          ${chapter.color === 'cyan' ? 'bg-gradient-to-br from-cyan-100 to-cyan-200' : ''}
          ${chapter.color === 'indigo' ? 'bg-gradient-to-br from-indigo-100 to-indigo-200' : ''}
          ${chapter.color === 'yellow' ? 'bg-gradient-to-br from-yellow-100 to-yellow-200' : ''}
        `} />

        {/* Étoiles magiques (comme l'original) */}
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="text-lg sm:text-xl animate-spin">✨</div>
        </div>
        <div className="absolute bottom-2 sm:bottom-3 left-2 sm:left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{animationDelay: '0.2s'}}>
          <div className="text-sm sm:text-base animate-pulse">🌟</div>
        </div>

        <div className="relative z-10 flex flex-col h-full">
          {/* Header avec Sam + icône mathématique (comme l'original mais avec Sam) */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              {/* Photo de Sam le Pirate */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden shadow-md transform group-hover:scale-110 transition-all duration-300 opacity-90">
                <img
                  src="/images/pirate-small.png"
                  alt="Sam le Pirate"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback en cas d'erreur de chargement
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling!.classList.remove('hidden');
                  }}
                />
                {/* Fallback emoji */}
                <div className="hidden w-full h-full bg-gradient-to-br from-orange-300 to-orange-500 flex items-center justify-center text-xl">
                  🏴‍☠️
                </div>
              </div>
              
              {/* Icône mathématique (comme l'original) */}
              <div className={`
                w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl flex items-center justify-center text-2xl sm:text-3xl shadow-md
                transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300
                ${chapter.color === 'blue' ? 'bg-gradient-to-br from-blue-300 to-blue-500' : ''}
                ${chapter.color === 'green' ? 'bg-gradient-to-br from-green-300 to-green-500' : ''}
                ${chapter.color === 'purple' ? 'bg-gradient-to-br from-purple-300 to-purple-500' : ''}
                ${chapter.color === 'red' ? 'bg-gradient-to-br from-red-300 to-red-500' : ''}
                ${chapter.color === 'emerald' ? 'bg-gradient-to-br from-emerald-300 to-emerald-500' : ''}
                ${chapter.color === 'cyan' ? 'bg-gradient-to-br from-cyan-300 to-cyan-500' : ''}
                ${chapter.color === 'indigo' ? 'bg-gradient-to-br from-indigo-300 to-indigo-500' : ''}
                ${chapter.color === 'yellow' ? 'bg-gradient-to-br from-yellow-300 to-yellow-500' : ''}
              `}>
                {chapter.color === 'blue' && '🔢'}
                {chapter.color === 'green' && '💯'}
                {chapter.color === 'purple' && '➕'}
                {chapter.color === 'red' && '➖'}
                {chapter.color === 'emerald' && '✖️'}
                {chapter.color === 'cyan' && '🧠'}
                {chapter.color === 'indigo' && '📐'}
                {chapter.color === 'yellow' && '📏'}
              </div>
            </div>
            
            <div className={`
              px-2 sm:px-3 py-1 rounded-full text-xs font-semibold text-white shadow-sm
              ${chapter.color === 'blue' ? 'bg-blue-400' : ''}
              ${chapter.color === 'green' ? 'bg-green-400' : ''}
              ${chapter.color === 'purple' ? 'bg-purple-400' : ''}
              ${chapter.color === 'red' ? 'bg-red-400' : ''}
              ${chapter.color === 'emerald' ? 'bg-emerald-400' : ''}
              ${chapter.color === 'cyan' ? 'bg-cyan-400' : ''}
              ${chapter.color === 'indigo' ? 'bg-indigo-400' : ''}
              ${chapter.color === 'yellow' ? 'bg-yellow-400' : ''}
            `}>
              {chapter.sections.length} activités
            </div>
          </div>
          
          {/* Titre coloré (comme l'original) */}
          <h3 className="font-bold text-base sm:text-lg text-gray-800 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:to-orange-500 group-hover:bg-clip-text transition-all duration-300 leading-tight">
            {chapter.title}
          </h3>
          
          {/* Description (comme l'original) */}
          <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2 group-hover:text-gray-700 leading-relaxed flex-1">
            {chapter.description}
          </p>
          
          {/* Footer avec XP et bouton (comme l'original) */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
            <div className="flex items-center text-sm sm:text-base font-semibold">
              <span className="text-xl sm:text-2xl mr-1 sm:mr-2 animate-pulse">⭐</span>
              <span className="text-orange-500">{formatNumber(xpData.xp)} XP</span>
            </div>
            <div className={`
              flex items-center px-2 sm:px-3 py-1 sm:py-2 rounded-lg font-semibold text-white shadow-sm text-xs sm:text-sm
              transform group-hover:scale-105 group-hover:translate-x-1 transition-all duration-300
              min-h-[32px] sm:min-h-[36px] touch-manipulation
              ${chapter.color === 'blue' ? 'bg-gradient-to-r from-blue-400 to-blue-500' : ''}
              ${chapter.color === 'green' ? 'bg-gradient-to-r from-green-400 to-green-500' : ''}
              ${chapter.color === 'purple' ? 'bg-gradient-to-r from-purple-400 to-purple-500' : ''}
              ${chapter.color === 'red' ? 'bg-gradient-to-r from-red-400 to-red-500' : ''}
              ${chapter.color === 'emerald' ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' : ''}
              ${chapter.color === 'cyan' ? 'bg-gradient-to-r from-cyan-400 to-cyan-500' : ''}
              ${chapter.color === 'indigo' ? 'bg-gradient-to-r from-indigo-400 to-indigo-500' : ''}
              ${chapter.color === 'yellow' ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : ''}
            `}>
              <span className="mr-1">C'est parti !</span>
              <span className="text-sm sm:text-base">🚀</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
