import { motion } from 'framer-motion';

export default function CoursSection() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Contenu de la section cours */}
    </motion.div>
  );
}

