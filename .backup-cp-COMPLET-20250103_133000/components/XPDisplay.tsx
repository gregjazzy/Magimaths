'use client';

import { Zap } from 'lucide-react';

interface XPDisplayProps {
  totalXP: number;
  level: number;
  currentLevelXP: number;
  nextLevelXP: number;
  showAnimation?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export default function XPDisplay({ 
  totalXP, 
  level, 
  currentLevelXP, 
  nextLevelXP,
  showAnimation = false,
  size = 'medium'
}: XPDisplayProps) {
  const progress = (currentLevelXP / nextLevelXP) * 100;
  
  const sizeClasses = {
    small: {
      container: 'px-3 py-2',
      text: 'text-sm',
      bar: 'h-2',
      icon: 'h-4 w-4'
    },
    medium: {
      container: 'px-4 py-3',
      text: 'text-base',
      bar: 'h-3',
      icon: 'h-5 w-5'
    },
    large: {
      container: 'px-6 py-4',
      text: 'text-lg',
      bar: 'h-4',
      icon: 'h-6 w-6'
    }
  };

  const classes = sizeClasses[size];

  return (
    <motion.div
      initial={showAnimation ? { scale: 0.8, opacity: 0 } : {}}
      animate={{ scale: 1, opacity: 1 }}
      className={`bg-white rounded-2xl shadow-lg border-2 border-purple-200 ${classes.container}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
            <Zap className={`${classes.icon} text-white`} />
          </div>
          <div>
            <div className={`font-bold text-gray-900 ${classes.text}`}>
              Niveau {level}
            </div>
            <div className="text-xs text-gray-600">
              {totalXP.toLocaleString()} XP total
            </div>
          </div>
        </div>
        
        {showAnimation && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="text-2xl"
          >
            🎉
          </motion.div>
        )}
      </div>

      {/* Barre de progression */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-gray-600">
          <span>{currentLevelXP} XP</span>
          <span>{nextLevelXP} XP</span>
        </div>
        
        <div className={`bg-gray-200 rounded-full overflow-hidden ${classes.bar}`}>
          <motion.div
            className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full h-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        
        <div className="text-center text-xs text-gray-500">
          {Math.round(progress)}% vers niveau {level + 1}
        </div>
      </div>
    </motion.div>
  );
} 