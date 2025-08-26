import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ProblemeSection() {
  const [currentProbleme, setCurrentProbleme] = useState(0);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Contenu des problèmes */}
    </motion.div>
  );
}

