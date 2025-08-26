import { motion } from 'framer-motion';

export default function ResolutionSection() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Contenu des résolutions */}
    </motion.div>
  );
}

