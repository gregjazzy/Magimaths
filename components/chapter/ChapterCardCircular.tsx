'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trophy, Star, Lock, CheckCircle, Clock } from 'lucide-react';
import { useChapterColors, formatNumber } from '../../hooks/useChapterColors';

interface ChapterCardCircularProps {
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

export default function ChapterCardCircular({ config, transparencyLevel = 5 }: ChapterCardCircularProps) {
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

  // Calcul pour le cercle de progression SVG
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;

  return (
    <Link 
      href={isUnlocked ? `/chapitre/${config.id}` : '#'}
      className={`block group ${!isUnlocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <div 
        className={`
          relative bg-gradient-to-br ${colors.bgGradient} rounded-xl shadow-md border border-white/50 p-4 
          aspect-square w-full max-w-xs mx-auto
          transition-all duration-300 transform will-change-transform overflow-hidden
          ${isUnlocked 
            ? 'hover:shadow-lg hover:scale-[1.02] hover:-translate-y-1' 
            : 'opacity-60'
          }
        `}
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        
        {/* Overlay avec transparence */}
        {backgroundImage && (
          <div className={`absolute inset-0 bg-gradient-to-br ${overlayClass} rounded-xl`} />
        )}
        
        {/* Layout centré avec cercle de progression */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
          
          {/* Cercle de progression avec personnage au centre */}
          <div className="relative mb-4">
            {/* SVG Circle Progress */}
            <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
              {/* Cercle de fond */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-white/30"
              />
              {/* Cercle de progression */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className={`${colors.progressColor.replace('bg-gradient-to-r', 'text-blue-500')} transition-all duration-700 ease-out`}
              />
            </svg>
            
            {/* Personnage au centre du cercle */}
            {config.character && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${colors.characterBg} p-1 shadow-lg`}>
                    {!imageError ? (
                      <img
                        src={config.character.image}
                        alt={`Personnage ${config.character.name}`}
                        className="w-full h-full object-cover rounded-full"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-2xl">
                        🏴‍☠️
                      </div>
                    )}
                  </div>
                  
                  {/* Badge de statut */}
                  <div className="absolute -top-1 -right-1">
                    {!isUnlocked ? (
                      <div className="w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center">
                        <Lock className="w-3 h-3 text-white" />
                      </div>
                    ) : isCompleted ? (
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    ) : isStarted ? (
                      <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Star className="w-3 h-3 text-white" />
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            )}
            
            {/* Pourcentage au centre si pas de personnage */}
            {!config.character && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-800">
                    {Math.round(progressPercentage)}%
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Titre */}
          <h3 className={`font-bold ${colors.textColor} text-sm leading-tight mb-2`}>
            {config.title}
          </h3>

          {/* Statistiques */}
          <div className="space-y-1 text-xs text-gray-600">
            <div className="flex items-center justify-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{config.estimatedDuration}</span>
            </div>
            <div>
              {config.subChapters?.length || 1} partie{(config.subChapters?.length || 1) > 1 ? 's' : ''}
            </div>
            <div className="font-semibold">
              {formatNumber(xpData.xp)} XP
            </div>
          </div>

          {/* Expression du personnage */}
          {config.character?.expressions && isStarted && (
            <div className="mt-2">
              <p className="text-xs text-gray-600 italic">
                💬 "{config.character.expressions[Math.floor(Math.random() * config.character.expressions.length)]}"
              </p>
            </div>
          )}
        </div>

        {/* Overlay verrouillé */}
        {!isUnlocked && (
          <div className="absolute inset-0 bg-gray-100/80 rounded-xl flex items-center justify-center z-20">
            <div className="text-center">
              <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 font-medium">Verrouillé</p>
            </div>
          </div>
        )}

        {/* Effet de brillance */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl pointer-events-none z-10" />
      </div>
    </Link>
  );
}

