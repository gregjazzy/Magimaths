'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface PositionCardProps {
  icon: string;
  title: string;
  description: string;
}

export default function PositionCard({ icon, title, description }: PositionCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const handleClick = () => {
    // Démarrer l'animation
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 800);

    // Jouer l'audio
    if (!audio) {
      const newAudio = new Audio('/audio/positions/le-nuage-est-au-dessus-du-garcon.mp3');
      setAudio(newAudio);
      newAudio.play();
    } else {
      audio.currentTime = 0;
      audio.play();
    }
  };

  return (
    <motion.div
      className="bg-gray-100 rounded-lg p-8 text-center cursor-pointer min-h-[300px] flex flex-col items-center justify-center"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
    >
      {/* Image du garçon (fixe) */}
      <div className="relative w-full h-48 mb-4">
        <img 
          src="/images/boy.png" 
          alt="garçon" 
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-40 object-contain"
        />
        
        {/* Nuage animé */}
        <motion.div
          className="absolute top-0 left-1/2 transform -translate-x-1/2"
          animate={{
            scale: isAnimating ? 1.3 : 1,
            y: isAnimating ? -20 : 0
          }}
          transition={{ duration: 0.5 }}
        >
          <img 
            src="/images/cloud.png" 
            alt="nuage" 
            className="w-32 h-32 object-contain"
          />
        </motion.div>
      </div>

      <h3 className="text-blue-600 font-bold text-2xl mb-2">{title}</h3>
      <p className="text-gray-600 text-lg">{description}</p>

      {/* Indicateur de clic */}
      <motion.div
        className="mt-4 text-sm text-blue-500"
        animate={{
          opacity: [0.5, 1, 0.5],
          scale: [1, 1.1, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        Cliquez pour voir et entendre
      </motion.div>
    </motion.div>
  );
}