import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function SimplePositionCard() {
  const [isActive, setIsActive] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const playAudio = () => {
    if (!audio) {
      const newAudio = new Audio('/audio/positions/dessus.mp3');
      setAudio(newAudio);
      newAudio.play();
    } else {
      audio.currentTime = 0;
      audio.play();
    }
  };

  const handleClick = () => {
    setIsActive(true);
    playAudio();
    // Réinitialiser après l'animation
    setTimeout(() => setIsActive(false), 1000);
  };

  return (
    <motion.div
      className="relative w-full max-w-sm mx-auto bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
    >
      {/* Conteneur principal avec bordure subtile */}
      <div className="p-6 border border-gray-100">
        {/* Zone du nuage */}
        <motion.div 
          className="flex justify-center mb-4"
          animate={{
            scale: isActive ? 1.2 : 1,
            y: isActive ? -10 : 0
          }}
          transition={{ duration: 0.3 }}
        >
          <span className="text-6xl">☁️</span>
        </motion.div>

        {/* Titre et description */}
        <div className="text-center">
          <h3 className="text-2xl font-bold text-blue-600 mb-2">dessus</h3>
          <p className="text-gray-600">Au-dessus, plus haut</p>
        </div>

        {/* Indicateur de clic */}
        <motion.div 
          className="absolute bottom-2 right-2 bg-blue-100 rounded-full px-3 py-1 text-sm text-blue-600"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.7, 1, 0.7]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          Cliquez-moi !
        </motion.div>
      </div>

      {/* Effet de brillance sur hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-20 transition-opacity duration-300" />
    </motion.div>
  );
}
