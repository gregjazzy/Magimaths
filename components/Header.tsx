'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Menu, X, Zap, Target } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import UserMenu from '@/components/auth/UserMenu';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  
  // Mock data pour l'exemple - à connecter avec le système XP plus tard
  const userXP = {
    totalXP: 1250,
    level: 8,
    currentLevelXP: 250,
    nextLevelXP: 500
  };
  const dailyStats = {
    todayXP: 80,
    dailyGoal: 150,
    currentStreak: 7,
    studyTimeToday: 25
  };

  const navItems = [
    { name: 'Accueil', href: '#accueil' },
    { name: 'Chapitres', href: '#chapitres' },
    { name: 'Tarifs', href: '#tarifs' },
    { name: 'À propos', href: '#apropos' },
  ];

  const progress = (userXP.currentLevelXP / userXP.nextLevelXP) * 100;
  const dailyProgress = Math.min((dailyStats.todayXP / dailyStats.dailyGoal) * 100, 100);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2"
          >
            <div className="p-2 bg-gradient-to-r from-primary-500 to-purple-600 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">MathPremière</span>
          </motion.div>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200 relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-200 group-hover:w-full"></span>
              </motion.a>
            ))}
          </nav>

          {/* Zone utilisateur connecté ou boutons auth */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* XP Compact - Desktop uniquement */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="hidden lg:flex items-center space-x-3"
                >
                  {/* XP Compact */}
                  <div className="flex items-center space-x-2 bg-purple-50 px-3 py-2 rounded-xl border border-purple-200">
                    <div className="p-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-md">
                      <Zap className="h-3 w-3 text-white" />
                    </div>
                    <div className="text-xs">
                      <div className="font-bold text-gray-900">Niv. {userXP.level}</div>
                      <div className="w-16 bg-gray-200 rounded-full h-1">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-1 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Objectif Compact */}
                  <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-xl border border-blue-200">
                    <div className="p-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md">
                      <Target className="h-3 w-3 text-white" />
                    </div>
                    <div className="text-xs">
                      <div className="font-bold text-gray-900">{dailyStats.todayXP}/{dailyStats.dailyGoal} XP</div>
                      <div className="w-16 bg-gray-200 rounded-full h-1">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-1 rounded-full transition-all duration-300"
                          style={{ width: `${dailyProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Menu utilisateur */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <UserMenu />
                </motion.div>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <UserMenu />
              </motion.div>
            )}
          </div>

          {/* Bouton menu mobile */}
          <button
            className="md:hidden p-2 text-gray-700 hover:text-primary-600 transition-colors ml-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Menu mobile */}
        <motion.div
          initial={false}
          animate={{
            height: isMobileMenuOpen ? 'auto' : 0,
            opacity: isMobileMenuOpen ? 1 : 0,
          }}
          className="md:hidden overflow-hidden"
        >
          <div className="py-4 space-y-4">
            {/* Stats mobiles pour utilisateur connecté */}
            {user && (
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-purple-50 p-3 rounded-xl border border-purple-200">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-bold">Niveau {userXP.level}</span>
                  </div>
                  <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                
                <div className="bg-blue-50 p-3 rounded-xl border border-blue-200">
                  <div className="flex items-center space-x-2">
                    <Target className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-bold">{dailyStats.todayXP}/{dailyStats.dailyGoal} XP</span>
                  </div>
                  <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      style={{ width: `${dailyProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block text-gray-700 hover:text-primary-600 font-medium transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </header>
  );
} 