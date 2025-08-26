import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ComparaisonSection() {
  const [currentComparaison, setCurrentComparaison] = useState(0);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Contenu des comparaisons */}
    </motion.div>
  );
}

