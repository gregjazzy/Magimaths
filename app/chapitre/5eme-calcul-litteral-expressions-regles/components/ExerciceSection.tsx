import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ExerciceSection() {
  const [currentExercice, setCurrentExercice] = useState(0);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Contenu des exercices */}
    </motion.div>
  );
}

