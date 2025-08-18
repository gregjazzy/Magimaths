'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trophy, Star, Lock, CheckCircle } from 'lucide-react';
import { useChapterColors, formatNumber } from '../../hooks/useChapterColors';

interface ChapterCardPersonnageSquareProps {
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
}

interface XpData {
  xp: number;
  maxXp: number;
  completed?: boolean;
}

export default function ChapterCardPersonnageSquare({ config }: ChapterCardPersonnageSquareProps) {
  const [xpData, setXpData] = useState<XpData>({ xp: 0, maxXp: 1000 });
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  // 🎨 Utiliser le système de couleurs
  const colors = useChapterColors(config.level, config.id, config.color);

  // 📊 Lecture XP (logique simplifiée)
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

  // 🖼️ Sélection de l'image de fond selon le personnage
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
    
    // Sélection basée sur l'ID pour cohérence
    const index = config.id.length % characterImages.length;
    return characterImages[index];
  };

  const backgroundImage = getBackgroundImage();

  return (
    <Link 
      href={isUnlocked ? `/chapitre/${config.id}` : '#'}
      className={`block group ${!isUnlocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <div 
        className={`
          relative bg-gradient-to-br ${colors.bgGradient} rounded-2xl shadow-lg border border-white/50 p-4 w-48 h-48
          transition-all duration-300 transform will-change-transform overflow-hidden
          ${isUnlocked 
            ? 'hover:shadow-xl hover:scale-105 hover:-translate-y-2' 
            : 'opacity-60'
          }
        `}
        style={{
          backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
          backgroundSize: '120px',
          backgroundPosition: 'bottom right',
          backgroundRepeat: 'no-repeat'
        }}
      >
        
        {/* Overlay subtil pour l'image de fond */}
        {backgroundImage && (
          <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-white/80 to-white/90 rounded-2xl" />
        )}
        
        {/* Contenu principal */}
        <div className="relative z-10 h-full flex flex-col">
          
          {/* Header avec personnage */}
          <div className="flex items-center justify-between mb-3">
            {config.character && (
              <div className="flex-shrink-0">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${colors.characterBg} p-1 shadow-md relative`}>
                  {!imageError ? (
                    <img
                      src={config.character.image}
                      alt={`Personnage ${config.character.name}`}
                      className="w-full h-full object-cover rounded-full"
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-lg">
                      🏴‍☠️
                    </div>
                  )}
                  
                  {/* Badge de statut */}
                  <div className="absolute -top-1 -right-1">
                    {!isUnlocked ? (
                      <div className="w-4 h-4 bg-gray-400 rounded-full flex items-center justify-center">
                        <Lock className="w-2.5 h-2.5 text-white" />
                      </div>
                    ) : isCompleted ? (
                      <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-2.5 h-2.5 text-white" />
                      </div>
                    ) : isStarted ? (
                      <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                        <Star className="w-2.5 h-2.5 text-white" />
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            )}
            
            {/* Pourcentage */}
            <div className="text-right">
              <div className="text-lg font-bold text-gray-800">
                {Math.round(progressPercentage)}%
              </div>
            </div>
          </div>

          {/* Titre */}
          <div className="mb-3">
            <h3 className={`font-bold ${colors.textColor} text-base leading-tight`}>
              {config.title}
            </h3>
            <p className="text-xs text-gray-600 mt-1">
              {config.estimatedDuration} • {config.subChapters?.length || 1} partie{(config.subChapters?.length || 1) > 1 ? 's' : ''}
            </p>
          </div>

          {/* Expression du personnage */}
          {config.character?.expressions && isStarted && (
            <div className="mb-3 flex-1">
              <div className="bg-white/70 rounded-lg p-2 border border-white/50">
                <p className="text-xs text-gray-700 italic text-center">
                  💬 "{config.character.expressions[Math.floor(Math.random() * config.character.expressions.length)]}"
                </p>
              </div>
            </div>
          )}

          {/* Barre de progression avec mini-personnage */}
          <div className="mt-auto">
            <div className="mb-2">
              <div className="w-full bg-white/50 rounded-full h-3 overflow-hidden border border-white/30">
                <div 
                  className={`bg-gradient-to-r ${colors.progressColor} h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden`}
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse" />
                </div>
              </div>
              
              {/* Mini personnage sur la barre */}
              {config.character && progressPercentage > 8 && (
                <div 
                  className="relative -mt-1 transition-all duration-700 ease-out"
                  style={{ marginLeft: `calc(${Math.min(progressPercentage, 92)}% - 8px)` }}
                >
                  <div className="w-4 h-4 rounded-full bg-white shadow-md border border-gray-200 flex items-center justify-center overflow-hidden">
                    {!imageError ? (
                      <img
                        src={config.character.image}
                        alt=""
                        className="w-full h-full object-cover rounded-full"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div className="text-xs">🏴‍☠️</div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* XP */}
            <div className="text-center">
              <span className="text-xs font-semibold text-gray-700">
                {formatNumber(xpData.xp)} XP
              </span>
            </div>
          </div>
        </div>

        {/* Overlay verrouillé */}
        {!isUnlocked && (
          <div className="absolute inset-0 bg-gray-100/80 rounded-2xl flex items-center justify-center z-20">
            <div className="text-center">
              <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 font-medium">Verrouillé</p>
            </div>
          </div>
        )}

        {/* Effet de brillance */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none z-10" />
      </div>
    </Link>
  );
}

