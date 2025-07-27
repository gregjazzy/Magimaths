'use client';

import { motion } from 'framer-motion';
import { Target, Clock, Flame, Check } from 'lucide-react';

interface DailyGoalProps {
  todayXP: number;
  dailyGoal: number;
  currentStreak: number;
  studyTimeToday: number; // en minutes
  size?: 'small' | 'medium';
}

export default function DailyGoal({ 
  todayXP, 
  dailyGoal, 
  currentStreak,
  studyTimeToday,
  size = 'medium' 
}: DailyGoalProps) {
  const progress = Math.min((todayXP / dailyGoal) * 100, 100);
  const isCompleted = todayXP >= dailyGoal;
  const remainingXP = Math.max(dailyGoal - todayXP, 0);
  const estimatedMinutes = Math.ceil(remainingXP / 5); // ~5 XP par minute
  
  const motivationalMessages = [
    "Pour devenir excellent",
    "Objectif du champion",
    "Vers l'excellence",
    "Défi quotidien"
  ];
  
  const message = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-4 border-2 border-blue-200 ${
        size === 'small' ? 'text-sm' : ''
      }`}
    >
      {/* Header avec objectif */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={`p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg`}>
            <Target className={`${size === 'small' ? 'h-4 w-4' : 'h-5 w-5'} text-white`} />
          </div>
          <div>
            <div className={`font-bold text-gray-900 ${size === 'small' ? 'text-sm' : 'text-base'}`}>
              {message}
            </div>
            <div className={`text-gray-600 ${size === 'small' ? 'text-xs' : 'text-sm'}`}>
              {dailyGoal} XP/jour • 5j/semaine
            </div>
          </div>
        </div>
        
        {/* Streak */}
        <div className="flex items-center space-x-1 bg-orange-100 px-2 py-1 rounded-full">
          <Flame className="h-4 w-4 text-orange-500" />
          <span className="text-xs font-bold text-orange-600">{currentStreak}</span>
        </div>
      </div>

      {/* Progression du jour */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className={`font-semibold ${size === 'small' ? 'text-sm' : 'text-base'}`}>
            Aujourd'hui : {todayXP} / {dailyGoal} XP
          </span>
          {isCompleted && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="flex items-center space-x-1 text-green-600"
            >
              <Check className="h-4 w-4" />
              <span className="text-xs font-bold">Objectif atteint !</span>
            </motion.div>
          )}
        </div>
        
        {/* Barre de progression */}
        <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${
              isCompleted 
                ? 'bg-gradient-to-r from-green-400 to-green-500' 
                : 'bg-gradient-to-r from-blue-400 to-purple-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
        
        {/* Stats et encouragements */}
        <div className="flex justify-between items-center pt-2">
          <div className="flex items-center space-x-1 text-gray-600">
            <Clock className="h-3 w-3" />
            <span className="text-xs">
              {studyTimeToday}min aujourd'hui
            </span>
          </div>
          
          {!isCompleted && (
            <div className="text-xs text-gray-600">
              Plus que <span className="font-semibold text-blue-600">{remainingXP} XP</span>
              <span className="ml-1">≈ {estimatedMinutes}min</span>
            </div>
          )}
        </div>
        
        {/* Message motivationnel */}
        <div className="bg-white/50 rounded-lg p-2 mt-2">
          <div className="text-xs text-gray-700 text-center">
            {isCompleted ? (
              <span className="text-green-600 font-semibold">
                🎉 Bravo ! Tu es sur la voie de l'excellence !
              </span>
            ) : (
              <span>
                💪 <strong>{dailyGoal} XP/jour</strong> = <strong>≈ 30min d'étude</strong> = Futur champion !
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
} 