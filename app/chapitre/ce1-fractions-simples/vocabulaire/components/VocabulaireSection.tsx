import { useState } from 'react';
import { motion } from 'framer-motion';

export default function VocabulaireSection() {
  const [currentTerm, setCurrentTerm] = useState(0);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Contenu de la section vocabulaire */}
    </motion.div>
  );
}

