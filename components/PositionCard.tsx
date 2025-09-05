'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function PositionCard({ icon, title, description }) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    if (title === 'dessus') {
      // Animation du nuage
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 800);

      // Audio
      const utterance = new SpeechSynthesisUtterance("Le nuage est au-dessus du garçon");
      utterance.lang = 'fr-FR';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div 
      className="bg-gray-100 rounded-lg p-6 text-center cursor-pointer"
      onClick={handleClick}
    >
      <motion.div
        animate={
          title === 'dessus' && isAnimating 
            ? { scale: 1.3, y: -10 }
            : { scale: 1, y: 0 }
        }
        transition={{ duration: 0.5 }}
        className="text-4xl mb-3"
      >
        {icon}
      </motion.div>
      <h3 className="text-blue-600 font-bold mb-1">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}
