'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PositionCardProps {
  icon: string;
  title: string;
  description: string;
}

function PositionCard({ icon, title, description }: PositionCardProps) {
  const [isAnimating, setIsAnimating] = React.useState(false);
  const [audio, setAudio] = React.useState<HTMLAudioElement | null>(null);

  const handleClick = () => {
    // Animation plus prononcée
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 800); // Animation plus longue

    // Audio avec phrase complète
    const phrase = title === 'dessus' ? 'Le nuage est au-dessus du garçon' :
                  title === 'dessous' ? 'La feuille est en-dessous de l\'arbre' :
                  title === 'devant' ? 'La voiture est devant la maison' :
                  title === 'derrière' ? 'Le chat est derrière le fauteuil' :
                  title === 'à côté' ? 'Le cerf est à côté de l\'arbre' :
                  'La fleur est entre les deux arbres';

    // Utiliser l'API Web Speech si l'audio n'est pas encore chargé
    if (window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.lang = 'fr-FR';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <motion.div
      className="bg-gray-100 rounded-lg p-8 text-center cursor-pointer relative"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleClick}
    >
      <motion.div
        animate={{
          scale: isAnimating ? 1.4 : 1,
          y: isAnimating ? -20 : 0,
          rotate: isAnimating ? [0, 5, -5, 0] : 0
        }}
        transition={{ duration: 0.8 }}
        className="text-6xl mb-4"
      >
        {icon}
      </motion.div>
      <h3 className="text-blue-600 font-bold text-xl mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>

      {/* Indicateur de clic */}
      <motion.div
        className="absolute -bottom-2 right-2 bg-blue-100 rounded-full px-3 py-1 text-sm text-blue-600"
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
    </motion.div>
  );
}

export default function PositionsPage() {
  const positions = [
    {
      icon: '☁️',
      title: 'dessus',
      description: 'Au-dessus, plus haut'
    },
    {
      icon: '🌱',
      title: 'dessous',
      description: 'En-dessous, plus bas'
    },
    {
      icon: '🚗',
      title: 'devant',
      description: 'En face, à l\'avant'
    },
    {
      icon: '🐱',
      title: 'derrière',
      description: 'A l\'arrière, caché derrière'
    },
    {
      icon: '🦌',
      title: 'à côté',
      description: 'Sur le côté, près de'
    },
    {
      icon: '🌸',
      title: 'entre',
      description: 'Au milieu de deux objets'
    }
  ];

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-2xl font-bold text-blue-600 mb-8 text-center flex items-center justify-center gap-2">
        Les mots magiques de l&apos;espace
        <span role="img" aria-label="magic">🪄</span>
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {positions.map((position) => (
          <PositionCard
            key={position.title}
            icon={position.icon}
            title={position.title}
            description={position.description}
          />
        ))}
      </div>
    </div>
  );
}