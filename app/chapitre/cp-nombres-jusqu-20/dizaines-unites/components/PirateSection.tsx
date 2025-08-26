import { motion } from 'framer-motion';

export default function PirateSection() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Contenu avec Sam le Pirate */}
    </motion.div>
  );
}

