'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Play, Star, Users, BookOpen, Trophy, Zap, Brain } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/auth/AuthModal';

export default function Hero() {
  const [currentFormula, setCurrentFormula] = useState(0);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();

  const funFormulas = [
    { formula: "∫ f(x)dx", color: "#06b6d4", emoji: "🌊" },
    { formula: "sin(θ) = fun!", color: "#10b981", emoji: "🎡" },
    { formula: "f'(x) → ∞", color: "#8b5cf6", emoji: "🚀" },
    { formula: "P(réussite) = 1", color: "#f59e0b", emoji: "🎯" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFormula((prev) => (prev + 1) % funFormulas.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { icon: Users, label: 'Élèves heureux', value: '2,500+', color: 'text-blue-600' },
    { icon: Brain, label: 'Concepts maîtrisés', value: '150+', color: 'text-purple-600' },
    { icon: Trophy, label: 'Défis relevés', value: '500+', color: 'text-green-600' },
    { icon: Star, label: 'Note de plaisir', value: '4.9/5', color: 'text-yellow-600' },
  ];

  const handleGetStarted = () => {
    if (user) {
      // Rediriger vers les chapitres si déjà connecté
      window.location.href = '#chapitres';
    } else {
      // Ouvrir le modal d'inscription
      setShowAuthModal(true);
    }
  };

  return (
    <>
      <section id="accueil" className="pt-16 pb-20 overflow-hidden relative">
        {/* Background fun */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 text-6xl animate-bounce">📐</div>
          <div className="absolute top-40 right-20 text-4xl animate-pulse">📊</div>
          <div className="absolute bottom-40 left-20 text-5xl animate-bounce" style={{animationDelay: '1s'}}>🧮</div>
          <div className="absolute bottom-20 right-10 text-3xl animate-pulse" style={{animationDelay: '2s'}}>🎯</div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            {/* Contenu principal */}
            <div className="lg:col-span-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Titre fun */}
                <div className="space-y-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.8 }}
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full px-6 py-3 text-lg font-medium"
                  >
                    <Zap className="h-5 w-5" />
                    <span>Apprendre en s'amusant</span>
                    <span className="animate-bounce">🚀</span>
                  </motion.div>
                  
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl lg:text-7xl font-black text-gray-900 leading-tight"
                  >
                    Les <span className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent animate-gradient">maths</span>
                    <br />
                    comme jamais ! 
                    <motion.span
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="inline-block ml-4"
                    >
                      🎉
                    </motion.span>
                  </motion.h1>
                </div>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl lg:text-2xl text-gray-600 leading-relaxed"
                >
                  Fini l'ennui ! Découvre les maths de première avec des animations, 
                  des défis et une vraie compréhension. 
                  <span className="font-semibold text-purple-600">C'est parti !</span>
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col sm:flex-row gap-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleGetStarted}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg sm:text-xl font-bold px-6 py-4 sm:px-8 sm:py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group touch-manipulation min-h-[44px] w-full sm:w-auto"
                  >
                    {user ? 'Voir mes chapitres' : 'Commencer l\'aventure'}
                    <ArrowRight className="ml-3 h-5 w-5 sm:h-6 sm:w-6 transition-transform group-hover:translate-x-1" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center justify-center space-x-3 px-6 py-4 sm:px-8 sm:py-4 text-gray-700 hover:text-purple-600 font-bold text-lg sm:text-xl transition-colors border-2 border-gray-300 hover:border-purple-300 rounded-2xl touch-manipulation min-h-[44px] w-full sm:w-auto"
                  >
                    <Play className="h-5 w-5 sm:h-6 sm:w-6" />
                    <span>Voir la magie</span>
                  </motion.button>
                </motion.div>

                {/* Statistiques fun */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-8"
                >
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1 + index * 0.1 }}
                      whileHover={{ scale: 1.1 }}
                      className="text-center p-4 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      <div className="flex justify-center mb-3">
                        <div className={`p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl`}>
                          <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                      </div>
                      <div className="text-2xl font-black text-gray-900">{stat.value}</div>
                      <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>

            {/* Illustration fun et interactive */}
            <div className="lg:col-span-6 mt-12 lg:mt-0">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="relative"
              >
                {/* Cercle principal animé */}
                <div className="relative w-96 h-96 mx-auto">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 opacity-20"
                  />
                  
                  {/* Formules qui tournent */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      key={currentFormula}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="bg-white rounded-3xl shadow-2xl p-8 text-center border-4 border-purple-200"
                    >
                      <div className="text-6xl mb-4">
                        {funFormulas[currentFormula].emoji}
                      </div>
                      <div 
                        className="text-4xl font-bold mb-2"
                        style={{ color: funFormulas[currentFormula].color }}
                      >
                        {funFormulas[currentFormula].formula}
                      </div>
                      <div className="text-gray-600 font-medium">
                        Maths = Fun!
                      </div>
                    </motion.div>
                  </div>

                  {/* Particules flottantes */}
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-4 h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
                      style={{
                        top: `${20 + Math.sin(i * Math.PI / 4) * 30}%`,
                        left: `${20 + Math.cos(i * Math.PI / 4) * 30}%`,
                      }}
                      animate={{
                        y: [0, -20, 0],
                        opacity: [0.7, 1, 0.7],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: i * 0.3,
                      }}
                    />
                  ))}
                </div>

                {/* Bulles d'encouragement */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute -top-8 -left-8 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-bold shadow-lg"
                >
                  Super ! 🌟
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
                  className="absolute -bottom-8 -right-8 bg-green-400 text-green-900 px-4 py-2 rounded-full font-bold shadow-lg"
                >
                  Bravo ! 🎯
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultMode="signup"
      />
    </>
  );
} 