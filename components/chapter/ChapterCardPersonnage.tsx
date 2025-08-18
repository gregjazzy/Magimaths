'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trophy, Star, Lock, CheckCircle } from 'lucide-react';
import { formatNumber } from '../../hooks/useChapterColors';

interface ChapterCardPersonnageProps {
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

export default function ChapterCardPersonnage({ config }: ChapterCardPersonnageProps) {
  const [xpData, setXpData] = useState<XpData>({ xp: 0, maxXp: 1000 });
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  // 📊 Lecture XP (même logique)
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
        console.error('Erreur lecture XP:', error);
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

  // 🎨 Styles par niveau avec personnage
  const getLevelStyles = () => {
    switch (config.level) {
      case 'CP':
        return {
          gradient: 'from-blue-400 via-purple-500 to-pink-500',
          bgGradient: 'from-blue-50 to-purple-50',
          characterBg: 'from-blue-100 to-purple-100',
          progressColor: 'from-blue-500 to-purple-500'
        };
      case 'CE1':
        return {
          gradient: 'from-green-400 via-emerald-500 to-teal-500',
          bgGradient: 'from-green-50 to-emerald-50',
          characterBg: 'from-green-100 to-emerald-100',
          progressColor: 'from-green-500 to-emerald-500'
        };
      default:
        return {
          gradient: 'from-indigo-400 via-blue-500 to-cyan-500',
          bgGradient: 'from-indigo-50 to-blue-50',
          characterBg: 'from-indigo-100 to-blue-100',
          progressColor: 'from-indigo-500 to-blue-500'
        };
    }
  };

  const styles = getLevelStyles();

  return (
    <Link 
      href={isUnlocked ? `/chapitre/${config.id}` : '#'}
      className={`block group ${!isUnlocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <div className={`
        relative overflow-hidden bg-gradient-to-br ${styles.bgGradient} rounded-2xl shadow-lg border-2 border-white/50 p-6
        transition-all duration-300 transform will-change-transform
        ${isUnlocked 
          ? 'hover:shadow-2xl hover:scale-[1.03] hover:-translate-y-2' 
          : 'opacity-60'
        }
      `}>
        
        {/* Personnage en arrière-plan */}
        {config.character && (
          <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-30 transition-opacity duration-300">
            {!imageError ? (
              <img
                src={config.character.image}
                alt={`Personnage ${config.character.name}`}
                className="w-16 h-16 object-cover rounded-full"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
                🏴‍☠️
              </div>
            )}
          </div>
        )}

        {/* Badge de statut avec personnage */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {config.character && (
            <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${styles.characterBg} p-1 shadow-md`}>
              {!imageError ? (
                <img
                  src={config.character.image}
                  alt={`Personnage ${config.character.name}`}
                  className="w-full h-full object-cover rounded-full"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-xs">
                  🏴‍☠️
                </div>
              )}
            </div>
          )}
          
          {!isUnlocked ? (
            <Lock className="w-5 h-5 text-gray-400" />
          ) : isCompleted ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : isStarted ? (
            <Star className="w-5 h-5 text-yellow-500" />
          ) : null}
        </div>

        {/* Contenu principal */}
        <div className="relative z-10 mt-8">
          {/* Icône et titre */}
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${styles.gradient} text-white text-xl flex items-center justify-center shadow-lg`}>
              {config.icon || '📚'}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg leading-tight">
                {config.title}
              </h3>
              <p className="text-sm text-gray-600">
                {config.estimatedDuration} • {config.difficulty}
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-700 mb-4 line-clamp-2">
            {config.description}
          </p>

          {/* Expression du personnage */}
          {config.character?.expressions && isStarted && (
            <div className="bg-white/70 rounded-lg p-2 mb-4 border border-white/50">
              <p className="text-xs text-gray-700 italic">
                💬 "{config.character.expressions[Math.floor(Math.random() * config.character.expressions.length)]}"
              </p>
            </div>
          )}

          {/* Progression avec personnage */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">
                Progression
              </span>
              <span className="text-sm font-bold text-gray-900">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            
            <div className="relative">
              <div className="w-full bg-white/50 rounded-full h-3 overflow-hidden border border-white/30">
                <div 
                  className={`bg-gradient-to-r ${styles.progressColor} h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden`}
                  style={{ width: `${progressPercentage}%` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-pulse" />
                </div>
              </div>
              
              {/* Mini personnage sur la barre de progression */}
              {config.character && progressPercentage > 10 && (
                <div 
                  className="absolute top-0 w-3 h-3 rounded-full bg-white shadow-md border border-gray-200 transition-all duration-700 ease-out flex items-center justify-center"
                  style={{ left: `calc(${Math.min(progressPercentage, 95)}% - 6px)` }}
                >
                  <div className="w-2 h-2 rounded-full overflow-hidden">
                    {!imageError ? (
                      <img
                        src={config.character.image}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 text-xs flex items-center justify-center">
                        🏴‍☠️
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
                          <div className="flex justify-between text-xs text-gray-600">
                <span>XP: {formatNumber(xpData.xp)}</span>
                <span>Max: {formatNumber(xpData.maxXp)}</span>
              </div>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/30">
            <span className="text-xs text-gray-600">
              📚 {config.subChapters?.length || 1} partie{(config.subChapters?.length || 1) > 1 ? 's' : ''}
            </span>
            {isCompleted && (
              <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                <Trophy className="w-3 h-3" />
                Terminé !
              </div>
            )}
          </div>
        </div>

        {/* Overlay verrouillé */}
        {!isUnlocked && (
          <div className="absolute inset-0 bg-gray-100/80 rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 font-medium">Chapitre verrouillé</p>
            </div>
          </div>
        )}

        {/* Effet de brillance au hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
      </div>
    </Link>
  );
}
