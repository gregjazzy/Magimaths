'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trophy, Star, Lock, CheckCircle } from 'lucide-react';
import { useChapterColors, formatNumber } from '../../hooks/useChapterColors';

interface ChapterCardMiniProps {
  config: {
    id: string;
    title: string;
    description: string;
    level: 'CP' | 'CE1' | 'CE2' | 'CM1' | 'CM2' | '6eme' | '5eme' | '4eme' | '3eme' | '2nde' | '1ere' | 'terminale';
    color?: string;
    icon?: string;
    estimatedDuration?: string;
    difficulty?: 'Facile' | 'Moyen' | 'Difficile';
    subChapters?: string[];
    isLocked?: boolean;
    character?: {
      name: string;
      image: string;
      expressions?: string[];
    };
  };
  transparencyLevel?: number; // 1-10
}

interface XpData {
  xp: number;
  maxXp: number;
  completed?: boolean;
}

export default function ChapterCardMini({ config, transparencyLevel = 5 }: ChapterCardMiniProps) {
  const [xpData, setXpData] = useState<XpData>({ xp: 0, maxXp: 1000 });
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  const colors = useChapterColors(config.level, config.id, config.color);

  useEffect(() => {
    const loadXpData = () => {
      try {
        const hierarchyData = JSON.parse(localStorage.getItem('xp-hierarchy') || '{}');
        const levelData = hierarchyData[config.level.toLowerCase()];
        
        if (levelData && levelData[config.id]) {
          const chapterData = levelData[config.id];
          
          if (typeof chapterData === 'object' && !chapterData.xp) {
            let totalXp = 0;
            let totalMaxXp = 0;
            let allCompleted = true;
            
            Object.values(chapterData).forEach((subChapter: any) => {
              if (typeof subChapter === 'object' && subChapter.xp !== undefined) {
                totalXp += subChapter.xp || 0;
                totalMaxXp += subChapter.maxXp || 1000;
                if (!subChapter.completed) allCompleted = false;
              }
            });
            
            setXpData({
              xp: totalXp,
              maxXp: totalMaxXp || (config.subChapters?.length || 1) * 1000,
              completed: allCompleted && totalXp > 0
            });
          } else if (chapterData.xp !== undefined) {
            setXpData({
              xp: chapterData.xp || 0,
              maxXp: chapterData.maxXp || 1000,
              completed: chapterData.completed || false
            });
          } else {
            setXpData({
              xp: 0,
              maxXp: (config.subChapters?.length || 1) * 1000,
              completed: false
            });
          }
        } else {
          setXpData({
            xp: 0,
            maxXp: (config.subChapters?.length || 1) * 1000,
            completed: false
          });
        }
      } catch (error) {
        setXpData({
          xp: 0,
          maxXp: (config.subChapters?.length || 1) * 1000,
          completed: false
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadXpData();
  }, [config.id, config.level, config.subChapters]);

  const progressPercentage = xpData.maxXp > 0 ? (xpData.xp / xpData.maxXp) * 100 : 0;
  const isStarted = xpData.xp > 0;
  const isCompleted = xpData.completed || progressPercentage === 100;
  const isUnlocked = !config.isLocked;

  const getBackgroundImage = () => {
    if (!config.character) return null;
    
    const images = {
      'sam-pirate': [
        '/image/carte.png',
        '/image/boussole.png', 
        '/image/tresor.png',
        '/image/bateau.png'
      ],
      'minecraft': [
        '/image/blocminecraft.png',
        '/image/motifminecraft.png',
        '/image/paysageminecraft.png',
        '/image/jeuminecraft.png'
      ]
    };
    
    const characterImages = images[config.character.name as keyof typeof images];
    if (!characterImages) return null;
    
    const index = config.id.length % characterImages.length;
    return characterImages[index];
  };

  const getTransparencyOverlay = () => {
    const overlays = {
      1: 'from-white/95 via-white/90 to-white/85',
      2: 'from-white/90 via-white/85 to-white/75',
      3: 'from-white/85 via-white/75 to-white/65',
      4: 'from-white/80 via-white/70 to-white/55',
      5: 'from-white/75 via-white/65 to-white/45',
      6: 'from-white/70 via-white/55 to-white/35',
      7: 'from-white/65 via-white/45 to-white/25',
      8: 'from-white/55 via-white/35 to-white/15',
      9: 'from-white/45 via-white/25 to-white/10',
      10: 'from-white/35 via-white/15 to-white/5'
    };
    
    return overlays[transparencyLevel as keyof typeof overlays] || overlays[5];
  };

  const backgroundImage = getBackgroundImage();
  const overlayClass = getTransparencyOverlay();

  return (
    <Link 
      href={isUnlocked ? `/chapitre/${config.id}` : '#'}
      className={`block group ${!isUnlocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <div 
        className={`
          relative bg-gradient-to-r ${colors.bgGradient} rounded-lg shadow-sm border border-white/50 p-3 h-16
          transition-all duration-300 transform will-change-transform overflow-hidden
          ${isUnlocked 
            ? 'hover:shadow-md hover:scale-[1.01]' 
            : 'opacity-60'
          }
        `}
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'right center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        
        {/* Overlay avec transparence */}
        {backgroundImage && (
          <div className={`absolute inset-0 bg-gradient-to-r ${overlayClass} rounded-lg`} />
        )}
        
        {/* Layout compact horizontal */}
        <div className="relative z-10 flex items-center h-full gap-3">
          
          {/* Personnage mini */}
          {config.character && (
            <div className="flex-shrink-0 relative">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${colors.characterBg} p-0.5 shadow-sm`}>
                {!imageError ? (
                  <img
                    src={config.character.image}
                    alt={`Personnage ${config.character.name}`}
                    className="w-full h-full object-cover rounded-full"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-sm">
                    🏴‍☠️
                  </div>
                )}
              </div>
              
              {/* Badge de statut mini */}
              <div className="absolute -top-0.5 -right-0.5">
                {!isUnlocked ? (
                  <div className="w-3 h-3 bg-gray-400 rounded-full flex items-center justify-center">
                    <Lock className="w-2 h-2 text-white" />
                  </div>
                ) : isCompleted ? (
                  <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-2 h-2 text-white" />
                  </div>
                ) : isStarted ? (
                  <div className="w-3 h-3 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Star className="w-2 h-2 text-white" />
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* Contenu principal */}
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold ${colors.textColor} text-sm leading-tight truncate mb-1`}>
              {config.title}
            </h3>
            
            {/* Barre de progression mini */}
            <div className="relative">
              <div className="w-full bg-white/50 rounded-full h-1.5 overflow-hidden border border-white/30">
                <div 
                  className={`bg-gradient-to-r ${colors.progressColor} h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden`}
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* XP et pourcentage */}
          <div className="text-right flex-shrink-0">
            <div className="text-xs font-bold text-gray-800">
              {Math.round(progressPercentage)}%
            </div>
            <div className="text-xs text-gray-600">
              {formatNumber(xpData.xp)}
            </div>
          </div>
        </div>

        {/* Overlay verrouillé */}
        {!isUnlocked && (
          <div className="absolute inset-0 bg-gray-100/80 rounded-lg flex items-center justify-center z-20">
            <Lock className="w-4 h-4 text-gray-400" />
          </div>
        )}

        {/* Effet de brillance */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none z-10" />
      </div>
    </Link>
  );
}

