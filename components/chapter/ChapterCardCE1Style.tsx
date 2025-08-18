'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Clock, Trophy, Play } from 'lucide-react';
import { formatNumber } from '../../hooks/useChapterColors';

interface ChapterCardCE1StyleProps {
  chapter: {
    id: string;
    title: string;
    description: string;
    sections: Array<{ id: string; title: string; completed: boolean }>;
    color: string;
  };
}

export default function ChapterCardCE1Style({ chapter }: ChapterCardCE1StyleProps) {
  const [xpData, setXpData] = useState({ xp: 0, maxXp: 1000 });

  useEffect(() => {
    // Charger les XP depuis localStorage
    try {
      const hierarchyData = JSON.parse(localStorage.getItem('xp-hierarchy') || '{}');
      const cpData = hierarchyData['cp'];
      
      if (cpData && cpData[chapter.id]) {
        const chapterData = cpData[chapter.id];
        
        if (typeof chapterData === 'object' && !chapterData.xp) {
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

  const getColorConfig = () => {
    const colors = {
      'blue': '#3b82f6',
      'green': '#10b981', 
      'purple': '#8b5cf6',
      'red': '#ef4444',
      'emerald': '#059669',
      'cyan': '#06b6d4',
      'indigo': '#6366f1',
      'yellow': '#eab308'
    };
    return colors[chapter.color as keyof typeof colors] || '#3b82f6';
  };

  const getMathIcon = () => {
    const icons = {
      'blue': '🔢',
      'green': '💯', 
      'purple': '➕',
      'red': '➖',
      'emerald': '✖️',
      'cyan': '🧠',
      'indigo': '📐',
      'yellow': '📏'
    };
    return icons[chapter.color as keyof typeof icons] || '🔢';
  };

  const colorConfig = getColorConfig();
  const mathIcon = getMathIcon();
  const totalXP = xpData.xp;

  return (
    <Link
      href={`/chapitre/${chapter.id}`}
      className="group block"
    >
      <div className="group relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20 hover:border-white/40 hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 overflow-hidden h-[280px] flex flex-col">
        
        {/* Barre colorée animée (comme CE1) */}
        <div 
          className="absolute top-0 left-0 right-0 h-1 transition-all duration-500 group-hover:h-2"
          style={{ background: `linear-gradient(90deg, ${colorConfig}, ${colorConfig}80, ${colorConfig}60)` }}
        />
        
        {/* Particules magiques (comme CE1) */}
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        </div>
        <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '0.3s'}}></div>
        </div>
        
        <div className="relative z-10 flex flex-col h-full">
          {/* Header avec icône mathématique (comme CE1) */}
          <div className="flex items-center space-x-4 mb-3">
            <div 
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-xl transform group-hover:scale-125 group-hover:rotate-6 transition-all duration-300"
              style={{ background: `linear-gradient(135deg, ${colorConfig}, ${colorConfig}AA, ${colorConfig}80)` }}
            >
              {mathIcon}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{chapter.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  Facile
                </span>
                <div className="flex items-center text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  <span className="text-xs font-medium">Disponible</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Description (comme CE1) */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-1">
            {chapter.description}
          </p>
          
          {/* Stats (comme CE1) */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-3 mt-auto">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{chapter.sections.length * 10} min</span>
            </div>
            <div className="flex items-center space-x-1">
              <Trophy className="w-4 h-4" />
              <span>{formatNumber(totalXP)} XP</span>
            </div>
          </div>
          
          {/* Bouton (comme CE1) */}
          <div className="w-full text-white py-3 px-4 rounded-xl font-bold text-center hover:opacity-90 transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
               style={{ background: `linear-gradient(90deg, ${colorConfig}, ${colorConfig}CC)` }}>
            <Play className="inline w-4 h-4 mr-2" />
            Commencer
          </div>
        </div>
      </div>
    </Link>
  );
}
